import UsersService from "@/api/users";
import * as webix from "webix";
import {AddUser} from "@/types/api/actions/AddUser.ts";

export async function saveUser(
    user: any,
    updatedData: Record<string, any>,
    onSaveCallback: (savedUser: any) => void
) {
    try {
        let savedUser;
        if (user) {
            savedUser = await UsersService.updateUser(user.id, { ...updatedData, id: user.id });
            webix.message("Пользователь успешно обновлен!");
        } else {
            savedUser = await UsersService.addUser(updatedData as AddUser);
            webix.message("Пользователь успешно добавлен!");
        }
        onSaveCallback(savedUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        webix.message({ type: "error", text: errorMessage });
    }
}
