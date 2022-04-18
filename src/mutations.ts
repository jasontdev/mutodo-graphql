import { AuthorizedRequest } from "./types";
import { createTasklist } from "./tasklist-repository";
import { CreateTasklistInput } from "./types";

const mutations = {
  newTasklist: async (
    { name, username }: CreateTasklistInput,
    context: AuthorizedRequest
  ) => {
    const data = await createTasklist({ name, username }, context.user);
    console.log(data);
    return data;
  },
  removeTasklist: async (
    { id }: { id: number },
    context: AuthorizedRequest
  ) => {
    const { sub } = context.user;
  },
};

export { mutations };
