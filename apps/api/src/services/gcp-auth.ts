import { createPublicKey } from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { apiEnv } from '../lib/env';

@Service()
export class GcpAuthService {
  private readonly googleDiscoveryDocumentUri =
    'https://accounts.google.com/.well-known/openid-configuration';

  extractToken(bearerToken: string) {
    if (bearerToken.match(/bearer /i)) {
      return bearerToken.substring(7, bearerToken.length);
    } else {
      throw new Error('Unexpected token prefix');
    }
  }

  async verifyGcpIdToken(
    token: string,
    audience?: string,
  ): Promise<string | jwt.JwtPayload> {
    const cert = await this.getCert();
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new Error('Error decoding jwt');
    }

    const { kid } = decoded.header;
    const verificationJwk = (cert.keys as { kid: string }[]).find(
      (key) => key.kid === kid,
    );

    if (!verificationJwk) {
      throw new Error('Public key not found');
    }

    const publicKey = createPublicKey({
      key: verificationJwk,
      format: 'jwk',
    });

    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      ...(audience && { audience }),
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
    });
  }

  verifyCloudTaskIdToken(token: string) {
    const cloudTaskAudience = `${apiEnv.API_URL}${apiEnv.CLOUD_TASKS_HANDLER_URL}`;
    return this.verifyGcpIdToken(token, cloudTaskAudience);
  }

  private async getCertUri() {
    const response = await axios.get(this.googleDiscoveryDocumentUri);
    return response.data['jwks_uri'] as string;
  }

  private async getCert() {
    const certUri = await this.getCertUri();
    const response = await axios.get(certUri);
    return response.data;
  }
}
