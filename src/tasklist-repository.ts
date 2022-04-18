import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { AuthorizedUser, CreateTasklistInput, CreateTaskInput } from "./types";

async function createTasklist(
  tasklist: CreateTasklistInput,
  authorizedUser: AuthorizedUser
) {
  const uuid = randomUUID();
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    await documentClient.put({
      TableName: "mutodo",
      Item: {
        id: `tasklist_${uuid}`,
        sort_key: `user_${authorizedUser.sub}`,
        name: tasklist.username,
      },
    });

    await documentClient.put({
      TableName: "mutodo",
      Item: {
        id: `user_${authorizedUser.sub}`,
        sort_key: `tasklist_${uuid}`,
        name: tasklist.name,
      },
    });
    documentClient.destroy();
    ddbClient.destroy();
    return { id: `tasklist_${uuid}` };
  } catch (error) {
    console.log(error);
    documentClient.destroy();
    ddbClient.destroy();
    return { id: null };
  }
}

async function readTasklists(authorizedUser: AuthorizedUser) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    const data = await documentClient.query({
      TableName: "mutodo",
      KeyConditionExpression: "id = :userId and begins_with(sort_key, :prefix)",
      ExpressionAttributeValues: {
        ":userId": `user_${authorizedUser.sub}`,
        ":prefix": "tasklist",
      },
    });

    if (!data || !data.Items) {
      return null;
    }
    return data.Items.map((item) => ({ id: item.sort_key, name: item.name }));
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function createTask(
  task: CreateTaskInput,
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  // TODO make sure user is in tasklist before adding task
  const uuid = randomUUID();
  try {
    const data = await documentClient.put({
      TableName: "mutodo",
      Item: { sort_key: `task_${uuid}`, ...task },
    });

    if (!data) {
      return null;
    }
    return { id: `task_${uuid}` };
  } catch (error) {
    return null;
  }
}

export { createTasklist, readTasklists };
