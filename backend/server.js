const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const summaryRoutes = require("./routes/summaryRoutes");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const MONGO_URI = process.env.MONGO_URI;
const app = express();
const Port = 3000;
app.use(express.json());
app.use(cors());
app.use("/summarize", summaryRoutes);
app.use("/todos", todoRoutes);
app.use("/users", userRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo DB");
  })
  .catch(() => {
    console.log("Error in connecting to Mongo DB");
  });
