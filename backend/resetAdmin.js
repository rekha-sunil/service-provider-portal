require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = await User.findOneAndUpdate(
      { email: "admin@example.com" },
      {
        password: hashedPassword,
        role: "admin",
      },
      { new: true }
    );

    if (!admin) {
      console.log("Admin user not found");
    } else {
      console.log("Admin password reset successfully");
      console.log("Email: admin@example.com");
      console.log("Password: admin123");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetAdmin();