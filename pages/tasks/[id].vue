<script setup lang="ts">
import type { UserPayloadInterface } from "~/store/auth";
import { useTasksStore } from "~/store/tasks";
const { addTask, doneTask, removeTask, editTask } = useTasksStore();
const route = useRoute();
const userCookie = useCookie<UserPayloadInterface>("user");

const { users } = storeToRefs(useTasksStore());
const task = reactive({
  title: "",
  description: "",
  priority: "",
});
const editingItem = reactive({
  status: false,
  index: 0,
});
const handleEdit = (data: any) => {
  task.title = data.title;
  task.description = data.description;
  task.priority = data.priority;
  editingItem.status = true;
  editingItem.index = data.index;
};

const handleEditDone = () => {
  if (editingItem.status) {
    editTask(task, +route.params.id, editingItem.index);
    editingItem.status = false;
    editingItem.index = 0;
  } else {
    addTask(task, +route.params.id);
  }
};
</script>

<template>
  <h1 class="text-center mt-20 mb-2">Tasks</h1>
  <form
    class="flex flex-col items-center justify-center gap-2 w-full mb-10"
    @submit.prevent="handleEditDone"
  >
    <input placeholder="name" v-model="task.title" name="name" class="input" />
    <input
      placeholder="priority"
      v-model="task.priority"
      class="input"
      type="number"
    />
    <input placeholder="description" v-model="task.description" class="input" />
    <button type="submit" class="btn">{{ "add task" }}</button>
  </form>

  <div
    v-for="(task, index) in (
      users?.[userCookie.email]?.[+$route.params.id]?.list || []
    )?.sort(function (a, b) {
      return +b.priority - +a.priority;
    }) || []"
    :key="index"
    class="border border-gray-200 bg-gray-300 rounded-md mx-auto max-w-xl my-2 p-2 flex justify-between items-center"
  >
    <div :class="`${task.isDone ? 'text-green-500' : ''}`">
      <p>{{ task.title }}</p>
      <p>{{ task.priority }}</p>
      <p>{{ task.description }}</p>
    </div>
    <div class="flex flex-col items-center justify-center gap-2">
      <button
        class="text-red-500 text-end"
        @click="doneTask(+$route.params.id, index)"
      >
        done
      </button>
      <button
        class="text-red-500 text-end"
        @click="handleEdit({ ...task, index })"
      >
        edit
      </button>
      <button
        class="text-red-500 text-end"
        @click="removeTask(+$route.params.id, index)"
      >
        delete
      </button>
    </div>
  </div>
</template>

<style scoped></style>
