import express from "express";
import api from "./api/index.js";
import cors from "cors";

const app = express();

//Placeholder code
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", express.static("Code"));
app.use("/api/v1", express.static("uploads"));

app.use("/api/v1", api);

app.get("/", (req, res) => {
  res.send("Welcome to my REST API!");
});

export default app;
