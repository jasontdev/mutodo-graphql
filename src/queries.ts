import { AuthorizedRequest } from "./types";
import { userRepository } from "./user-repository";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    return new Promise(async (resolve) => {});
  },
  user: async (_: undefined, context: AuthorizedRequest) => {
    return userRepository.read(context.user);
  },
};

export { queries };
