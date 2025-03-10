export interface User {
  id?: number;
  name: string;
  login: string;
  password?: string;
  role?: 'admin' | 'user';
  blocked?: boolean;
}
