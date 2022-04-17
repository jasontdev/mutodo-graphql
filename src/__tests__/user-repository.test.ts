import {
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import DatabaseClient from "../DatabaseClient";
import tasklistRepository from "../tasklist-repository";
import { userRepository } from "../user-repository";

beforeAll(async () => {
  // TODO: load test keys and endpoint from .env.test
  global.databaseClient = new DatabaseClient({
    endpoint: "http://localhost:8000",
    region: "ap-southeast-2",
    accessKeyId: "abcd1234",
    secretAccessKey: "abcd1234",
  });

  // Check if table already exists. This should not be the case as we
  // delete the table in afterEach
  const list = await databaseClient.get().send(
    new ListTablesCommand({
      Limit: 1,
    })
  );

  if (list.TableNames) {
    if (list.TableNames[0] !== "mutodo") {
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

test("read user", async () => {
  const authorizedUser = { sub: "abcd1234" };
  const documentClient = DynamoDBDocumentClient.from(databaseClient.get());
  await documentClient.send(
    new PutCommand({
      TableName: "mutodo",
      Item: {
        id: `User_${authorizedUser.sub}`,
        sort_key: authorizedUser.sub,
        name: "Jason",
      },
    })
  );

  const data = await userRepository.read(authorizedUser);
  if (data) {
    expect(data.name).toBe("Jason");
  }
});

test("create tasklist", async () => {
  const tasklist = { name: "Test tasklist" };
  const data = await tasklistRepository.create(tasklist, { sub: "abcd1234" });
  expect(data.id).not.toBeNull();
});
