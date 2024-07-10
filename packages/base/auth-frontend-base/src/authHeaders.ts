import { registerHttpHeaderProvider } from '@base/common-base';
import { v4 as generateUuidV4 } from 'uuid';
import { FirebaseAuth } from './firebaseClientAuth';

// Token
registerHttpHeaderProvider(async () => {
  const token = await FirebaseAuth.auth?.currentUser?.getIdToken();

  return {
    ...(token && { authorization: `Bearer ${token}` }),
  };
});

// Reguest ID
registerHttpHeaderProvider(async () => {
  const requestId = generateUuidV4();
  return {
    'X-Request-ID': `client_${requestId}`,
  };
});
