import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenVerifyType } from "../../../types/typings";

export const isClientAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get token

  const token = req.header("ff-user-token");

  // if no token

  if (!token) return res.status(403).json({ message: "Unauthorised" });

  try {
    // it returns the issuedAt, ExpiresAt and the email used to sign it | if not a valid token, it will trigger the catch block

    const isAuth = jwt.verify(
      token,
      process.env.CLIENT_JWT_SECRET!
    ) as TokenVerifyType;

    req.user = isAuth.email; // send it as req.admin

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something happened when verifying admin data", error });
  }
};
