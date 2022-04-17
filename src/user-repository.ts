import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { AuthorizedUser, User } from "./types";

const userRepository = {
  save: async function ({ name }: User, { sub }: AuthorizedUser) {
    const dbc = databaseClient.get();
    const ddbDocClient = DynamoDBDocumentClient.from(dbc);

    return ddbDocClient.send(
      new PutCommand({
        TableName: "mutodo",
        Item: {
          id: "User_" + sub,
          sort_key: sub,
          name: name,
        },
      })
    );
  },
  read: async function (user: AuthorizedUser) {
    const dbc = databaseClient.get();
    const documentClient = DynamoDBDocumentClient.from(dbc);
    const data = await documentClient.send(
      new GetCommand({
        TableName: "mutodo",
        Key: {
          id: "User_" + user.sub,
          sort_key: user.sub,
        },
      })
    );
    return data.Item;
  },
};

export { userRepository };
