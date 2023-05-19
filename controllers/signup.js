const User = require("../userModel");
const bcrypt = require("bcrypt");

const newUserSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    res.status(404).json({ err, message: err.message });
  }
};

module.exports = { newUserSignup };
