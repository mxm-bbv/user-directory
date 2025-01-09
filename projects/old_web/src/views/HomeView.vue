<template>
  <div class="h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-md p-6 w-[800px]">
      <div class="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Справочник пользователей</h1>
          <p class="text-sm text-gray-500">Управляйте списком пользователей и их ролями.</p>
        </div>
        <button
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          @click="openAddUser"
        >
          Добавить пользователя
        </button>
      </div>
      <div>
        <div ref="webixTable"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import "webix/webix.css";
import * as webix from "webix";

export default defineComponent({
  name: "UserDirectory",
  setup() {
    const webixTable = ref(null);

    const fetchUsers = async () => {
      return [
        { id: 1, name: "Иван Иванов", login: "ivan", role: "Админ", blocked: false },
        { id: 2, name: "Петр Петров", login: "petr", role: "Пользователь", blocked: true },
      ];
    };

    const openAddUser = () => {
      alert("Форма добавления пользователя");
    };

    const renderTable = async () => {
      const users = await fetchUsers();

      webix.ui({
        container: webixTable.value,
        view: "datatable",
        autoConfig: true,
        height: 300,
        data: users,
        css: "webix_shadow_round",
        columns: [
          { id: "id", header: "ID", width: 50 },
          { id: "name", header: "ФИО", fillspace: true },
          { id: "login", header: "Логин", fillspace: true },
          { id: "role", header: "Роль", width: 150 },
          {
            id: "actions",
            header: "Действия",
            template: function (obj) {
              return `
                <button class="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-700">Редактировать</button>
                ${
                obj.blocked
                  ? `<button class="bg-green-500 text-white rounded px-2 py-1 hover:bg-green-700">Разблокировать</button>`
                  : `<button class="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-700">Заблокировать</button>`
              }
              `;
            },
            width: 200,
          },
        ],
      });
    };

    onMounted(renderTable);

    return {
      webixTable,
      openAddUser,
    };
  },
});
</script>

<style scoped>
.webix_shadow_round {
  border-radius: 12px !important;
  overflow: hidden !important;
}
</style>
