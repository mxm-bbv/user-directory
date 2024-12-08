<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <FormField
      v-model="form.name"
      name="name"
      label="ФИО"
      placeholder="Введите ФИО"
      :rules="validationRules.name"
      :external-error="errors.name"
    />

    <FormField
      v-model="form.login"
      name="login"
      label="Логин"
      placeholder="Введите логин"
      :rules="validationRules.login"
      :external-error="errors.login"
    />

    <FormField
      v-model="form.password"
      name="password"
      label="Пароль"
      type="password"
      :placeholder="passwordPlaceholder"
      :rules="validationRules.password"
      :external-error="errors.password"
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
        :disabled="!isFormValid">
        Сохранить
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import {ref, computed} from 'vue';
import FormField from '@/components/FormField.vue';
import UsersService from '@/api/users';
import {User} from '@/types/User';
import {useRouter} from 'vue-router';

interface FormData {
  id: number | null;
  name: string;
  login: string;
  password: string;
  role: string;
}

export default {
  components: {FormField},
  emits: ['submit', 'cancel'],
  props: {
    user: {type: Object as () => User | null, default: () => null},
    isEdit: {type: Boolean, required: true},
  },
  setup(props, {emit}) {
    const router = useRouter();
    const form = ref<FormData>({
      id: props.user?.id ?? null,
      name: props.user?.name ?? '',
      login: props.user?.login ?? '',
      password: '',
      role: props.user?.role ?? 'user',
    });

    const errors = ref<Record<string, string>>({});
    console.log(props.isEdit);

    const validationRules = {
      name: [
        {rule: (value: string) => !!value, message: 'ФИО обязательно.'},
        {
          rule: (value: string) => /^[А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)+$/.test(value),
          message: 'ФИО должно быть корректным.'
        },
      ],
      login: [
        {rule: (value: string) => !!value, message: 'Логин обязателен.'},
        {rule: (value: string) => /^[a-zA-Z_]+$/.test(value), message: 'Логин может содержать только буквы и _.'},
      ],
      password: [
        {
          rule: (value: string) => !props.isEdit.value || value.length > 0,
          message: 'Пароль обязателен для создания пользователя.'
        },
        {rule: (value: string) => value === '' || value.length >= 8, message: 'Минимум 8 символов.'},
        {rule: (value: string) => value === '' || /[A-Z]/.test(value), message: 'Должен содержать заглавную букву.'},
        {rule: (value: string) => value === '' || /[a-z]/.test(value), message: 'Должен содержать строчную букву.'},
        {rule: (value: string) => value === '' || /\d/.test(value), message: 'Должен содержать цифру.'},
        {rule: (value: string) => value === '' || /[\W_]/.test(value), message: 'Должен содержать специальный символ.'},
      ]
    };

    const passwordPlaceholder = computed(() =>
      props.isEdit ? 'Введите пароль (оставьте пустым, если не меняете)' : 'Введите пароль'
    );

    const isFormValid = computed(() =>
      Object.keys(errors.value).every((key) => !errors.value[key])
    );

    const validateForm = () => {
      errors.value = {};

      Object.entries(validationRules).forEach(([field, rules]) => {
        const failingRule = rules.find(({rule}) => !rule(form.value[field]));
        if (failingRule) {
          errors.value[field] = failingRule.message;
        }
      });
    };

    const handleSubmit = async () => {
      validateForm();
      if (!isFormValid.value) return;

      const userData: Partial<FormData> = {
        id: form.value.id,
        name: form.value.name,
        login: form.value.login,
        role: form.value.role,
        password: form.value.password || undefined,
      };

      try {
        if (props.isEdit) {
          await UsersService.updateUser(userData.id!, userData);
        } else {
          await UsersService.addUser(userData);
        }

        emit('submit', userData);
        emit('cancel');
        router.go(0);
      } catch (error: any) {
        console.error('Ошибка сервера:', error);
      }
    };

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
