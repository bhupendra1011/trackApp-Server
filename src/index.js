require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRoutes");
const trackRouter = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");
let cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(authRouter);
app.use(trackRouter);

const mongoUri =
  "mongodb+srv://admin:pass@cluster0.e1ifg.mongodb.net/Tracking_db?retryWrites=true&w=majority";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB.com finally !!");
});
mongoose.connection.on("error", (err) => {
  console.error("Error in connecting to mongo DB ", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`your email is ${req.user.email}`);
});

app.listen(port, () => {
  console.log(`listening to port 3000 ${port}`);
});
