import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import DatabaseClient from "./DatabaseClient";

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
  app.listen(4100);
})();
