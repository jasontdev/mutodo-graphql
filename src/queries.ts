import { AuthorizedRequest } from "./types";
import { readTasks, readTasklists } from "./tasks";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    const data = await readTasklists("mutodo", context.user);
    return data;
  },
  tasks: async (
    { tasklist }: { tasklist: string },
    context: AuthorizedRequest
  ) => {
    const data = await readTasks({ tasklist }, "mutodo", context.user);
    return data;
  },
};

export { queries };
