import express from "express";

import { LastTenData, getDatabyDate } from "controllers/client/getFatafatData";

const router = express.Router();

router.get("/latest/:date", getDatabyDate);
router.get("/last-ten-days/:currentDate", LastTenData);

export default router;
