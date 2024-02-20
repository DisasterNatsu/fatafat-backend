import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import AdminPostRoutes from "./routes/admin/postRoutes";
import GetFatafatDataRoutes from "./routes/client/getFatafatRoutes";
import UserAuthRoutes from "./routes/client/authRoutes";

const app: Express = express(); // initialize the app

// define origins

const origins: string[] = [
  "https://kolkataff.space",
  "https://admin.kolkataff.space",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) {
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));

dotenv.config(); // to allow the env variables

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // to process the url encoded bodies

app.use(express.json()); // to parse the body into json

app.use(cors(corsOptions)); // to allow cross access resource sharing

// routes

// get data routes
app.use("/data", GetFatafatDataRoutes);

// post data routes only for admins and also admin routes
app.use("/admin", AdminPostRoutes);

// user auth routes3/ f1
app.use("/user", UserAuthRoutes);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listning on port ${process.env.PORT || 8080}`)
); // starts the app
