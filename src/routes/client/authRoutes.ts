import {
  ClientLogIn,
  ClientRegister,
  TokenVarification,
} from "auth/client/ClientAuth";
import express from "express";

const router = express.Router();

router.post("/register", ClientRegister);
router.post("/log-in", ClientLogIn);
router.get("/is-auth", TokenVarification);

export default router;
