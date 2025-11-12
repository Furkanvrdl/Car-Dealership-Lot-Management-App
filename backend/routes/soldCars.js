// codes after controller.
/*const express = require("express");
const router = express.Router();
const soldCarController = require("../controllers/soldCarController");

router.get("/", soldCarController.getAllSoldCars);
router.put("/:id", soldCarController.editSoldCarById);
router.get("/export/csv", soldCarController.exportSoldCarsAsCSV);
router.get("/export/pdf", soldCarController.exportSoldCarsAsPDF);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const SoldCar = require("../models/SoldCar");
// const { Parser } = require("json2csv"); // for CSV export
// const PDFDocument = require("pdfkit"); // for PDF generation
const generateCSV = require("../utils/csv");
const generatePDF = require("../utils/pdf");
const fs = require("fs");
// const { protect } = require("../middleware/authMiddleware");

// Get all sold cars with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { make, model, year, vin, minPrice, maxPrice, maxProfit, minProfit } =
      req.query;

    const page = parseInt(req.query.page) || 1; //  default to page 1
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit; // calculate how many items to skip

    const filter = {};

    if (make) filter.make = make;
    if (model) filter.model = model;
    if (year) filter.year = Number(year);
    if (vin) filter.vin = vin;
    if (minPrice || maxPrice) {
      filter.purchasePrice = {};
      if (minPrice) filter.purchasePrice.$gte = Number(minPrice);
      if (maxPrice) filter.purchasePrice.$lte = Number(maxPrice);
    }
    if (minProfit || maxProfit) {
      filter.profit = {};
      if (minProfit) filter.profit.$gte = Number(minProfit);
      if (maxProfit) filter.profit.$lte = Number(maxProfit);
    }

    const soldCars = await SoldCar.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ soldDate: -1 }); // newest first

    const total = await SoldCar.countDocuments(filter);
    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: soldCars.length,
      soldCars,
    });

    res.json(soldCars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit sold car details by ID
router.put("/:id", async (req, res) => {
  try {
    const car = await SoldCar.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });

    // Update all editable fields from req.body
    Object.assign(car, req.body); // to update fields dynamically.

    // If salePrice , totalExpenses, and purchasePrice changed recalculate profit
    if (
      req.body.salePrice !== undefined ||
      req.body.totalExpenses !== undefined ||
      req.body.purchasePrice !== undefined
    ) {
      const salePrice = Number(car.salePrice);
      car.profit =
        salePrice - (car.purchasePrice || 0) - (car.totalExpenses || 0);
    }

    await car.save();

    res.json({ message: "Car details updated successfully", car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Export sold cars as CSV
router.get("/export/csv", async (req, res) => {
  try {
    const soldCars = await SoldCar.find();

    if (soldCars.length === 0) {
      return res.status(404).json({ error: "No sold cars found to export" });
    }

    // Define the COLUMNS for CSV
    const fields = [
      "make",
      "model",
      "year",
      "vin",
      "purchasePrice",
      "salePrice",
      "totalExpenses",
      "profit",
      "soldDate",
    ];

    const csv = generateCSV(soldCars, fields); // Generate CSV data using utils/csv.js

    res.header("Content-Type", "text/csv"); // Set the content type
    res.attachment("sold_cars.csv"); // Set the file name for download
    res.send(csv); // Send the CSV data as response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export sold cars as PDF
router.get("/export/pdf", async (req, res) => {
  try {
    const soldCars = await SoldCar.find();
    if (soldCars.length === 0) {
      return res.status(404).json({ error: "No sold cars found to export" });
    }
    // Generate PDF using utils/pdf.js
    const filePath = generatePDF(
      "Sold Cars Report",
      soldCars,
      "soldCarsReport.pdf"
    );

    res.download(filePath);
    // When the PDF generation is finished, send the file for download
    // stream.on("finish", () => {
    //   res.download(filePath);
    // });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
