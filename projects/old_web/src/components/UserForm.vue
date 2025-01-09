<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <FormField
      v-model="form.name"
      name="name"
      label="ФИО"
      placeholder="Введите ФИО"
      :rules="validationRules.name"
      :external-error="errors.name"
      :isEdit="isEdit"
    />

    <FormField
      v-model="form.login"
      name="login"
      label="Логин"
      placeholder="Введите логин"
      :rules="validationRules.login"
      :external-error="errors.login"
      :isEdit="isEdit"
    />

    <FormField
      v-model="form.password"
      name="password"
      label="Пароль"
      type="password"
      :placeholder="passwordPlaceholder"
      :rules="validationRules.password"
      :external-error="errors.password"
      :isEdit="isEdit"
    />

    <div class="space-y-2">
      <label for="role" class="block text-sm font-medium text-gray-700">Роль</label>
      <select
        id="role"
        v-model="form.role"
        class="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 border-gray-300 focus:ring-blue-400">
        <option value="admin">Администратор</option>
        <option value="user">Пользователь</option>
      </select>
      <p v-if="errors.role" class="text-sm text-red-500">{{ errors.role }}</p>
    </div>

    <div class="flex justify-end space-x-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="bg-[#E01F2D] text-white font-bold text-md px-12 py-2 rounded-lg hover:bg-[#AE141E] transition"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="bg-[#9AB1E5FF] text-white font-bold text-md px-12 py-2 rounded-lg hover:bg-[#698BBFFF] transition"
      >
        Сохранить
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import {computed, ref, watch} from 'vue';
import FormField from '@/components/FormField.vue';
import UsersService from '@/api/users';
import type {User} from '@/types/User';
import {useRouter} from 'vue-router';
import type {AddUser} from "@/types/api/actions/AddUser";
import type {UpdateUser} from "@/types/api/actions/UpdateUser";
import type {ValidationRule} from "@/types/api/ValidationRule";

interface FormData extends Partial<Omit<User, 'blocked'>> {
  id?: number;
}

export default {
  components: {FormField},
  emits: ['cancel'],
  props: {
    user: {type: Object as () => User | null, default: () => null},
    isEdit: {type: Boolean, required: true},
  },
  setup(props, {emit}) {
    const router = useRouter();
    const form = ref<FormData>({
      id: props.user?.id ?? undefined,
      name: props.user?.name ?? '',
      login: props.user?.login ?? '',
      password: '',
      role: props.user?.role ?? 'user',
    });

    const errors = ref<Record<string, string>>({});

    const validationRules = {
      name: [
        {rule: (value: string) => !!value, message: 'ФИО обязательно.'},
        {
          rule: (value: string) => /^[А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)+$/.test(value),
          message: 'ФИО должно быть корректным.'
        },
      ] as ValidationRule[],
      login: [
        {rule: (value: string) => !!value, message: 'Логин обязателен.'},
        {rule: (value: string) => /^[a-zA-Z_]+$/.test(value), message: 'Логин может содержать только буквы и _.'},
      ] as ValidationRule[],
      password: [
        {
          rule: (value: string) => {
            return !(props.isEdit && !!value);
          },
          message: 'Пароль обязателен для создания пользователя.',
        },
        {
          rule: (value: string) => !value || value.length >= 8,
          message: 'Минимум 8 символов.',
        },
        {
          rule: (value: string) => !value || /[A-Z]/.test(value),
          message: 'Должен содержать заглавную букву.',
        },
        {
          rule: (value: string) => !value || /[a-z]/.test(value),
          message: 'Должен содержать строчную букву.',
        },
        {
          rule: (value: string) => !value || /\d/.test(value),
          message: 'Должен содержать цифру.',
        },
        {
          rule: (value: string) => !value || /[\W_]/.test(value),
          message: 'Должен содержать специальный символ.',
        },
      ] as ValidationRule[],
    };

    const passwordPlaceholder = computed(() =>
      props.isEdit ? 'Введите пароль (оставьте пустым, если не меняете)' : 'Введите пароль'
    );

    const updateErrors = () => {
      errors.value = {};

      for (const field in validationRules) {
        const errorMessage = isFieldValid(field as keyof FormData);
        if (errorMessage) {
          errors.value[field] = errorMessage;
        }
      }
    };

    const isFieldValid = (field: keyof FormData): string | null => {
      const fieldValue = form.value[field];
      const failingRule = validationRules[field]?.find(({rule}) => !rule(fieldValue));
      return failingRule ? failingRule.message : null;
    };

    const isFormValid = computed(() => {
      updateErrors();
      return Object.keys(errors.value).length === 0;
    });

    const handleSubmit = async () => {
      updateErrors();
      if (!isFormValid.value) {
        console.error('Форма содержит ошибки:', errors.value);
        return;
      }

      try {
        if (props.isEdit) {
          const updateData: UpdateUser = {
            id: form.value.id!,
            ...(form.value.name && {name: form.value.name}),
            ...(form.value.login && {login: form.value.login}),
            ...(form.value.password && {password: form.value.password}),
            ...(form.value.role && {role: form.value.role}),
          };
          await UsersService.updateUser(updateData.id, updateData);
        } else {
          const addData: AddUser = {
            name: form.value.name,
            login: form.value.login,
            password: form.value.password,
            role: form.value.role || 'user',
          };
          await UsersService.addUser(addData);
        }

        emit('cancel');
        router.go(0);
      } catch (error: any) {
        console.error('Ошибка сервера:', error);
      }
    };

    watch(
      () => props.user,
      (newUser) => {
        form.value = {
          id: newUser?.id ?? undefined,
          name: newUser?.name ?? '',
          login: newUser?.login ?? '',
          password: '',
          role: newUser?.role ?? 'user',
        };
      },
      {immediate: true}
    );

    return {
      form,
      errors,
      validationRules,
      passwordPlaceholder,
      isFormValid,
      handleSubmit,
    };
  },
};
</script>
