import { MiddlewareFn } from "type-graphql";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { ObjectID } from "typeorm";
import { SECRET } from "../index";

export interface Context {
  req: Request;
  res: Response;
  payload: { id: ObjectID };
}

export const authorize: MiddlewareFn<Context> = ({ context }, next) => {
  const token = context.req.headers["token"];

  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const payload = verify(token as string, process.env.SECRET as string);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }

  return next();
};
