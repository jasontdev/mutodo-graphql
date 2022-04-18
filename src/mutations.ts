import { AuthorizedRequest } from "./types";
import { createTasklist, createTask } from "./tasklist-repository";
import { CreateTasklistInput, CreateTaskInput } from "./types";

const mutations = {
  newTasklist: async (
    { name, username }: CreateTasklistInput,
    context: AuthorizedRequest
  ) => {
    const data = await createTasklist({ name, username }, context.user);
    console.log(data);
    return data;
  },
  newTask: async (task: CreateTaskInput, context: AuthorizedRequest) => {
    const data = await createTask(task, context.user);
    console.log(data);
    return data;
  },
};

export { mutations };
