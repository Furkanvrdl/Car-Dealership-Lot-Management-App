const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
});

const CarSchema = new mongoose.Schema(
  {
    vin: { type: String, required: true, unique: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    status: { type: String, enum: ["available", "sold"], default: "available" },
    expenses: [ExpenseSchema],
    totalExpenses: { type: Number, default: 0 },
    salePrice: { type: Number },
    profit: { type: Number },
    saleDate: { type: Date },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// const initilization = async () => {
//   try {
//     const count = await Car.countDocuments(); //Wait until the database finishes counting documents, then assign that number to count
//     if (count === 0) {
//       const sampleCars = [
//         {
//           vin: "TEST124",
//           make: "Toyota",
//           model: "Camry",
//           year: 2020,
//           purchasePrice: 20000,
//         },
//         {
//           vin: "TEST123",
//           make: "Toyota",
//           model: "Camry",
//           year: 2019,
//           purchasePrice: 18000,
//         },
//         {
//           vin: "TEST125",
//           make: "Toyota",
//           model: "Camry",
//           year: 2021,
//           purchasePrice: 22000,
//         },
//       ];
//       await Car.insertMany(sampleCars); // waits until students are added before moving on.
//       console.log("Sample cars added to the database");
//     } else {
//       console.log("Database already contains cars data");
//     }
//   } catch (error) {
//     console.error("Error during initialization:", error);
//   }
// };
// mongoose.connection.once("open", () => {
//   initilization();
// });
const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
