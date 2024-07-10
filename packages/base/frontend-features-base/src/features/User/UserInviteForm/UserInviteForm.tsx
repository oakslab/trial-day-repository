import { userRoles } from '@base/common-base/src/domain/user/user.types';
import { RHFSelect, RHFTextField } from '@base/ui-base/components/hook-form';
import { MenuItem } from '@base/ui-base/ui';
import { FieldValues, FormState } from 'react-hook-form';

export function UserInviteForm<T extends FieldValues>({
  formState,
}: {
  formState: FormState<T>;
}) {
  return (
    <>
      <RHFTextField
        name="email"
        label="Email"
        error={Boolean(formState.errors['email'])}
        helperText={formState.errors['email']?.message?.toString()}
        InputLabelProps={{ shrink: true }}
      />
      <RHFSelect
        name="role"
        label="Role"
        error={Boolean(formState.errors['role'])}
        helperText={formState.errors['role']?.message?.toString()}
        InputLabelProps={{ shrink: true }}
      >
        {userRoles?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>
    </>
  );
}
