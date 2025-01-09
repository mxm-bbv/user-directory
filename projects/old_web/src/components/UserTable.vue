<template>
  <div class="overflow-x-auto max-w-full">
    <table class="table-auto text-left border-collapse w-full">
      <thead class="bg-gray-50 border-b">
      <tr class="text-gray-600 text-xs sm:text-sm">
        <th class="px-4 py-3 font-medium">ID</th>
        <th class="px-4 py-3 font-medium">ФИО</th>
        <th class="px-4 py-3 font-medium">Логин</th>
        <th class="px-4 py-3 font-medium">Роль</th>
        <th class="px-4 py-3 font-medium">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="user in processedUsers"
        :key="user.id"
        class="hover:bg-gray-100 transition border-b"
        :class="{ 'bg-gray-200': user.blocked }"
      >
        <td class="px-4 py-3 text-gray-700 text-center">{{ user.id }}</td>
        <td class="px-4 py-3 text-gray-700">{{ user.name }}</td>
        <td class="px-4 py-3 text-gray-500">{{ user.login }}</td>
        <td class="px-4 py-3 text-gray-500">{{ user.roleDisplay }}</td>
        <td class="px-4 py-3 flex justify-center space-x-2">
          <button
            v-if="!user.blocked"
            class="bg-[#9AB1E5FF] text-white px-4 py-2 rounded-lg hover:bg-[#698BBFFF] transition w-full sm:w-auto"
            @click="$emit('edit', user)"
          >
            Редактировать
          </button>
          <button
            v-if="!user.blocked"
            class="bg-[#E01F2D] text-white px-4 py-2 rounded-lg hover:bg-[#AE141E] transition w-full sm:w-auto"
            @click="$emit('block', user.id)"
          >
            Заблокировать
          </button>
          <button
            v-if="user.blocked"
            class="bg-[#9AB1E5FF] text-white px-4 py-2 rounded-lg hover:bg-[#698BBFFF] transition w-full sm:w-auto"
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
import type {User} from '@/types/User';
import {getRoleDisplayName, type RoleKey} from '@/utils/roles';

export default defineComponent({
  props: {
    users: {
      type: Array as () => User[],
      required: true,
    },
  },
  setup(props) {
    const processedUsers = computed(() =>
      props.users.map(user => ({
        ...user,
        roleDisplay: getRoleDisplayName(user.role),
      }))
    );

    return {
      processedUsers
    };
  },

});
</script>
