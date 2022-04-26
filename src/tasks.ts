import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { AuthorizedUser, CreateTasklistInput, CreateTaskInput } from "./types";

async function createTasklist(
  tasklist: CreateTasklistInput,
  tableName: string,
  authorizedUser: AuthorizedUser
) {
  const uuid = randomUUID();
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    await documentClient.put({
      TableName: tableName,
      Item: {
        id: `tasklist_${uuid}`,
        sort_key: `user_${authorizedUser.sub}`,
        name: tasklist.username,
      },
    });

    await documentClient.put({
      TableName: tableName,
      Item: {
        id: `user_${authorizedUser.sub}`,
        sort_key: `tasklist_${uuid}`,
        name: tasklist.name,
      },
    });
    return { id: `tasklist_${uuid}` };
  } catch (error) {
    console.log(error);
    return { id: null };
  } finally {
    documentClient.destroy();
    ddbClient.destroy();
  }
}

async function readTasklists(
  tableName: string,
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    const data = await documentClient.query({
      TableName: tableName,
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
  } finally {
    documentClient.destroy();
    ddbClient.destroy();
  }
}

async function createTask(
  { tasklist, name }: CreateTaskInput,
  tableName: string,
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  // first we need to make sure the user has access to the tasklist
  try {
    const data = await documentClient.query({
      TableName: tableName,
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

    const uuid = randomUUID();
    const result = await documentClient.put({
      TableName: tableName,
      Item: { id: tasklist, sort_key: `task_${uuid}`, name },
    });

    if (!result) {
      return null;
    }
    return { id: `task_${uuid}` };
  } catch (error) {
    return null;
  } finally {
    documentClient.destroy();
    ddbClient.destroy();
  }
}

async function readTasks(
  { tasklist }: { tasklist: string },
  tableName: string,
  authorizedUser: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    // first query is a check for permission to access tasklist
    const result = await documentClient.query({
      TableName: tableName,
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
      TableName: tableName,
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

    return data.Items.map((item) => ({ id: item.sort_key, name: item.name }));
  } catch (error) {
    return null;
  } finally {
    documentClient.destroy();
    ddbClient.destroy();
  }
}

async function deleteTask(
  tasklistId: string,
  taskId: string,
  table: string,
  user: AuthorizedUser
) {
  const ddbClient = databaseClient.get();
  const documentClient = DynamoDBDocument.from(ddbClient);

  try {
    const userHasTasklist = await documentClient.get({
      TableName: table,
      Key: { id: `user_${user.sub}`, sort_key: tasklistId },
    });

    // test if user has access to tasklist
    if (!userHasTasklist || !userHasTasklist.Item) {
      return null;
    }

    const deletedTask = await documentClient.delete({
      TableName: table,
      Key: {
        id: tasklistId,
        sort_key: taskId,
      },
    });

    if (deletedTask) {
      return { id: taskId };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export { createTasklist, readTasklists, readTasks, createTask, deleteTask };
