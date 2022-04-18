import { AuthorizedRequest } from "./types";

const mutations = {
  newTasklist: async (
    { name }: { name: string },
    context: AuthorizedRequest
  ) => {
    const { sub } = context.user;
  },
  removeTasklist: async (
    { id }: { id: number },
    context: AuthorizedRequest
  ) => {
    const { sub } = context.user;
  },
};

export { mutations };
