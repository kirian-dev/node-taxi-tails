import { AuthRoles } from '../enums/roles.enum';

export interface IAuthUser {
  userId: string;
  roles: AuthRoles[];
}
