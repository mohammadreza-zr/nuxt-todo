<script setup lang="ts">
import type { UserPayloadInterface } from "~/store/auth";
import { useTasksStore } from "~/store/tasks";
const { addTasks, removeTasks } = useTasksStore();
const userCookie = useCookie<UserPayloadInterface>("user");

const { users } = storeToRefs(useTasksStore());

const task = reactive({
  name: "",
  description: "",
});
</script>

<template>
  <h1 class="text-center mt-20 mb-2">Tasks</h1>
  <form
    class="flex flex-col items-center justify-center gap-2 w-full mb-10"
    @submit.prevent="addTasks(task)"
  >
    <input placeholder="name" v-model="task.name" name="name" class="input" />
    <input placeholder="description" v-model="task.description" class="input" />
    <button type="submit" class="btn">{{ "add list" }}</button>
  </form>

  <div
    v-for="(tasks, index) in (users?.[userCookie.email] || []).sort(
      function (a, b) {
        return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      },
    )"
    :key="index"
    class="border border-gray-200 bg-gray-300 rounded-md mx-auto max-w-xl my-2 p-2 flex justify-between items-center"
  >
    <NuxtLink :to="`/tasks/${index}`">
      <p>{{ tasks.name }}</p>
      <p>{{ tasks.description }}</p>
    </NuxtLink>
    <button @click="removeTasks(index)" class="text-red-500 text-end">
      delete
    </button>
  </div>
</template>

<style scoped></style>
