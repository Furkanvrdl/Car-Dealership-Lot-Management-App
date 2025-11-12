const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { protect } = require("./middleware/authMiddleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const carRoutes = require("./routes/cars");
const soldCarRoutes = require("./routes/soldCars");
const authRoutes = require("./routes/auth");

app.use("/api/cars", protect, carRoutes);
app.use("/api/soldCars", protect, soldCarRoutes);
app.use("/api/auth", authRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("✅ Server is working and accessible!");
});

// Start server
// const PORT = process.env.PORT || 5000:
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
