import * as webix from "webix";
import {User} from "@/types/User.ts";

export function createUserList(): webix.ui.view {
    return {
        view: "datatable",
        id: "userList",
        autoheight: true,
        scroll: false,
        columns: [
            { id: "id", header: "ID", width: 50 },
            { id: "name", header: "ФИО", fillspace: true },
            { id: "login", header: "Логин", fillspace: true },
            { id: "role", header: "Роль", width: 150 },
            {
                id: "actions",
                header: "Действия",
                template: (obj: User) =>
                    `<button class='edit'>Редактировать</button> 
                     <button class='block'>${obj.blocked ? "Разблокировать" : "Заблокировать"}</button>`,
                width: 250,
            },
        ],
        data: [],
    } as unknown as webix.ui.datatable;
}
