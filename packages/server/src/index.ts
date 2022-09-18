import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { loginUser, createSession, getLoggedInUser } from "./api";
import { rejectIfNoAuthTokenSet } from "./acl";

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
  "/api/session",
  express
    .Router()
    .put("/", createSession)
    .get("/", rejectIfNoAuthTokenSet, getLoggedInUser)
    .post("/", rejectIfNoAuthTokenSet, loginUser)
);

app.listen(port);
console.log(`Listening on ${port}`);
