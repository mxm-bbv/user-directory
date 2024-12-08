<template>
  <div class="rounded-xl bg-gray-100 p-3">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      <div class="p-6 border-b flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-semibold text-gray-800">Справочник пользователей</h1>
          <p class="text-gray-500 mt-2">Управляйте списком пользователей и их ролями.</p>
        </div>
        <div class="p-6 flex justify-end">
          <button
            class="bg-[#4A9B7F] text-white px-6 py-2 rounded-lg hover:bg-[#0A3431] transition"
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
        @save="saveUser"
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
import {User} from '@/types/User';

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
        if (response && Array.isArray(response.users)) {
          users.value = response.users;
        } else {
          console.error('Не удалось получить список пользователей.', response);
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };


    const saveUser = async (user: User) => {
      try {
        if (isEdit.value && user.id) {
          await UsersService.updateUser(user.id, user);
        } else {
          await UsersService.addUser(user);
        }
        closeModal();
        await fetchUsers();
      } catch (error) {
        console.error('Ошибка сохранения пользователя:', error);
      }
    };

    const blockUser = async (id: number) => {
      try {
        await UsersService.blockUser(id);
        await fetchUsers();
      } catch (error) {
        console.error('Ошибка блокировки пользователя:', error);
      }
    };

    const unblockUser = async (id: number) => {
      try {
        await UsersService.unblockUser(id);
        await fetchUsers();
      } catch (error) {
        console.error('Ошибка разблокировки пользователя:', error);
      }
    };

    const openAddUser = () => {
      currentUser.value = {id: 0, fullName: "", login: "", password: "", role: 'user', isBlocked: false};
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
      saveUser,
      blockUser,
      unblockUser,
      closeModal,
    };
  },
});
</script>
