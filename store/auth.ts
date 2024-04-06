import { defineStore } from "pinia";
import { toast } from "vue-sonner";

export interface UserPayloadInterface {
  email: string;
  password: string;
  name: string;
}

// this functionality only is for test task, so not important!
export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    registerUser: async function (payload: UserPayloadInterface) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const users = useCookie<UserPayloadInterface[]>("users");
          const userCookie = useCookie<UserPayloadInterface>("user");

          if (users.value) {
            if (
              !users.value?.find(
                (user: UserPayloadInterface) => user.email === payload.email
              )
            ) {
              users.value = [...users.value, payload];
              userCookie.value = payload;
              this.authenticated = true;
              useRouter().push("/");
            } else {
              if (process.client) {
                toast("email is exist!");
                // useNuxtApp().$toast.error("email is exist!");
              }
            }
          } else if (!users.value) {
            users.value = [payload];
            userCookie.value = payload;
            this.authenticated = true;
            useRouter().push("/");
          }
          resolve(users);
        }, 300);
      });
    },
    loginUser: async function (payload: Omit<UserPayloadInterface, "name">) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const users = useCookie<UserPayloadInterface[]>("users");
          const userCookie = useCookie<UserPayloadInterface>("user");

          if (users.value) {
            const check = users.value?.find(
              (user: UserPayloadInterface) => user.email === payload.email
            );
            if (!check) {
              if (process.client) {
                // useNuxtApp().$toast.error("email not exist");
                toast("email not exist");
              }
            } else if (check.password !== payload.password) {
              if (process.client) {
                // useNuxtApp().$toast.error("passwords do not match");
                toast("passwords do not match");
              }
            } else {
              userCookie.value = check;
              this.authenticated = true;
              useRouter().push("/");
            }
          } else if (!users.value) {
            if (process.client) {
              // useNuxtApp().$toast.error("user not exist!");
              toast("user not exist!");
            }
          }
          resolve(users);
        }, 300);
      });
    },
    logUserOut() {
      const token = useCookie("user"); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});
