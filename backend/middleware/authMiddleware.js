// after u done add protect in ypur car and soldcars routes to protect them.
//to add the library add // const { protect } = require("../middleware/authMiddleware");

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { decode } = require("punycode");
require("dotenv").config(); //Loads environment variables from a .env file into process.env

const protect = async (req, res, next) => {
  let token;

  //check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decodeed = jwt.verify(token, process.env.JWT_SECRET); // Verify the token and extracts the payload.

      //attach admin to request object
      req.admin = await Admin.findById(decodeed.id).select("-password"); // Find the admin user by ID and attach it to the request object, excluding the password field.

      next(); // proceed to next middleware / route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
module.exports = { protect };
