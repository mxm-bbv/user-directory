<template>
  <div class="overflow-x-auto">
    <table class="table-auto w-full text-left border-collapse">
      <thead class="bg-gray-50 border-b">
      <tr class="text-gray-600 text-sm">
        <th class="px-6 py-4 font-medium">ID</th>
        <th class="px-6 py-4 font-medium">ФИО</th>
        <th class="px-6 py-4 font-medium">Логин</th>
        <th class="px-6 py-4 font-medium">Роль</th>
        <th class="px-6 py-4 font-medium">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="user in processedUsers"
        :key="user.id"
        class="hover:bg-gray-100 transition border-b"
        :class="{ 'bg-gray-200': user.blocked }"
      >
        <td class="px-6 py-4 text-gray-700 text-center">{{ user.id }}</td>
        <td class="px-6 py-4 text-gray-700">{{ user.name }}</td>
        <td class="px-6 py-4 text-gray-500">{{ user.login }}</td>
        <td class="px-6 py-4 text-gray-500">{{ user.roleDisplay }}</td>
        <td class="px-6 py-4 flex justify-center space-x-2">
          <button
            v-if="!user.blocked"
            class="bg-[#9AB1E5FF] text-white px-4 py-2 rounded-lg hover:bg-[#698BBFFF] transition"
            @click="$emit('edit', user)"
          >
            Редактировать
          </button>
          <button
            v-if="!user.blocked"
            class="bg-[#E01F2D] text-white px-4 py-2 rounded-lg hover:bg-[#AE141E] transition"
            @click="$emit('block', user.id)"
          >
            Заблокировать
          </button>
          <button
            v-if="user.blocked"
            class="bg-[#9AB1E5FF] text-white px-4 py-2 rounded-lg hover:bg-[#698BBFFF] transition"
            @click="$emit('unblock', user.id)"
          >
            Разблокировать
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {User} from '@/types/User';
import {getRoleDisplayName} from '@/utils/roles';

export default defineComponent({
  props: {
    users: {
      type: Array as () => User[],
      required: true,
    },
  },
  setup(props) {
    const processedUsers = computed(() => {
      return props.users.map(user => ({
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
        password: '',
        blocked: user.blocked,
        roleDisplay: getRoleDisplayName(user.role),
      }));
    });


    return {
      processedUsers,
    };
  },

});
</script>
