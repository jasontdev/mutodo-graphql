import {
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import DatabaseClient from "./src/DatabaseClient";

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
