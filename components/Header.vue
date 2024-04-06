<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useAuthStore } from "~/store/auth";

  const { authenticated } = storeToRefs(useAuthStore());

  const router = useRouter();

  const { logUserOut } = useAuthStore();

  const logout = () => {
    logUserOut();
    router.push("/login");
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
        <NuxtLink href="/">tasks</NuxtLink>
      </li>
      <li v-if="authenticated">
        <NuxtLink @click="logout">Logout</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
