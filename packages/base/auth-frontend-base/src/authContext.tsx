import {
  useContext,
  createContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import {
  Claims,
  FieldValidationError,
  LoginMutationInputType,
  SendAuthEmailInputType,
  SignupFormInputType,
  SignupMutationInputType,
  claimsKeyList,
} from '@base/common-base';
import type { User as DBUser } from '@base/common-base/src/domain/user';
import {
  signOut,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  ReactNativeAsyncStorage,
  ParsedToken,
  applyActionCode,
  onAuthStateChanged,
} from '@firebase/auth';
import { UserRole } from 'database';
import { FirebaseError } from 'firebase/app';
import { pick } from 'lodash';
import { AuthErrorCode } from './authErrorCode';
import { FirebaseAuth } from './firebaseClientAuth';
import { generateProfilePictureUrl } from './generateAvatar';

type Props = {
  sendVerificationEmail: (data: SendAuthEmailInputType) => Promise<{
    result: 'success';
  }>;
  sendResetPasswordEmail: (data: SendAuthEmailInputType) => Promise<{
    result: 'success';
  }>;
  fetchUser: () => Promise<{ data: DBUser | undefined; error: unknown }>;
  invalidateCache: () => unknown;
  signupUser: (data: SignupMutationInputType) => Promise<
    | {
        result: 'error';
        error: FieldValidationError<'email'>;
      }
    | {
        result: 'success';
        data: {
          status: string;
        };
      }
  >;
  isSigningUp: boolean;
  trackExceptionInSentry: (error: unknown) => unknown;
  storage?: ReactNativeAsyncStorage;
  hostUrl?: string;
  apiUrl: string;
};

export const useAuthSetup = ({
  sendVerificationEmail,
  sendResetPasswordEmail,
  fetchUser,
  invalidateCache,
  signupUser,
  isSigningUp,
  trackExceptionInSentry,
  storage,
  hostUrl,
  apiUrl,
}: Props) => {
  new FirebaseAuth(storage, hostUrl);
  const user = FirebaseAuth.auth?.currentUser;

  const [isFirebaseAuthLoading, setIsFirebaseAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<DBUser>();
  const [claims, setClaims] = useState<Claims>();

  const fetchUserProfile = useCallback(async () => {
    setIsFirebaseAuthLoading(true);
    const userProfile = await fetchUser();
    setUserProfile(userProfile.data);
    setIsFirebaseAuthLoading(false);
    return userProfile.data;
  }, [fetchUser, setUserProfile]);

  const refreshUser = useCallback(async () => {
    if (!user)
      throw new Error(
        'This method can be called only when user authenticated.',
      );

    await user?.reload();
    return user;
  }, [user]);

  const setPickedClaims = useCallback((claims: ParsedToken) => {
    setClaims(pick(claims as unknown as Claims, claimsKeyList));
  }, []);

  const refetchToken = useCallback(async () => {
    const tokenResult = await user?.getIdTokenResult(true);
    if (tokenResult?.claims) {
      setPickedClaims(tokenResult.claims);
    }
    return tokenResult;
  }, [user]);

  const logout = useCallback(async () => {
    invalidateCache();
    return signOut(FirebaseAuth.auth);
  }, []);

  const resetPassword = useCallback(
    (email: string) => sendResetPasswordEmail({ email }),
    [],
  );

  const confirmPassword = useCallback(
    (oobCode: string, newPassword: string) =>
      confirmPasswordReset(FirebaseAuth.auth, oobCode, newPassword),
    [],
  );

  const sendEmailVerification = useCallback(
    async (email: string) => sendVerificationEmail({ email }),
    [user],
  );

  const verifyEmail = useCallback(
    async (oobCode: string) => {
      try {
        await applyActionCode(FirebaseAuth.auth, oobCode);
        if (user) {
          // get updated "user.emailVerified"
          await refreshUser();
        }
        return 'success';
      } catch (err) {
        trackExceptionInSentry(err);
        return 'error';
      }
    },
    [user],
  );

  const fetchUserLock = useRef(false);

  const loginInternal = useCallback(
    async <T,>(
      loginCallback: () => Promise<T>,
      expectedUserRoles?: UserRole[],
    ) => {
      fetchUserLock.current = true;

      try {
        await loginCallback();

        const userProfile = await fetchUser();
        if (userProfile.error) {
          trackExceptionInSentry(userProfile.error);
          throw userProfile.error;
        }

        const tokenResult =
          await FirebaseAuth.auth.currentUser?.getIdTokenResult();
        if (tokenResult) setPickedClaims(tokenResult.claims);

        const receivedUserRole = userProfile.data?.role;
        if (!receivedUserRole) {
          throw new Error('Failed to fetch information about the user.');
        }
        if (
          expectedUserRoles &&
          !expectedUserRoles.includes(receivedUserRole)
        ) {
          await logout();
          throw new FirebaseError(
            AuthErrorCode.USER_ROLE_MISMATCH,
            `Oops! You are attempting to access the wrong portal. ${receivedUserRole} accounts should be accessed through the dedicated portal.`,
          );
        }

        setUserProfile(userProfile.data);
        return userProfile.data;
      } finally {
        fetchUserLock.current = false;
      }
    },
    [fetchUserProfile],
  );

  const loginUsingCustomToken = useCallback(
    (token: string, expectedUserRoles?: UserRole[]) => {
      return loginInternal(
        async () => signInWithCustomToken(FirebaseAuth.auth, token),
        expectedUserRoles,
      );
    },
    [],
  );

  const login = useCallback(
    async (data: LoginMutationInputType, expectedUserRoles: UserRole[]) => {
      return loginInternal(
        async () =>
          signInWithEmailAndPassword(
            FirebaseAuth.auth,
            data.email,
            data.password,
          ),
        expectedUserRoles,
      );
    },
    [loginInternal],
  );

  const signup = useCallback(async (data: SignupFormInputType) => {
    fetchUserLock.current = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseAuth.auth,
        data.email,
        data.password,
      );

      const response = await signupUser({
        ...data,
        uid: userCredential.user.uid,
      });

      await sendEmailVerification(data.email);

      const tokenResult =
        await FirebaseAuth.auth.currentUser?.getIdTokenResult();
      if (tokenResult) setPickedClaims(tokenResult.claims);

      await fetchUserProfile();

      return response;
    } finally {
      fetchUserLock.current = false;
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(FirebaseAuth.auth, async (userOrNull) => {
      if (userOrNull) {
        if (!fetchUserLock.current) {
          await fetchUserProfile();
          const tokenResult = await userOrNull.getIdTokenResult();
          setPickedClaims(tokenResult.claims);
        }
      } else {
        setClaims(undefined);
        setUserProfile(undefined);
      }

      setIsFirebaseAuthLoading(false);
    });
  }, [fetchUser]);

  const avatarSrc = useMemo(() => {
    if (!userProfile || !apiUrl) {
      return undefined;
    }

    return generateProfilePictureUrl({
      apiUrl,
      userId: userProfile.id,
      avatarId: userProfile.avatarId,
    });
  }, [userProfile]);

  return {
    user,
    userProfile,
    avatarSrc,
    claims,
    refetchToken,
    refreshUser,
    login,
    loginUsingCustomToken,
    logout,
    signup,
    resetPassword,
    confirmPassword,
    fetchUserProfile,
    sendEmailVerification,
    verifyEmail,
    isLoadingUserProfile: isFirebaseAuthLoading,
    isMutatingSignup: isSigningUp,
  };
};

/* Context */
export type AuthContextType = ReturnType<typeof useAuthSetup>;

export const AuthContext = createContext<AuthContextType>(
  {} as unknown as AuthContextType,
);

/* Usage */
export const useAuth = () => useContext(AuthContext);
