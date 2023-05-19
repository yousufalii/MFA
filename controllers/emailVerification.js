const User = require("../userModel");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

const enableEmailVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { emailVerificationEnabled: true },
      { new: true }
    );

    res.status(201).json({ message: "Email verification enabled.", user });
  } catch (error) {
    res.status(404).json({ error, error: error.message });
  }
};

const disableEmailVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { emailVerificationEnabled: false },
      { new: true }
    );
    console.log(user);
    res.status(201).json({ message: "checked.", user });
  } catch (error) {
    res.status(404).json({ error, error: error.message });
  }
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const sendEmailVerification = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.emailVerificationEnabled) {
      return res
        .status(404)
        .json({ message: "Email verification is not enabled." });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    const result = await User.updateOne(
      { _id: userId },
      { $set: { "otp.code": otp, "otp.expirationTime": otpExpiration } }
    );

    const msg = {
      from: "ysfalikhan3@gmail.com",
      to: user.email,
      subject: "Confirm your identity.",
      text: `${otp} is your OTP.`,
    };

    sgMail.send(msg);
    res.status(201).json({ message: "Email has been sent.", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (
      !user.otp ||
      user.otp.code !== otp ||
      user.otp.expirationTime < new Date()
    ) {
      return res.status(404).json({ message: "OTP is incorrect.", user });
    }
    user.otp = null;
    await user.save();
    res.status(201).json({ message: "OTP is correct." });
  } catch (error) {
    res.status(404).json({ error, message: error.message });
  }
};


module.exports = {
  sendEmailVerification,
  enableEmailVerification,
  disableEmailVerification,
  verifyOTP,
};
