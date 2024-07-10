import { trpc } from '@base/frontend-utils-base';

export const useCreateUserMutation = (
  args?: Parameters<typeof trpc.user.create.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.create.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useDeleteUserMutation = (
  args?: Parameters<typeof trpc.user.delete.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.delete.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
        await utils.user.listCountByStatus.invalidate();
      }
    },
  });
};

export const useUpdateUserMutation = (
  args?: Parameters<typeof trpc.user.update.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.update.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useDisableUserMutation = (
  args?: Parameters<typeof trpc.user.disable.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.disable.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useEnableUserMutation = (
  args?: Parameters<typeof trpc.user.enable.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.enable.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useInviteUserMutation = (
  args?: Parameters<typeof trpc.user.invite.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.invite.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useResendInviteMutation = (
  args?: Parameters<typeof trpc.user.resendInvite.useMutation>[0],
) => {
  const utils = trpc.useUtils();

  return trpc.user.resendInvite.useMutation({
    ...args,
    onSuccess: async (...rest) => {
      await args?.onSuccess?.(...rest);
      if (rest[0].result === 'success') {
        await utils.user.list.invalidate();
      }
    },
  });
};

export const useActOnBehalfMutation = (
  args?: Parameters<typeof trpc.user.actOnBehalf.useMutation>[0],
) => {
  return trpc.user.actOnBehalf.useMutation(args);
};
