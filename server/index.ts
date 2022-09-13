import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { decodeSession } from "./token";
import { api } from "./api";

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
app.use("/", api);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

app.listen(port);
console.log(`Listening on ${port}`);
