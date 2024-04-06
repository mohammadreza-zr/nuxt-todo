<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import * as z from "zod";
  import type { Todo } from "~/interfaces/Tasks";
  import { useAuthStore, type UserPayloadInterface } from "~/store/auth";
  import { useTasksStore } from "~/store/tasks";

  const { authenticated } = storeToRefs(useAuthStore());
  const userCookie = useCookie<UserPayloadInterface>("user");

  const { users } = storeToRefs(useTasksStore());
  const { addTasks, removeTasks } = useTasksStore();

  const formSchema = toTypedSchema(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  );

  const form = useForm<Todo>({
    validationSchema: formSchema,
  });

  const onSubmitTask = form.handleSubmit(async (values: Todo) => {
    await addTasks(values);
  });
</script>

<template>
  <div
    class="h-full flex-1 flex-col space-y-8 p-8 md:flex w-full max-w-md mx-auto"
    v-if="authenticated"
  >
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p class="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <UserNav />
      </div>
    </div>
    <Card>
      <form @submit="onSubmitTask">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription> add your todo list.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="todo list title"
                  id="title"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  id="description"
                  placeholder="about the todo list"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter>
          <Button type="submit"> save </Button>
        </CardFooter>
      </form>
    </Card>

    <div
      v-for="(tasks, index) in (users?.[userCookie.email] || []).sort(
        function (a, b) {
          return +new Date(b.updatedAt) - +new Date(a.updatedAt);
        }
      )"
      :key="index"
      class="border border-gray-300 rounded-md mx-auto max-w-xl my-2 p-2 flex justify-between items-center w-full"
    >
      <NuxtLink :to="`/${index}`" class="w-full mr-8">
        <p>{{ tasks.title }}</p>
        <p>{{ tasks.description }}</p>
        <p>
          {{ dateConverter.toDate(tasks.updatedAt) }} -
          {{ dateConverter.toTime(tasks.updatedAt) }}
        </p>
      </NuxtLink>
      <Button @click="removeTasks(index)" variant="destructive">delete</Button>
    </div>
  </div>
  <div class="mt-20 text-center" v-if="!authenticated">
    Please register first!
  </div>
</template>
