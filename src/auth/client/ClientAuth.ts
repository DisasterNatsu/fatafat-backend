import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TokenVerifyType } from "../../../types/typings";

const prisma = new PrismaClient();

export const ClientRegister = async (req: Request, res: Response) => {
  // extract data from request's body

  const { email, password, confirmPassword } = req.body;

  // handle bad requests

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Bad request" });
  } else if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Make sure Password and Confirm Password is same" });
  } else if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters long" });
  }

  // try catch block

  try {
    // check if a user with the email already exists
    const userInDb = await prisma.user.findUnique({ where: { email: email } });

    if (userInDb)
      return res.status(403).json({
        message: `An account with the email: ${email} is already registered with us`,
      });

    // generate salt

    const salt = bcrypt.genSaltSync();

    // encrypt | hash the password

    const hashedPassword = bcrypt.hashSync(password, salt);

    // data object for prisma client

    const data = { email, password: hashedPassword };

    // update the user data in database

    const newUser = await prisma.user.create({ data });

    console.log(newUser);

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    // handle error
    return res
      .status(500)
      .json({ message: "Error while registering the user", error });
  } finally {
    // disconnect from prisma client

    return async () => prisma.$disconnect;
  }
};

export const ClientLogIn = async (req: Request, res: Response) => {
  // get userName and password from request's body

  const { email, password } = req.body;

  // handle bad requests

  if (!email || !password) {
    return res.status(400).json({ message: "Bad Request" });
  }

  try {
    // check if user in database

    const userInDb = await prisma.user.findUnique({ where: { email } });

    // if no user in db

    if (!userInDb)
      return res
        .status(404)
        .json({ message: `No account with the email: ${email} was found` });

    // check the password

    const isPasswordValid = bcrypt.compareSync(password, userInDb.password);

    // if incorrect password

    if (!isPasswordValid)
      return res
        .status(403)
        .json({ message: "Email or Password is incorrect" });

    // sign a jwt token

    const token = jwt.sign(
      { email: userInDb.email },
      process.env.CLIENT_JWT_SECRET!,
      { expiresIn: "72h" }
    );

    return res.status(200).json({ authToken: token, email });
  } catch (error) {
    // handle error
    return res
      .status(500)
      .json({ message: "Error while logging in the user", error });
  } finally {
    // disconnect from prisma client

    return async () => prisma.$disconnect;
  }
};

export const TokenVarification = (req: Request, res: Response) => {
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

    return res.status(200).json({ authenticated: true, user: isAuth });
  } catch (error) {
    return res
      .status(500)
      .json({
        authenticated: false,
        message: "Something happened when verifying admin data",
        error,
      });
  }
};
