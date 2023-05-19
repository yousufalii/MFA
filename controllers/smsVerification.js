const User = require("../userModel");
const accountSid = "AC35fb78ebdbe54ca48609bd448ad10d78";
const authToken = "4a8c7896089865d3d9fadf2bd5bb357a";
const verifySid = "VA32f73d463e9e01b001b80d71b403e264";
const client = require("twilio")(accountSid, authToken);

const enableSmsVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { smsVerificationEnabled: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ user, message: "SMS verification is enabled." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const disableSmsVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { smsVerificationEnabled: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(201).json({ message: "SMS verification is disabled." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendSmsVerification = async (req, res) => {
  try {
    const { userId, phoneNumber } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log(verification.status);

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phoneNumber, code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendSmsVerification,
  enableSmsVerification,
  disableSmsVerification,
};
