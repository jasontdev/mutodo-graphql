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
  { tasklist, name }: CreateTaskInput,
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  // first we need to make sure the user has access to the tasklist
  try {
    const data = await documentClient.query({
      TableName: "mutodo",
      KeyConditionExpression: "id = :tasklist and sort_key = :user",
      ExpressionAttributeValues: {
        ":tasklist": tasklist,
        ":user": `user_${authorizedUser.sub}`,
      },
    });

    // if item does not exist then user does not have access to tasklist
    if (!data || !data.Items) {
      return null;
    }
  } catch (error) {
    return null;
  }

  const uuid = randomUUID();
  try {
    const data = await documentClient.put({
      TableName: "mutodo",
      Item: { id: tasklist, sort_key: `task_${uuid}`, name },
    });

    if (!data) {
      return null;
    }
    return { id: `task_${uuid}` };
  } catch (error) {
    return null;
  }
}

async function readTasks(
  { tasklist }: { tasklist: string },
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    // first query is a check for permission to access tasklist
    const result = await documentClient.query({
      TableName: "mutodo",
      KeyConditionExpression: "id = :username and sort_key = :tasklist",
      ExpressionAttributeValues: {
        ":username": `user_${authorizedUser.sub}`,
        ":tasklist": tasklist,
      },
    });

    // user does not have access to tasklist
    if (!result || !result.Items) {
      return null;
    }

    // retrieve all tasks in a tasklist
    const data = await documentClient.query({
      TableName: "mutodo",
      KeyConditionExpression:
        "id = :tasklist and begins_with(sort_key, :prefix)",
      ExpressionAttributeValues: {
        ":tasklist": tasklist,
        ":prefix": "task_",
      },
    });

    if (!data || !data.Items) {
      return null;
    }

    return data.Items;
  } catch (error) {
    return null;
  } finally {
    documentClient.destroy();
    ddbClient.destroy();
  }
}

export { createTasklist, readTasklists, readTasks, createTask };
