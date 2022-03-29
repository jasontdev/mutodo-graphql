import { PrismaClient } from "@prisma/client";
import { AuthorizedRequest } from "./types";

const queries = {
  hello: () => {
    return "Hello, world";
  },
  tasklists: async (_: undefined, context: AuthorizedRequest) => {
    return new Promise(async (resolve) => {
      const { sub } = context.user;
      const prismaClient = new PrismaClient();
      const tasklists = await prismaClient.tasklistUser.findMany({
        where: { userUuid: sub },
        include: { tasklist: true },
      });
      resolve(tasklists.map((tasklist) => tasklist.tasklist));
    });
  },
};

export { queries };
