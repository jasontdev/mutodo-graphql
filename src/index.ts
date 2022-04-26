import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { queries } from "./queries";
import { mutations } from "./mutations";
import DatabaseClient from "./DatabaseClient";

const schema = buildSchema(
  `
  type User {
    id: String
    name: String
    tasklists: [Tasklist]
  }
  
  type Task {
    id: String
    name: String
  }

  type Tasklist {
    id: ID!
    name: String
    users: [User]
  }
   
  type Query {
    hello: String
    tasklists: [Tasklist]
    tasks(tasklist: String): [Task]
  }

  type Id {
    id: String
  }

  type Mutation {
    newTasklist(name: String, username: String): Id
    newTask(tasklist: String, name: String): Id
    deleteTask(tasklist: String, task: String): Id
  }
  `
);

(async () => {
  dotenv.config();
  const app = express();
  app.use(cors());
  try {
    if (process.env.NODE_ENV) {
      const ddbAccessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
      const ddbSecretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
      const ddbRegion = process.env.DYNAMODB_REGION;
      const issuer = process.env.JWT_ISSUER;

      if (ddbAccessKeyId && ddbSecretAccessKey && ddbRegion && issuer) {
        // TODO: find alternative to global variable
        global.databaseClient = new DatabaseClient({
          region: ddbRegion,
          accessKeyId: ddbAccessKeyId,
          secretAccessKey: ddbSecretAccessKey,
        });
      }

      app.use(
        jwt({
          secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${issuer}/.well-known/jwks.json`,
          }),
          algorithms: ["RS256"],
          issuer,
        })
      );
    } else {
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: { ...queries, ...mutations },
    })
  );

  app.listen(4100);
})();
