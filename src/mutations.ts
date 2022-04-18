import { AuthorizedRequest } from "./types";
import { createTasklist, createTask } from "./tasks";
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
};

export { mutations };
