import { UserRole } from 'database';

export type ClaimsType = {
  id: string;
  role: UserRole;
  original_user_id?: string;
};

export const claimsKeyList = [
  'id',
  'role',
  'original_user_id',
] satisfies (keyof Claims)[];

export class Claims {
  public id: string;
  public role: UserRole;
  public original_user_id?: string;

  constructor(input: ClaimsType) {
    this.id = input.id;
    this.role = input.role;
    this.original_user_id = input.original_user_id;
  }
}
