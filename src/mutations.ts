import { PrismaClient } from "@prisma/client";
import { AuthorizedRequest } from "./types";

const mutations = {
  newUser: ({ name }: { name: string }, context: AuthorizedRequest) => {
    const { sub } = context.user;
    const prismaClient = new PrismaClient();
    return prismaClient.user.create({
      data: { uuid: sub, name },
      select: { uuid: true, name: true },
    });
  },
  newTasklist: async (
    { name }: { name: string },
    context: AuthorizedRequest
  ) => {
    const { sub } = context.user;
    const prismaClient = new PrismaClient();
    const tasklist = await prismaClient.tasklist.create({
      data: { name, users: { create: { userUuid: sub } } },
    });

    // because users field in Tasklist links to a relation table (UsersOfTasklists), we have to fetch the users
    // in a dedicated query
    const users = await prismaClient.usersOfTasklists.findMany({
      where: { tasklistId: tasklist.id },
      include: { user: true },
    });

    // access each user for the new tasklist via the result of querying the
    // relation table
    return new Promise((resolve) =>
      resolve({ ...tasklist, users: users.map((user) => user.user) })
    );
  },
};

export { mutations };
