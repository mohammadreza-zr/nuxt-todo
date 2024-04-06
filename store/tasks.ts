import { defineStore } from "pinia";
import type { UserPayloadInterface } from "~/store/auth";

export interface Task {
  title: string;
  description: string;
  priority: number | string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Tasks {
  list: Task[];
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    users: {} as {
      [key: string]: Tasks[];
    },
  }),
  actions: {
    addTasks: async function (payload: Pick<Tasks, "title" | "description">) {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      if (this.users[userCookie?.email]) {
        this.users[userCookie?.email] = [
          ...this.users[userCookie?.email],
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            list: [],
            ...payload,
          },
        ];
      } else {
        this.users[userCookie?.email] = [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            list: [],
            ...payload,
          },
        ];
      }
    },
    removeTasks: async function (id: number) {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      this.users[userCookie?.email].splice(id, 1);
    },
    addTask: async function (
      payload: Pick<Task, "title" | "description" | "priority">,
      index: number
    ) {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      this.users[userCookie?.email][index].list = [
        ...(this.users[userCookie?.email][index].list || {}),
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          isDone: false,
          ...payload,
        },
      ];
      this.users[userCookie?.email][index].updatedAt = new Date();
    },
    removeTask: async function (
      parentIndex: number,
      index: number
    ): Promise<void> {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      this.users[userCookie?.email][parentIndex].list.splice(index, 1);
      this.users[userCookie?.email][parentIndex].updatedAt = new Date();
    },
    editTask: async function (
      payload: Pick<Task, "title" | "description" | "priority">,
      parentIndex: number,
      index: number
    ) {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      this.users[userCookie?.email][parentIndex].list[index] = {
        ...this.users[userCookie?.email][parentIndex].list[index],
        ...payload,
        updatedAt: new Date(),
      };
      this.users[userCookie?.email][parentIndex].updatedAt = new Date();
    },
    doneTask: async function (parentIndex: number, index: number) {
      const userCookie = useCookie<UserPayloadInterface>("user").value;
      this.users[userCookie?.email][parentIndex].list[index].isDone =
        !this.users[userCookie?.email][parentIndex].list[index].isDone;
      this.users[userCookie?.email][parentIndex].list[index].updatedAt =
        new Date();
      this.users[userCookie?.email][parentIndex].updatedAt = new Date();
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
