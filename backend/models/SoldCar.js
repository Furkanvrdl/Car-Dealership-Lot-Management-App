const mongoose = require("mongoose");

const SoldCarSchema = new mongoose.Schema(
  {
    vin: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    totalExpenses: { type: Number, required: true },
    profit: { type: Number, required: true },
    soldDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoldCar", SoldCarSchema);
