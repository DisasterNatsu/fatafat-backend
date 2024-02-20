import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenVerifyType } from "../../../types/typings";

const prisma = new PrismaClient();

export const AdminRegister = async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body; // get data from reqest's body

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Required data missing" });
  } else if (password.listen < 5) {
    return res.status(400).json({ message: "Password too small" });
  } else if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Password doesn't match",
    });
  }

  // try catch and finally for handling error boundary

  try {
    const adminInDb = await prisma.fataFatAdmin.findMany();

    if (adminInDb.length > 0) {
      return res.status(403).json({
        message: "Admin account can't be created without proper permissions",
      });
    }

    const salt = bcrypt.genSaltSync(10); // generate salt

    const hashedPassword = bcrypt.hashSync(password, salt); // hash the password

    const data = { email, password: hashedPassword }; // data object for prisma

    const newAdminAccount = await prisma.fataFatAdmin.create({ data }); // call prisma to add to the database

    console.log(newAdminAccount); // for checking the response returned from prisma

    res.status(200).json({ message: "Account Created!" }); // send the response
  } catch (error) {
    return res.status(500).json({
      message: "Something happened while registering a new admin",
      error,
    });
  } finally {
    return async () => await prisma.$disconnect();
  }
};

export const AdminLogIn = async (req: Request, res: Response) => {
  // get data from request's body

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    // check if there is a email with the account with the provided email

    const adminInDb = await prisma.fataFatAdmin.findUnique({
      where: { email: email },
    });

    // if there is no admin account with that email

    if (!adminInDb) return res.status(403).json({ message: "Unauthorized" });

    const isPasswordValid = bcrypt.compareSync(password, adminInDb.password);

    // if password not valid

    if (!isPasswordValid)
      return res.status(403).json({ message: "Unauthorized" });

    // sign a jwt token

    const token = jwt.sign(
      { email: adminInDb.email },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: "48h" }
    );

    //  response with data

    return res.status(200).json({ authToken: token, email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something happened while logging in", error });
  } finally {
    return async () => await prisma.$disconnect();
  }
};

export const AdminTokenVarification = (req: Request, res: Response) => {
  // get token

  const token = req.header("ff-admin-token");

  // if no token

  if (!token) return res.status(403).json({ message: "Unauthorised" });

  try {
    // it returns the issuedAt, ExpiresAt and the email used to sign it | if not a valid token, it will trigger the catch block

    const isAuth = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET!
    ) as TokenVerifyType;

    return res.status(200).json({ authenticated: true, admin: isAuth });
  } catch (error) {
    return res.status(500).json({
      authenticated: false,
      message: "Something happened when verifying admin data",
      error,
    });
  }
};
