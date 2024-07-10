import {
  userRoles,
  userStatuses,
} from '@base/common-base/src/domain/user/user.types';
import { RHFSelect, RHFTextField } from '@base/ui-base/components/hook-form';
import { MenuItem } from '@base/ui-base/ui';
import { FieldValues, FormState } from 'react-hook-form';

export function UserForm<T extends FieldValues>({
  formState,
}: {
  formState: FormState<T>;
}) {
  return (
    <>
      <RHFTextField
        name="firstName"
        label="First Name"
        error={Boolean(formState.errors['firstName'])}
        helperText={formState.errors['firstName']?.message?.toString()}
        InputLabelProps={{ shrink: true }}
      />
      <RHFTextField
        name="lastName"
        label="Last Name"
        error={Boolean(formState.errors['lastName'])}
        helperText={formState.errors['lastName']?.message?.toString()}
        InputLabelProps={{ shrink: true }}
      />
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
      <RHFSelect
        name="status"
        label="Status"
        error={Boolean(formState.errors['status'])}
        helperText={formState.errors['status']?.message?.toString()}
        InputLabelProps={{ shrink: true }}
      >
        {userStatuses?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>
    </>
  );
}
