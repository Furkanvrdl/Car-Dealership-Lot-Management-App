const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin"); //Loads the Admin model to interact with the admin users in the database.
const jwt = require("jsonwebtoken"); ////Loads the JWT library to create and verify JSON Web Tokens for authentication.
const bcrypt = require("bcrypt"); //Loads bcrypt for securely hashing passwords.
require("dotenv").config(); //Loads environment variables from a .env file into process.env

//token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmE4MWU5NTcxYmU1YTI3MTA4NTkxMiIsImlhdCI6MTc2MTI0NzczMywiZXhwIjoxNzYxMzM0MTMzfQ.sp00kItOaaIRRzVhZDgSJ-XaWiEJF5QKJ3h_41F7S8g"

// Register admin
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login admin
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, admin.password); //comparing the provided password with the hashed password stored in the database.
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token valid for 1 day
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
