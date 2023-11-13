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
}
