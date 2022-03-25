import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
import loadSecret from "./secrets";

const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
  hello: () => {
    return "Hello, world";
  },
};

(async () => {
  dotenv.config();
  try {
    if (process.env.NODE_ENV) {
      const jwtSecret = await loadSecret("jwt-secret", process.env.NODE_ENV);
      console.log(`jwt-secret: ${jwtSecret}`);
    } else {
      console.log("Could not load jwt-secret");
    }
  } catch (error) {
    console.log(`${error}`);
  }

  const app = express();
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
