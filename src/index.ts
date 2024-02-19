import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import AdminPostRoutes from "./routes/admin/postRoutes";
import GetFatafatDataRoutes from "./routes/client/getFatafatRoutes";
import UserAuthRoutes from "./routes/client/authRoutes";

const app: Express = express(); // initialize the app

dotenv.config(); // to allow the env variables

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // to process the url encoded bodies

app.use(express.json()); // to parse the body into json

app.use(cors()); // to allow cross access resource sharing

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

// ADMIN_JWT_SECRET=-S+@WM.3w\&6o7Hjn:H5Au2o:UKN9f1L7J+2h=n$WQ
// CLIENT_JWT_SECRET=4Qlpb-FYzep0qUk6bm%@:JT47
