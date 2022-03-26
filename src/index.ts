import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
import loadSecret from "./secrets";
import jwt from "express-jwt";
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
  }
  `
);

(async () => {
  dotenv.config();
  const app = express();
  try {
    if (process.env.NODE_ENV) {
      const jwtSecret = await loadSecret("jwt-secret", process.env.NODE_ENV);
      app.use(
        jwt({
          secret: jwtSecret,
          algorithms: ["HS256"],
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
