export interface NewUser {
  email: string;
  firstName: string;
  lastName: string | null;
  isPrivateAccount: boolean;
  password: string;
}
