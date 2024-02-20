import express from "express";

import { isAuth } from "middlewares/admin/isAuth";
import {
  AddDataNewDataRow,
  updateOrAddDatatoAlreadyExistingRow,
} from "controllers/admin/addNewData";
import {
  AdminLogIn,
  AdminRegister,
  AdminTokenVarification,
} from "auth/admin/AdminAuth";

const router = express.Router();

router.get("/is-auth", AdminTokenVarification);
router.post("/register", AdminRegister);
router.post("/log-in", AdminLogIn);
router.post("/add-new", isAuth, AddDataNewDataRow);
router.post("/update", updateOrAddDatatoAlreadyExistingRow);

export default router;
