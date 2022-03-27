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
  removeTasklist: async (
    { id }: { id: number },
    context: AuthorizedRequest
  ) => {
    const { sub } = context.user;
    const prismaClient = new PrismaClient();

    // if token subject is the only user of a tasklist then delete
    // entry in relation table and tasklist. otherwise, just delete the
    // relation so that the task remains for the other users

    // find out if token subject is the only user of a tasklist
    return new Promise((resolve, reject) => {
      prismaClient.usersOfTasklists
        .count({
          where: { tasklistId: id },
        })
        .then((numTasklistUsers) => {
          // disconnect user from tasklist
          prismaClient.usersOfTasklists
            .delete({
              where: {
                userUuid_tasklistId: { userUuid: sub, tasklistId: id },
              },
            })
            .then(() => {
              // remove tasklist when sub is the only user
              if (numTasklistUsers === 1) {
                prismaClient.tasklist.delete({ where: { id } });
              }
              resolve(true);
            })
            .catch(() => reject());
        });
    });
  },
};

export { mutations };
