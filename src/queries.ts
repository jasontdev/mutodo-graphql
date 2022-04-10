import { AuthorizedRequest } from "./types";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    return new Promise(async (resolve) => {
      const { sub } = context.user;
    });
  },
};

export { queries };
