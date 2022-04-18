import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { AuthorizedUser, Tasklist } from "./types";

async function create(tasklist: Tasklist, authorizedUser: AuthorizedUser) {
  const uuid = randomUUID();
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    await documentClient.put({
      TableName: "mutodo",
      Item: {
        id: `tasklist_${uuid}`,
        sort_key: `user_${authorizedUser.sub}`,
        name: tasklist.name,
      },
    });

    await documentClient.put({
      TableName: "mutodo",
      Item: {
        id: `user_${authorizedUser.sub}`,
        sort_key: `tasklist_${uuid}`,
      },
    });
    documentClient.destroy();
    ddbClient.destroy();
    return { id: `tasklist_${uuid}` };
  } catch (error) {
    documentClient.destroy();
    ddbClient.destroy();
    return { id: null };
  }
}

export { create };
