<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const router = useRouter();

const { logUserOut } = useAuthStore(); // use authenticateUser action from  auth store

const logout = () => {
  logUserOut();
  router.push("/register");
};
</script>

<template>
  <nav class="max-w-xl mx-auto">
    <ul class="flex items-center justify-between">
      <li>
        <NuxtLink href="/">Home</NuxtLink>
      </li>
      <li v-if="!authenticated">
        <NuxtLink href="/login">login</NuxtLink>
      </li>
      <li v-if="!authenticated">
        <NuxtLink href="/register">register</NuxtLink>
      </li>
      <li v-if="authenticated">
        <NuxtLink href="/tasks">tasks</NuxtLink>
      </li>
      <li v-if="authenticated">
        <NuxtLink @click="logout">Logout</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
