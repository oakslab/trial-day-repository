type HeaderProvider = () => Promise<unknown>;

const providers: HeaderProvider[] = [];

// Register | Unregister
export const registerHttpHeaderProvider = (provider: HeaderProvider) => {
  providers.push(provider);
};

export const unregisterHttpHeaderProvider = (provider: HeaderProvider) => {
  const index = providers.indexOf(provider);
  if (index !== -1) {
    providers.splice(index, 1);
  }
};

// Export for TRPC
export const getHttpHeaders = async () => {
  const headers = {};
  for (const provider of providers) {
    Object.assign(headers, await provider());
  }
  return headers;
};
