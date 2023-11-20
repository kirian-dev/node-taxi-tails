import { AuthRoles } from 'src/common/enums/roles.enum';

export class User {
  _id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password?: string;
  city: string;
  is_verify: boolean;
  verification_code: string;
  is_verify_docs: boolean;
  roles: AuthRoles[];
}
