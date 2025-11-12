// codes after controller.
/*const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.post("/", carController.addCar);
router.get("/", carController.getAllCars); // supports filters via query params
router.put("/:id", carController.editCarById);
router.put("/:id/sell", carController.sellCar);
router.get("/export/csv", carController.exportCarsAsCSV);
router.get("/export/pdf", carController.exportCarsAsPDF);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const SoldCar = require("../models/SoldCar");
const generateCSV = require("../utils/csv");
const generatePDF = require("../utils/pdf");
const fs = require("fs");
const { check, validationResult } = require("express-validator");
// const { protect } = require("../middleware/authMiddleware");

// // Add new car
// router.post("/", async (req, res) => {
//   try {
//     const car = new Car(req.body);
//     await car.save();
//     res.status(201).json(car);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Add new car
router.post(
  "/",
  [
    check("make").trim().notEmpty().withMessage("Make is required"),
    check("model").trim().notEmpty().withMessage("Model is required"),
    check("year").trim().isNumeric().withMessage("Year must be a number"),
    check("vin")
      .trim()
      .notEmpty()
      .isLength({ min: 11, max: 17 })
      .withMessage("VIN must be between 11 and 17 characters"),
    check("purchasePrice")
      .isNumeric()
      .trim()
      .withMessage("Purchase price must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extract expenses from the request body
      const { expenses = [] } = req.body;

      // Calculate total expenses
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      );

      // Create a new car object with totalExpenses
      const car = new Car({ ...req.body, totalExpenses });

      // Save the car to the database
      await car.save();

      // Respond with the created car
      res.status(201).json(car);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Add a new expense to a car
router.post("/:id/expenses", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount } = req.body; // Ex: { type: "Repair", amount: 500 }

    //  Validate input
    if (!type || typeof amount !== "number") {
      return res
        .status(400)
        .json({ error: "Type and amount (number) are required" });
    }

    // Find car by ID
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    const expense = { type, amount };
    // Add new expense
    car.expenses.push(expense);

    // Recalculate total expenses
    const totalExpenses = car.expenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );
    car.totalExpenses = totalExpenses;

    // If sale price exists (you might add it earlier), recalculate profit
    if (car.salePrice) {
      car.profit = car.salePrice - (car.purchasePrice || 0) - car.totalExpenses;
    }

    await car.save();

    res.json({
      message: "Expense added and totals updated successfully",
      car,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// //add expense to car
// router.post("/:id/expenses", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const expense = req.body; // Ex: { type: "Repair", amount: 500 }

//     // Validate input
//     if (!type || typeof amount !== "number") {
//       return res
//         .status(400)
//         .json({ error: "Type and amount (number) are required" });
//     }

//     // Find car by ID
//     const car = await Car.findById(id);
//     if (!car) return res.status(404).json({ error: "Car not found" });

//     // Add new expense
//     car.expenses.push(expense);

//     await car.save();

//     res.json({
//       message: "Expense added successfully",
//       car,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// Get all cars with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { make, model, year, vin, minPrice, maxPrice } = req.query;
    const filter = {};

    const page = parseInt(req.query.page) || 1; //  default to page 1
    const limit = parseInt(req.query.limit); // default to 10 items per page
    const skip = (page - 1) * limit; // calculate how many items to skip

    if (make) filter.make = make;
    if (model) filter.model = model;
    if (year) filter.year = Number(year);
    if (vin) filter.vin = vin;
    if (minPrice || maxPrice) {
      filter.purchasePrice = {};
      if (minPrice) filter.purchasePrice.$gte = Number(minPrice);
      if (maxPrice) filter.purchasePrice.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Car.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: cars.length,
      cars,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//get car details by id
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//edit car details with id
router.put("/:id", async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car details updated successfully", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//sell car
router.put("/:id/sell", async (req, res) => {
  try {
    const { salePrice } = req.body;

    if (salePrice === undefined || typeof salePrice !== "number") {
      return res
        .status(400)
        .json({ error: "salePrice must be provided as a number" });
    }
    // Find car by ID to sell
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // calculate the total expenses. I wanted to use reduce() here because it's a clean way to sum up values in an array.
    const totalExpenses = car.expenses
      ? car.expenses.reduce((total, expense) => total + expense.amount, 0)
      : 0;

    //calculate profit
    const profit = salePrice - car.purchasePrice - totalExpenses;

    // create sold car document

    const soldCar = new SoldCar({
      vin: car.vin,
      make: car.make,
      model: car.model,
      year: car.year,
      purchasePrice: car.purchasePrice,
      totalExpenses,
      salePrice,
      profit,
      soldDate: new Date(),
    });

    await soldCar.save();

    // after sell the car we need to remove the sold car from the available cars collection
    await car.deleteOne();

    res.json({ message: "Car sold successfully", soldCar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export cars as CSV
router.get("/export/csv", async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0) {
      return res.status(404).json({ error: "No cars found to export" });
    }

    const fields = [
      "make",
      "model",
      "year",
      "vin",
      "purchasePrice",
      "saleprice",
      "expenses",
      "purchaseDate",
    ];

    const csv = generateCSV(cars, fields);

    res.header("Content-Type", "text/csv");
    res.attachment("cars_export.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export cars as PDF
router.get("/export/pdf", async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0) {
      return res.status(404).json({ error: "No cars found to export" });
    }

    // Generate PDF using utils/pdf.js
    const filePath = generatePDF(
      "Available Cars Report",
      cars,
      "AvailableCarsReport.pdf"
    );

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
