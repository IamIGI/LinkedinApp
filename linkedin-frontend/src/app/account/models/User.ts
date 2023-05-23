export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  isPrivateAccount: boolean;
  company: string | null;
  education: string | null;
  subscribers: number | null;
}
