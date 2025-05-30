import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { payload } from "../dto/user.dto";
import { UnauthorizedError } from "../utils/error";
import { AuthenticatedRequest } from "../types/common.types";
dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Make sure your header is well formated!");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as payload;
    // ✅ Type-safe and clean
    (req as any).user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedError("Make sure the token provided is right!")
  }
};
