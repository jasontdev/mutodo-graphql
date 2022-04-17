import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { AuthorizedUser, Tasklist } from "./types";

const tasklistRepository = {
  create: async function (tasklist: Tasklist, authorizedUser: AuthorizedUser) {
    const uuid = randomUUID();
    const ddbClient = databaseClient.get();
    const documentClient = DynamoDBDocument.from(ddbClient);

    try {
      await documentClient.put({
        TableName: "mutodo",
        Item: {
          id: `tasklist_{uuid}`,
          sort_key: uuid,
          name: tasklist.name,
          users: [`user_${authorizedUser.sub}`],
        },
      });
      documentClient.destroy();
      ddbClient.destroy();
      return { id: `tasklist_{uuid}` };
    } catch (error) {
      documentClient.destroy();
      ddbClient.destroy();
      return { id: null };
    }
  },
};

export default tasklistRepository;
