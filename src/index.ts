import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
import loadSecret from "./secrets";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { queries } from "./queries";
import { mutations } from "./mutations";

const schema = buildSchema(
  `
  type User {
    uuid: String
    name: String
    tasklists: [Tasklist]
  }

  type Tasklist {
    id: ID!
    name: String
    users: [User]
  }
   
  type Query {
    hello: String
    tasklists: [Tasklist]
  }

  type Mutation {
    newUser(name: String): User
    newTasklist(name: String): Tasklist
    removeTasklist(id: Int): Boolean
  }
  `
);

(async () => {
  dotenv.config();
  const app = express();
  app.use(cors());
  try {
    if (process.env.NODE_ENV) {
      const issuer = await loadSecret("jwt-issuer", process.env.NODE_ENV);
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
    console.log(error);
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
