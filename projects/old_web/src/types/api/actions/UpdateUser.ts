import type {User} from "@/types/User.ts";

export type UpdateUser = Partial<Omit<User, 'id'>> & {
  id: number;
};
