import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Service } from 'typedi';
import gcpAccountJson from '../../../gcp-service-account.json';
import { apiEnv } from '../../lib/env';

@Service({ global: true })
export class UserAssetsService {
  private readonly storage: Storage;
  private readonly bucket: string;
  private readonly EXPIRATION_MILLISECONDS = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.storage = new Storage({
      projectId: apiEnv.GOOGLE_CLOUD_PROJECT,
      credentials: gcpAccountJson,
    });
    this.bucket = apiEnv.USER_ASSETS_BUCKET;
  }

  private get urlExpiration() {
    return Date.now() + this.EXPIRATION_MILLISECONDS;
  }

  public streamFileFromStorage({
    userId,
    filename,
    location,
  }: {
    userId: string;
    filename: string;
    location: 'public' | 'private';
  }) {
    const mimeType = this.getExtension(filename);
    return {
      mimeType,
      stream: this.storage
        .bucket(this.bucket)
        .file(`${userId}/${location}/${filename}`)
        .createReadStream(),
    };
  }

  public async deleteFileFromStorage({
    userId,
    filename,
    location,
  }: {
    filename: string;
    userId: string;
    location: 'public' | 'private';
  }) {
    const file = this.storage
      .bucket(this.bucket)
      .file(`${userId}/${location}/${filename}`);
    await file.delete();
  }

  private getExtension(filename: string) {
    const extension = filename.split('.').pop();

    switch (extension) {
      case 'jpeg':
      case 'jpg':
        return `image/jpeg`; // even jpg should always lead to image/jpeg
      default:
        return `image/${extension}`;
    }
  }

  public async generateSignedUrl({
    userId,
    location,
    filename,
    action = 'read',
  }: {
    userId: string;
    filename: string;
    location: 'public' | 'private';
    action: GetSignedUrlConfig['action'];
  }): Promise<string> {
    // Ensure the folders exist before generating the signed URL
    const folderPath = `${userId}/${location}`;
    const bucket = this.storage.bucket(this.bucket);
    const file = bucket.file(`${folderPath}/${filename}`);

    // Create folder if it doesn't exist
    const exists = await file.exists();
    if (!exists[0]) {
      await bucket.file(folderPath + '/').save('');
    }

    const config: GetSignedUrlConfig = {
      version: 'v4',
      expires: this.urlExpiration,
      action,
      contentType: action === 'write' ? this.getExtension(filename) : undefined,
    };

    const signedUrl = await file.getSignedUrl(config);

    return signedUrl[0];
  }
}
