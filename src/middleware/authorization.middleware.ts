// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";
import { ForbiddenError,NotFoundError } from "../utils/error";
export function authorizeRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).currentUser;

    console.log("Role check:", user?.role);

    if (!user) {
      throw new NotFoundError("User")
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError("Not access allowed for you");
    }

    next();
  };
}
