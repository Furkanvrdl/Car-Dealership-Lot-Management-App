/*const Car = require("../models/Car");
const SoldCar = require("../models/SoldCar");
const generateCSV = require("../utils/csv");
const generatePDF = require("../utils/pdf");
const fs = require("fs");

exports.addCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all cars with filtering and pagination
exports.getAllCars = async (req, res) => {
  try {
    const { make, model, year, vin, minPrice, maxPrice } = req.query;
    const filter = {};

    const page = parseInt(req.query.page) || 1; //  default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 items per page
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
};

//edit car details with id
exports.editCarById = async (req, res) => {
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
};

//sell car
exports.sellCar = async (req, res) => {
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
};

// Export cars as CSV
exports.exportCarsAsCSV = async (req, res) => {
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
};

// Export cars as PDF
exports.exportCarsAsPDF = async (req, res) => {
  try {
    const cars = await Car.find();

    if (cars.length === 0) {
      return res.status(404).json({ error: "No cars found to export" });
    }

    // Generate PDF using utils/pdf.js
    const filePath = generatePDF("Cars Report", cars, "CarsReport.pdf");

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
