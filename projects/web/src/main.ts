import { openUserForm } from "@/components/UserForm";
import * as webix from "webix";
import type { User } from "@/types/User";
import UsersService from "@/api/users";
import { createUserList } from "@/components/UserList";
webix.ready(async () => {
    try {
        const users: User[] = await UsersService.getUsers();

        webix.ui({
            rows: [
                {
                    type: "clean",
                    css: "main-container",
                    cols: [
                        {},
                        {
                            rows: [
                                {
                                    css: "header-container",
                                    template: `
                                        <div class="header">
                                            <h1>Справочник пользователей</h1>
                                            <p>Управляйте списком пользователей и их статусами.</p>
                                        </div>
                                    `,
                                    height: 100,
                                },
                                {
                                    cols: [
                                        { gravity: 1 },
                                        {
                                            view: "button",
                                            value: "Добавить пользователя",
                                            css: "add-user-btn",
                                            width: 200,
                                            click: () => openUserForm(null, (newUser: User) => {
                                                const list = webix.$$("userList") as webix.ui.datatable;
                                                list.add(newUser);
                                            }),
                                        },
                                        { gravity: 1 },
                                    ],
                                },
                                createUserList(),
                            ],
                            width: 1200,
                        },
                        {},
                    ],
                },
            ],
        });

        const list = webix.$$("userList") as webix.ui.datatable;
        list.parse(users);

        list.attachEvent("onItemClick", async (id, e) => {
            const target = e.target as HTMLElement;

            if (target.classList.contains("edit")) {
                const user = list.getItem(id.row) as User;
                openUserForm(user, (updatedUser: User) => {
                    list.updateItem(updatedUser.id!, updatedUser);
                });
            } else if (target.classList.contains("block")) {
                const user = list.getItem(id.row) as User;
                try {
                    if (user.blocked) {
                        await UsersService.unblockUser({ id: user.id });
                        user.blocked = false;
                        webix.message("Пользователь разблокирован!");
                    } else {
                        await UsersService.blockUser({ id: user.id });
                        user.blocked = true;
                        webix.message("Пользователь заблокирован!");
                    }
                    list.updateItem(user.id!, user);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    webix.message({ type: "error", text: "Ошибка блокировки пользователя: " + errorMessage });
                }
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        webix.message({ type: "error", text: "Ошибка загрузки данных: " + errorMessage });
    }
});