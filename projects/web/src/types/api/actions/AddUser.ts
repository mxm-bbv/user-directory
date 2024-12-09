import type {User} from "@/types/User.ts";

export type AddUser = Omit<User, 'id' | 'role'> & {
  role?: 'admin' | 'user';
};
