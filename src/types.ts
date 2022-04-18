import { Request } from "express";

type AuthorizedUser = {
  sub: string;
  preferred_username: string;
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
};

type CreateTasklistInput = {
  name: string;
  username: string;
};

type CreateTaskInput = {
  name: string;
  tasklist: string;
};

export {
  AuthorizedRequest,
  AuthorizedUser,
  User,
  Tasklist,
  CreateTasklistInput,
  CreateTaskInput,
};
