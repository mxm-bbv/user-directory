import {defineStore} from 'pinia';
import type {UnwrapRef} from "vue";

interface User {
  id: number;
  fullName: string;
  login: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    addUser(user) {
      console.log('Adding user:', user);

      this.users.push(user);
    },

    updateUser(updatedUser: {
      password: UnwrapRef<{ password, role, fullName, id, login }["password"]>,
      role: UnwrapRef<{ password, role, fullName, id, login }["role"]>,
      fullName: UnwrapRef<{ password, role, fullName, id, login }["fullName"]>,
      id: UnwrapRef<{ password, role, fullName, id, login }["id"]>,
      login: UnwrapRef<{ password, role, fullName, id, login }["login"]>
    }) {
      const index = this.users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
    },

    getAllUsers() {
      return this.users;
    },

    deleteUser(id: number) {
      this.users = this.users.filter(user => user.id !== id);
    },

    blockUser(id: number) {
      const user = this.users.find(user => user.id === id);
      if (user) {
        user.isBlocked = true;
      }
    },

    unblockUser(id: number) {
      const user = this.users.find(user => user.id === id);
      if (user) {
        user.isBlocked = false;
      }
    },
  },
});
