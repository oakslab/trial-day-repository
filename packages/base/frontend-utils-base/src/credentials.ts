export const saveCredentialsToBrowser = async (
  email: string,
  password: string,
) => {
  if ('credentials' in navigator && 'PasswordCredential' in window) {
    const credentials = new (window.PasswordCredential as any)({
      id: email,
      password,
    });
    await navigator.credentials.store(credentials);
  }
};

export const saveCredentialsToBrowserSilentError = async (
  email: string,
  password: string,
) => {
  try {
    await saveCredentialsToBrowser(email, password);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};
