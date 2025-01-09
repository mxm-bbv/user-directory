import * as webix from "webix";
import type { User } from "@/types/User";
import { saveUser } from "@/helpers/userHelper";

let userFormWindow: webix.ui.window | null = null;

export function openUserForm(user: User | null, onSaveCallback: (savedUser: User) => void) {
    if (userFormWindow) {
        userFormWindow.destructor();
        userFormWindow = null;
    }

    const initialData = { ...user };

    const validateName = (value: string): boolean => {
        const namePattern = /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/u;
        return namePattern.test(value) || value === "";
    };

    const validateLogin = (value: string): boolean => {
        const loginPattern = /^[a-zA-Z0-9_]+$/;
        return loginPattern.test(value) || value === "";
    };

    const validatePassword = (value: string): boolean => {
        const passwordPattern =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\;:'",.<>/?`~])[A-Za-z0-9!@#$%^&*()_\-+=|\\;:'",.<>/?`~]{8,}$/;
        return passwordPattern.test(value) || value === "";
    };

    userFormWindow = webix.ui({
        view: "window",
        head: user ? "Редактировать пользователя" : "Добавить пользователя",
        modal: true,
        position: "center",
        body: {
            view: "form",
            id: "userForm",
            width: 400,
            elements: [
                {
                    view: "text",
                    name: "name",
                    label: "ФИО",
                    placeholder: "Иванов Иван Иванович",
                    value: user?.name || "",
                    on: {
                        onTimedKeyPress: function () {
                            const value = (this as unknown as webix.ui.text).getValue();
                            const isValid = validateName(value);
                            const message = isValid
                                ? ""
                                : "Введите полное имя на русском языке (три слова, каждое с заглавной буквы).";
                            const errorTemplate = webix.$$("name_error") as webix.ui.template;
                            if (errorTemplate) {
                                errorTemplate.setHTML(message);
                            }
                        },
                    },
                },
                { view: "template", id: "name_error", borderless: true, autoheight: true },
                {
                    view: "text",
                    name: "login",
                    label: "Логин",
                    placeholder: "ivanov_123",
                    value: user?.login || "",
                    on: {
                        onTimedKeyPress: function () {
                            const value = (this as unknown as webix.ui.text).getValue();
                            const isValid = validateLogin(value);
                            const message = isValid
                                ? ""
                                : "Логин может содержать только латинские буквы, цифры и _";
                            const errorTemplate = webix.$$("login_error") as webix.ui.template;
                            if (errorTemplate) {
                                errorTemplate.setHTML(message);
                            }
                        },
                    },
                },
                { view: "template", id: "login_error", borderless: true, autoheight: true },
                {
                    view: "text",
                    name: "password",
                    label: "Пароль",
                    type: "password",
                    placeholder: user ? "Чтобы изменить пароль, введите новый" : "Введите пароль",
                    value: "",
                    on: {
                        onTimedKeyPress: function () {
                            const value = (this as unknown as webix.ui.text).getValue();
                            const isValid = validatePassword(value);
                            const message = isValid
                                ? ""
                                : "Пароль должен быть от 8 символов, содержать 1 цифру, 1 спец. символ, 1 заглавную и 1 строчную букву.";
                            const errorTemplate = webix.$$("password_error") as webix.ui.template;
                            if (errorTemplate) {
                                errorTemplate.setHTML(message);
                            }
                        },
                    },
                },
                { view: "template", id: "password_error", borderless: true, autoheight: true },
                {
                    view: "select",
                    name: "role",
                    label: "Роль",
                    options: [
                        { id: "admin", value: "Администратор" },
                        { id: "user", value: "Пользователь" },
                    ],
                    value: user?.role || "user",
                },
                {
                    cols: [
                        {
                            view: "button",
                            value: "Сохранить",
                            css: "webix_primary",
                            click: async () => {
                                const form = webix.$$("userForm") as webix.ui.form;
                                if (!form) {
                                    webix.message({ type: "error", text: "Форма не найдена." });
                                    return;
                                }

                                const values = form.getValues();
                                const updatedData: Record<string, any> = {};

                                if (values.name && values.name !== initialData?.name) {
                                    updatedData.name = values.name;
                                }
                                if (values.login && values.login !== initialData?.login) {
                                    updatedData.login = values.login;
                                }
                                if (values.password) {
                                    updatedData.password = values.password;
                                }
                                if (values.role && values.role !== initialData?.role) {
                                    updatedData.role = values.role;
                                }

                                if (Object.keys(updatedData).length === 0) {
                                    webix.message({ text: "Нет изменений для сохранения.", type: "info" });
                                    return;
                                }

                                await saveUser(user, updatedData, onSaveCallback);

                                userFormWindow?.destructor();
                                userFormWindow = null;
                            },
                        },
                        {
                            view: "button",
                            value: "Отменить",
                            click: () => {
                                userFormWindow?.destructor();
                                userFormWindow = null;
                            },
                        },
                    ],
                },
            ],
        },
    }) as webix.ui.window;

    userFormWindow.show();
}
