const express = require("express");
const mongoose = require("mongoose"); //MONGODB
const session = require("express-session"); //SESSION
const User = require("./models/User");
require("dotenv").config(); //BAO MAT DU LIEU QTRONG

const app = express();

app.set("view engine", "ejs"); //SET FRONT_END LA EJS
app.use(express.static(__dirname + "/public"));
app.use("/kstore", express.static(__dirname + "/public"));
app.use("/kstore/processors", express.static(__dirname + "/public"));
app.use("/kstore/", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true })); //DOC URL
app.use(express.json()); //DOC JSON VA IN URL

app.use(
  session({
    secret: "Kphone",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", require("./route/index"));

app.use("/kstore", require("./route/products"));
app.use("/account", require("./route/login")); //route toi file account

mongoose
  .connect(process.env.MONGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGODB CONNECTED");
    app.listen(process.env.PORT, () => {
      console.log("http://localhost:" + process.env.PORT);
    });
  })
  .catch((e) => console.log(e));
