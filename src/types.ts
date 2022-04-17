import { Request } from "express";

type AuthorizedUser = {
  sub: string;
};

interface AuthorizedRequest extends Request {
  user: AuthorizedUser;
}

type User = {
  id?: string;
  name: string;
};

type Tasklist = {
  id?: string;
  name: string;
  users?: [User];
  sort_key?: string;
};

export { AuthorizedRequest, AuthorizedUser, User, Tasklist };
