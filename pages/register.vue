<script setup lang="ts">
import { z } from "zod";
import { useAuthStore } from "~/store/auth";

const { registerUser } = useAuthStore();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Must be at least 4 characters"),
  name: z.string().min(2, "Must be at least 2 characters"),
});

const user = reactive({
  name: "",
  email: "",
  password: "",
});
const errors = ref<{ field: string | number; message: string }[]>([]);
const loading = ref(false);

const register = async () => {
  const validate = schema.safeParse(user);
  if (!validate.success) {
    errors.value = validate.error.issues.map((error: z.ZodIssue) => ({
      message: error.message,
      field: error.path[0],
    }));
    return;
  }
  loading.value = true;
  await registerUser(user);
  loading.value = false;
};
</script>

<template>
  <h1 class="text-center mt-20 mb-2">Register</h1>
  <form
    class="flex flex-col items-center justify-center gap-2 w-full"
    @submit.prevent="register"
  >
    <input placeholder="name" v-model="user.name" name="name" class="input" />
    <input placeholder="email" v-model="user.email" class="input" />
    <input
      placeholder="password"
      type="password"
      v-model="user.password"
      class="input"
    />
    <ul class="text-red-500">
      <li v-for="error in errors" :key="error.field">
        <span class="text-gray-800 mr-2">{{ error.field }}:</span>
        <span>{{ error.message }}</span>
      </li>
    </ul>
    <button type="submit" class="btn">
      {{ loading ? "Loading.." : "register" }}
    </button>
  </form>
</template>

<style scoped></style>
