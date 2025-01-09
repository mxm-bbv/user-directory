<template>
  <div class="rounded-xl bg-gray-100 p-3 max-w-full">
    <div class="bg-white rounded-xl shadow-md">
      <div
        class="min-w-max p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center lg:items-center">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">Справочник пользователей</h1>
          <p class="text-sm sm:text-lg md:text-sm text-gray-500 mt-2">Управляйте списком пользователей и их ролями.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:p-6 flex justify-center sm:justify-end w-full sm:w-auto">
          <button
            class="bg-[#4A9B7F] text-white px-6 py-2 rounded-lg hover:bg-[#0A3431] transition w-full sm:w-auto"
            @click="openAddUser"
          >
            Добавить пользователя
          </button>
        </div>
      </div>

      <UserTable
        :users="users"
        @edit="openEditUser"
        @block="blockUser"
        @unblock="unblockUser"
      />
    </div>

    <Modal v-if="isModalOpen">
      <UserForm
        :user="currentUser"
        :isEdit="isEdit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>


<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import UserTable from "@/components/UserTable.vue";
import UserForm from "@/components/UserForm.vue";
import Modal from "@/components/Modal.vue";
import UsersService from '@/api/users';
import type {User} from "@/types/User";
import type {AddUser} from "@/types/api/actions/AddUser.ts";

export default defineComponent({
  components: {UserTable, UserForm, Modal},
  setup() {
    const users = ref<User[]>([]);
    const isModalOpen = ref(false);
    const isEdit = ref(false);
    const currentUser = ref<User | null>(null);

    const fetchUsers = async () => {
      try {
        const response = await UsersService.getUsers();
        users.value = response.users;
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };

    const blockUser = async (id: number) => {
      try {
        await UsersService.blockUser({id});
        await fetchUsers();
      } catch (error) {
        console.error('Ошибка блокировки пользователя:', error);
      }
    };

    const unblockUser = async (id: number) => {
      try {
        await UsersService.unblockUser({id});
        await fetchUsers();
      } catch (error) {
        console.error('Ошибка разблокировки пользователя:', error);
      }
    };

    const openAddUser = () => {
      currentUser.value = {
        name: "",
        login: "",
        password: "",
        role: 'user',
        blocked: false,
      } as AddUser;
      isEdit.value = false;
      isModalOpen.value = true;
    };

    const openEditUser = (user: User) => {
      currentUser.value = {...user};
      isEdit.value = true;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    onMounted(fetchUsers);

    return {
      users,
      isModalOpen,
      isEdit,
      currentUser,
      openAddUser,
      openEditUser,
      blockUser,
      unblockUser,
      closeModal,
    };
  },
});
</script>
