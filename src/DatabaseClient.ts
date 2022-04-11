import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type DatabaseClientConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

class DatabaseClient {
  #region: string;
  #accessKeyId: string;
  #secretAccessKey: string;

  constructor({ region, accessKeyId, secretAccessKey }: DatabaseClientConfig) {
    this.#region = region;
    this.#accessKeyId = accessKeyId;
    this.#secretAccessKey = secretAccessKey;
  }

  get(): DynamoDBClient {
    return new DynamoDBClient({
      region: this.#region,
      credentials: {
        accessKeyId: this.#accessKeyId,
        secretAccessKey: this.#secretAccessKey,
      },
    });
  }
}

export default DatabaseClient;
