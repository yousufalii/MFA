const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const signup = require("../server/controllers/signup");
const login = require("../server/controllers/login");
const emailVerification = require("../server/controllers/emailVerification");
const smsVerification = require("../server/controllers/smsVerification");

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://yousuf:gamepal@cluster0.rwyn8we.mongodb.net/MFA",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error conneting MongoDB."));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Routes

app.post("/signup", signup.newUserSignup);

app.post("/login", login.userLogin);

//email verification

app.post("/email/:userId", emailVerification.sendEmailVerification);

app.post("/email/:userId/enable", emailVerification.enableEmailVerification);

app.post("/email/:userId/disable", emailVerification.disableEmailVerification);

app.post("/email/:userId/verifyotp", emailVerification.verifyOTP);

//sms verification

app.post("/sms/:userId/:phoneNumber", smsVerification.sendSmsVerification);

app.post("/sms/:userId/enable", smsVerification.enableSmsVerification);

app.post("/sms/:userId/disable", smsVerification.disableSmsVerification);

app.listen(port, () => {
  console.log(`Server started on http://localhost/${port}`);
});
