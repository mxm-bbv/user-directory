<template>
  <div class="space-y-2">
    <label :for="name" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="name"
        v-model="value"
        :type="isPasswordVisible && type === 'password' ? 'text' : type"
        :placeholder="placeholder"
        autocomplete="none"
        :class="[
          'block w-full placeholder:text-sm px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50',
          isValid ? 'border-gray-300 focus:ring-blue-400' : 'border-red-500 focus:ring-red-400'
        ]"
        @input="validate"
      />
      <span v-if="type === 'password'" class="absolute inset-y-0 right-3 flex items-center">
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="focus:outline-none"
        >
          <img
            :src="isPasswordVisible ? eyeOffIcon : eyeIcon"
            :alt="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
            class="h-5 w-5"
          />
        </button>
      </span>
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script>
import {ref, watch, computed} from 'vue';
import eyeIcon from '@/assets/eye.svg';
import eyeOffIcon from '@/assets/eye-off.svg';

export default {
  props: {
    modelValue: {type: String, required: true},
    name: {type: String, required: true},
    label: {type: String, required: true},
    placeholder: {type: String, default: ''},
    type: {type: String, default: 'text'},
    rules: {type: Array, default: () => []},
    externalError: {type: String, default: ''},
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const value = ref(props.modelValue);
    const error = ref('');
    const isPasswordVisible = ref(false);

    const validate = () => {
      const failingRule = props.rules.find(rule => !rule.rule(value.value));
      error.value = failingRule ? failingRule.message : '';
    };

    const isValid = computed(() => !error.value);

    watch(
      () => props.externalError,
      (newError) => {
        error.value = newError || '';
      },
      {immediate: true}
    );

    watch(value, (newValue) => emit('update:modelValue', newValue));
    watch(() => props.modelValue, (newValue) => (value.value = newValue));
    watch(() => props.rules, validate, {immediate: true});

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    return {
      value,
      error,
      isValid,
      validate,
      isPasswordVisible,
      togglePasswordVisibility,
      eyeIcon,
      eyeOffIcon,
    };
  },
};
</script>
