import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type DatabaseClientConfig = {
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
};

class DatabaseClient {
  #endpoint: string | undefined;
  #region: string;
  #accessKeyId: string;
  #secretAccessKey: string;

  constructor({
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
  }: DatabaseClientConfig) {
    if (endpoint) {
      this.#endpoint = endpoint;
    }
    this.#region = region;
    this.#accessKeyId = accessKeyId;
    this.#secretAccessKey = secretAccessKey;
  }

  get(): DynamoDBClient {
    return new DynamoDBClient({
      endpoint: this.#endpoint,
      region: this.#region,
      credentials: {
        accessKeyId: this.#accessKeyId,
        secretAccessKey: this.#secretAccessKey,
      },
    });
  }
}

export default DatabaseClient;
