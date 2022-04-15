import { AuthorizedRequest } from "./types";
import { userRepository } from "./user-repository";

const mutations = {
  newUser: async ({ name }: { name: string }, context: AuthorizedRequest) => {
    const { sub } = context.user;
    const newUser = { name, tasklists: [] };
    try {
      const data = await userRepository.save(newUser, context.user);
      return { ...newUser, id: `User_${sub}` };
      console.log(data);
    } catch (error) {
      return null;
    }
  },
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
