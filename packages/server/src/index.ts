import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { api, loginUser } from "./api";
import { decodeSession } from "./session";
import { acceptGuestsOnly } from "./acl";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, "client/build")));

app.use(bodyParser.json({ limit: "8mb" }));
app.use(bodyParser.urlencoded({ limit: "8mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.all("*", decodeSession);
api.post("/api/session", acceptGuestsOnly, loginUser);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

app.listen(port);
console.log(`Listening on ${port}`);
