import { Request } from "express";

type AuthorizedUser = {
  sub: string;
};

interface AuthorizedRequest extends Request {
  user: AuthorizedUser;
}

export { AuthorizedRequest };
