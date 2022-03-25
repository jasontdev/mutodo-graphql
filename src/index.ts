import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
import loadSecret from "./secrets";
import jwt from "express-jwt";

const schema = buildSchema(
  `
    type Query {
        hello: String
    }
`
);

const root = {
  hello: () => {
    return "Hello, world";
  },
};

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
          credentialsRequired: false, // TODO enable in production
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
      rootValue: root,
      graphiql: true,
    })
  );

  app.listen(4100);
})();
