const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
//allow to use cors
app.use(cors());
const router = express.Router();

//MongoDB setup

const dbRoute =
  "mongodb+srv://ryanyoung:20000125yr@cluster0.gvvgq.mongodb.net/<dbname>?retryWrites=true&w=majority";

//Connet db to server

mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => {
  console.log("connnect to the database");
});

//check if we connnect to the mongodb
db.on("error", console.error.bind(console, "MongoDb connection error:"));

//parse the req to the json format

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));

//get all the data from our db

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

//update

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//delete

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//create

router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "Invaid Inputs",
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => {
  console.log(`Server is listening on PORT ${API_PORT}`);
});
