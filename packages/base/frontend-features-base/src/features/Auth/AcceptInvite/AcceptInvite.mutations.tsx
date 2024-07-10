import { trpc } from '@base/frontend-utils-base';

export const useUserAcceptInviteMutation = (
  args?: Parameters<typeof trpc.user.acceptInvite.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.acceptInvite.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};
