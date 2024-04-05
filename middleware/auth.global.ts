import type { UserPayloadInterface } from "~/store/auth";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const user = useCookie<UserPayloadInterface>("user");

  if (user.value) {
    authenticated.value = true;
  }

  if (!user.value && to?.name === "tasks") {
    return navigateTo("/");
  }

  if (user.value && to?.name === "login") {
    return navigateTo("/");
  }
});
