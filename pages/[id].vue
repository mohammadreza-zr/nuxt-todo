<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { storeToRefs } from "pinia";
  import { useForm } from "vee-validate";
  import { z } from "zod";
  import type { UserPayloadInterface } from "~/store/auth";
  import { useTasksStore } from "~/store/tasks";

  const { addTask, doneTask, removeTask, editTask } = useTasksStore();
  const route = useRoute();
  const userCookie = useCookie<UserPayloadInterface>("user");

  const formSchema = toTypedSchema(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
    })
  );

  const form = useForm<any>({
    validationSchema: formSchema,
  });

  const onSubmit = form.handleSubmit(async (values: any) => {
    if (editingItem.status) {
      editTask(form.values, +route.params.id, editingItem.index);
      editingItem.status = false;
      editingItem.index = 0;
      form.resetForm();
    } else {
      await addTask(values, +route.params.id).then(() => {
        form.resetForm();
      });
    }
  });

  const { users } = storeToRefs(useTasksStore());

  const editingItem = reactive({
    status: false,
    index: 0,
  });
  const handleEdit = (data: any) => {
    form.setValues(data);
    editingItem.status = true;
    editingItem.index = data.index;
  };
</script>

<template>
  <div
    class="h-full flex-1 flex-col space-y-8 p-8 md:flex w-full max-w-md mx-auto"
  >
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Todo Item!</h2>
        <p class="text-muted-foreground">
          You can add, edit, remove or done tasks
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <UserNav />
      </div>
    </div>
    <Card>
      <form @submit="onSubmit">
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
          <FormField v-slot="{ componentField }" name="priority">
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input
                  placeholder="priority"
                  id="priority"
                  v-bind="componentField"
                  type="number"
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
      v-for="(task, index) in (
        users?.[userCookie.email]?.[+$route.params.id]?.list || []
      )?.sort(function (a, b) {
        return +b.priority - +a.priority;
      }) || []"
      :key="index"
      class="border border-gray-300 rounded-md mx-auto max-w-xl my-2 p-2 flex justify-between items-center w-full"
    >
      <div :class="`${task.isDone ? 'underline text-gray-600' : ''}`">
        <p>{{ task.title }}</p>
        <p>{{ task.priority }}</p>
        <p>{{ task.description }}</p>
      </div>
      <div class="flex flex-col items-center justify-center gap-2">
        <Button class="text-end" @click="doneTask(+$route.params.id, index)">
          done
        </Button>
        <Button
          class="text-end"
          variant="outline"
          @click="handleEdit({ ...task, index })"
        >
          edit
        </Button>
        <Button
          class="text-end"
          variant="destructive"
          @click="removeTask(+$route.params.id, index)"
        >
          delete
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
