import { AuthorizedRequest } from "./types";
import { readTasks, readTasklists } from "./tasks";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    const data = await readTasklists(context.user);
    return data;
  },
  tasks: async (
    { tasklist }: { tasklist: string },
    context: AuthorizedRequest
  ) => {
    const data = await readTasks({ tasklist }, context.user);
    console.log(data);
    return data;
  },
};

export { queries };
