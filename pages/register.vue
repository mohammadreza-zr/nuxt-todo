<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import * as z from "zod";
  import { useAuthStore } from "~/store/auth";

  const { registerUser } = useAuthStore();

  const registerFormSchema = toTypedSchema(
    z.object({
      email: z.string().email("Invalid email"),
      password: z.string().min(4, "Must be at least 4 characters"),
      name: z.string().min(2, "Must be at least 2 characters"),
    })
  );

  const registerForm = useForm({
    validationSchema: registerFormSchema,
  });

  const onSubmitRegister = registerForm.handleSubmit(async (values) => {
    await registerUser(values);
  });
  definePageMeta({
    layout: "signup",
  });
</script>

<template>
  <div>
    <div
      class="grid w-full grid-cols-2 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground my-2"
    >
      <NuxtLink
        href="/login"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Login
      </NuxtLink>
      <NuxtLink
        href="/register"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm"
      >
        Register
      </NuxtLink>
    </div>
    <div>
      <Card>
        <form @submit="onSubmitRegister">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Register new account to use your favorite todo list
              app.</CardDescription
            >
          </CardHeader>
          <CardContent class="space-y-2">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="email@example.com"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="****"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
          <CardFooter>
            <Button type="submit"> Register </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>
