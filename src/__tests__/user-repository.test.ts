import {
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import DatabaseClient from "../DatabaseClient";
import { userRepository } from "../user-repository";

beforeAll(async () => {
  global.databaseClient = new DatabaseClient({
    endpoint: "http://localhost:8000",
    region: "ap-southeast-2",
    accessKeyId: "abcd1234",
    secretAccessKey: "abcd1234",
  });

  const list = await databaseClient.get().send(
    new ListTablesCommand({
      Limit: 1,
    })
  );

  if (list.TableNames) {
    if (list.TableNames[0] !== "mutodo") {
      console.log("Creating table...");
      await databaseClient.get().send(
        new CreateTableCommand({
          TableName: "mutodo",
          KeySchema: [
            { AttributeName: "id", KeyType: "HASH" },
            { AttributeName: "sort_key", KeyType: "RANGE" },
          ],
          AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "sort_key", AttributeType: "S" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        })
      );
    }
  }
});

afterAll(async () => {
  const ddbClient = databaseClient.get();
  await ddbClient.send(
    new DeleteTableCommand({
      TableName: "mutodo",
    })
  );
});

test("create a new user", async () => {
  const authorizedUser = { sub: "abcd1234" };
  const data = await userRepository.save({ name: "Alfred" }, authorizedUser);
  if (data.Attributes) {
    expect(data.Attributes.id).toBe("User_" + authorizedUser.sub);
  }
});
