import { FirebaseAuthService } from '@base/auth-backend-base';
import { Service } from 'typedi';

@Service()
export class AuthService extends FirebaseAuthService {}

@Service()
export class AuthServiceMock {
  constructor() {}

  extractToken(bearerToken: string) {
    return bearerToken;
  }

  verifyToken(_: string) {
    return Promise.resolve({ uid: 'mock-uid' });
  }

  getUserByEmail(email: string) {
    return Promise.resolve({ uid: 'mock-uid', email });
  }

  getFirebaseUser(uid: string) {
    return Promise.resolve({ uid });
  }

  setCustomClaims(uid: string, newClaims: Record<string, unknown>) {
    return Promise.resolve({ uid, customClaims: newClaims });
  }

  updateFirebaseUser(uid: string, data: Record<string, unknown>) {
    return Promise.resolve({ uid, data });
  }

  revokeRefreshTokens(uid: string) {
    return Promise.resolve({ uid });
  }

  generatePasswordResetLink(email: string) {
    return Promise.resolve({ email });
  }

  createFirebaseUser(data: Record<string, unknown>) {
    return Promise.resolve({ uid: 'mock-uid', ...data });
  }

  async deleteFirebaseUser(_: string): Promise<void> {
    return Promise.resolve();
  }

  async deleteMultipleFirebaseUsers(_: string[]): Promise<void> {
    return Promise.resolve();
  }
}
