import fs from "fs/promises";

export default async function loadSecret(
  secretName: string,
  env: string
): Promise<String> {
  return new Promise((resolve, reject) => {
    try {
      if (env === "production") {
        // podman/docker secret files contain the secret only
        fs.readFile(`/run/secret/${secretName}`, {
          encoding: "utf-8",
        }).then((secret) => {
          // secret file exists but is empty
          if (secret.length > 0) {
            reject("Error loading secret: secret file empty");
          } else {
            resolve(secret);
          }
        });
      } else {
        // converts a secretName like 'private-key' to 'PRIVATE_KEY'
        const envVariable = secretName.toUpperCase().replace("-", "_");
        const secret = eval(`process.env.${envVariable}`);
        if (secret) {
          resolve(secret);
        } else {
          reject("Error loading secret: secret not found in .env");
        }
      }
    } catch (error) {
      reject();
    }
  });
}
