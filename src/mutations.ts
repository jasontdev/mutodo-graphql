import { AuthorizedRequest } from "./types";
import { createTasklist, createTask, deleteTask } from "./tasks";
import { CreateTasklistInput, CreateTaskInput } from "./types";

const mutations = {
  newTasklist: async (
    { name, username }: CreateTasklistInput,
    context: AuthorizedRequest
  ) => {
    const data = await createTasklist(
      { name, username },
      "mutodo",
      context.user
    );
    return data;
  },
  newTask: async (task: CreateTaskInput, context: AuthorizedRequest) => {
    const data = await createTask(task, "mutodo", context.user);
    return data;
  },
  deleteTask: async (
    {
      tasklist,
      task,
    }: {
      tasklist: string;
      task: string;
    },
    context: AuthorizedRequest
  ) => {
    const data = await deleteTask(tasklist, task, "mutodo", context.user);
    return data;
  },
};

export { mutations };
