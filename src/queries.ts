import { AuthorizedRequest } from "./types";
import { readTasklists } from "./tasklist-repository";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    const data = await readTasklists(context.user);
    return data;
  },
};

export { queries };
