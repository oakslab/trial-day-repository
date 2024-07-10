import { ClaimsType } from '@base/common-base';
import firebase from 'firebase-admin';
import {
  Auth,
  CreateRequest,
  DecodedIdToken,
  UpdateRequest,
} from 'firebase-admin/auth';
import { firebaseAdminApp } from './firebaseAdminApp';

export class FirebaseAuthService {
  auth: Auth;
  adminApp: firebase.app.App;

  constructor() {
    this.adminApp = firebaseAdminApp;
    this.auth = firebaseAdminApp.auth();
  }

  extractToken(bearerToken: string) {
    if (bearerToken.match(/bearer /i)) {
      return bearerToken.substring(7, bearerToken.length);
    } else {
      throw new Error('Unexpected token prefix');
    }
  }

  verifyToken(token: string): Promise<DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }

  getUserByEmail(email: string) {
    return this.auth.getUserByEmail(email);
  }

  getFirebaseUser(uid: string) {
    return this.auth.getUser(uid);
  }

  setCustomClaims(uid: string, newClaims: ClaimsType) {
    return this.auth.setCustomUserClaims(uid, { ...newClaims });
  }

  updateFirebaseUser(uid: string, data: UpdateRequest) {
    return this.auth.updateUser(uid, data);
  }

  revokeRefreshTokens(uid: string) {
    return this.auth.revokeRefreshTokens(uid);
  }

  async generatePasswordResetLink(email: string, portalHostname: string) {
    const originalLink = await this.auth.generatePasswordResetLink(email);
    const oobCode = new URL(originalLink).searchParams.get('oobCode');
    return `${portalHostname}/auth/reset-password-confirm?oobCode=${oobCode}&email=${encodeURIComponent(email)}`;
  }

  async generateVerifyEmailLink(email: string, portalHostname: string) {
    const originalLink = await this.auth.generateEmailVerificationLink(email);
    const oobCode = new URL(originalLink).searchParams.get('oobCode');
    return `${portalHostname}/auth/verify-email-process?oobCode=${oobCode}&email=${encodeURIComponent(email)}`;
  }

  createFirebaseUser(data: CreateRequest) {
    return this.auth.createUser(data);
  }

  createCustomToken(uid: string, claims?: ClaimsType) {
    return this.auth.createCustomToken(uid, claims);
  }

  async deleteFirebaseUser(userUid: string): Promise<void> {
    await this.auth.deleteUser(userUid);
  }

  async deleteMultipleFirebaseUsers(userUids: string[]): Promise<void> {
    await Promise.all(userUids.map((userUid) => this.auth.deleteUser(userUid)));
  }
}
