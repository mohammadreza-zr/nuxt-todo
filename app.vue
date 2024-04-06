<script setup lang="ts">
  import { Toaster } from "~/components/ui/sonner";

  definePageMeta({
    layout: "default",
  });
</script>

<template>
  <NuxtLayout class="layouts">
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>
