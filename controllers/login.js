const jwt = require("jsonwebtoken");
const User = require("../userModel");
const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid password." });
    }
    const token = jwt.sign(
      { userId: user._id },
      "ASJASMDN82Y34JNASNASKNDK",
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(404).json({ err, message: err.message });
  }
};

module.exports = { userLogin };
