<template>
  <div class="space-y-2">
    <label :for="name" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="name"
        v-model="inputValue"
        :type="isPasswordVisible && type === 'password' ? 'text' : type"
        :placeholder="placeholder"
        autocomplete="none"
        :class="[
          'block w-full placeholder:text-sm px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50',
          isValid ? 'border-gray-300 focus:ring-blue-400' : 'border-red-500 focus:ring-red-400'
        ]"
        @input="handleInput"
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

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import eyeIcon from '@/assets/eye.svg';
import eyeOffIcon from '@/assets/eye-off.svg';
import type {ValidationRule} from "@/types/api/ValidationRule";

export default defineComponent({
  props: {
    modelValue: {type: String, required: true},
    name: {type: String, required: true},
    label: {type: String, required: true},
    placeholder: {type: String, default: ''},
    type: {type: String, default: 'text'},
    rules: {type: Array as () => ValidationRule[], default: () => []},
    externalError: {type: String, default: ''},
    isEdit: {type: Boolean, default: false},
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const isPasswordVisible = ref(false);
    const error = ref('');
    const isChanged = ref(false);

    const inputValue = ref(props.modelValue);

    const validate = () => {
      if (!isChanged.value && !props.isEdit) {
        error.value = props.rules.some(rule => rule.required) ? 'Это поле обязательно' : '';
        return;
      }

      const failingRule = props.rules.find(rule => !rule.rule(inputValue.value));
      error.value = failingRule ? failingRule.message : '';
    };

    const handleInput = (event: Event) => {
      inputValue.value = (event.target as HTMLInputElement).value;
      isChanged.value = true;
      validate();
      emit('update:modelValue', inputValue.value);
    };

    const isValid = computed(() => !error.value);

    watch(() => props.externalError, (newError) => {
      error.value = newError || '';
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== inputValue.value) {
          inputValue.value = newValue || '';
          validate();
        }
      },
      {immediate: true}
    );

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    onMounted(() => {
      validate();
    });

    return {
      inputValue,
      error,
      isValid,
      handleInput,
      isPasswordVisible,
      togglePasswordVisibility,
      eyeIcon,
      eyeOffIcon,
    };
  },
});
</script>
