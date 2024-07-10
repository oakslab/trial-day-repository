import { trackExceptionInSentry } from '@base/frontend-utils-base';
import { parseISO } from 'date-fns';

export const getFileFromSignedUrl = (signedUrl: string) => {
  return fetch(signedUrl);
};

export const uploadFileToSignedUrl = (
  file: File,
  signedUrl: string,
  fileExtension?: string,
  onProgress?: (progress: number) => void,
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 100);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.responseText);
        }
      }
    };

    xhr.open('PUT', signedUrl, true);
    xhr.setRequestHeader('Content-Type', `image/${fileExtension}`);
    xhr.send(file);
  });
};

export const getFileExtension = (filename: string) => {
  const regex = /(?:\.([^.]+))?$/;

  const extension = regex.exec(filename)?.[1];

  // jpg and jpeg share same mime type
  return extension === 'jpeg' || extension === 'jpg' ? 'jpeg' : extension;
};

export const validateSignedUrlExpiration = (
  callback: () => void,
  signedUrl?: string | null,
) => {
  if (!signedUrl) return;

  try {
    const expirationParam = new URLSearchParams(signedUrl).get(
      'X-Goog-Expires',
    );
    const validSinceParam = new URLSearchParams(signedUrl).get('X-Goog-Date');

    const validSince = parseISO(validSinceParam ?? '');

    const expiration = validSince.setSeconds(
      validSince.getSeconds() + parseInt(expirationParam ?? '0'),
    );

    if (new Date().getTime() >= expiration) {
      callback();
    }
  } catch (error) {
    trackExceptionInSentry(error);
    console.error(
      'Error occurred while validating signed URL expiration:',
      error,
    );
  }
};
