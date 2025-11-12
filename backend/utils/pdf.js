const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generates a simple PDF report.
 * @param {string} title - Title of the PDF document.
 * @param {Array} data - Array of car objects.
 * @param {string} filename - Name of the PDF file to create.
 * @returns {string} The full file path.
 */

function generatePDF(title, data, filename) {
  const filePath = path.join(__dirname, `../reports/${filename}`);

  // Ensure directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text(title, { align: "center" });
  doc.moveDown();

  data.forEach((car, i) => {
    doc
      .fontSize(12)
      .fillColor("red")
      .text(
        `${i + 1}. ${car.make} ${car.model} (${car.year}) (VIN: ${car.vin})\n`
      );

    doc
      .fillColor("black")
      .text(
        `Purchase Price: $${car.purchasePrice}\n` +
          `Total Expenses: $${car.totalExpenses}\n` +
          `Sale Price: ${car.salePrice ? "$" + car.salePrice : "N/A"}\n` +
          `Profit: ${car.profit ? "$" + car.profit : "N/A"} `
      );
    doc.moveDown(0.5);
  });

  doc.end();

  return filePath;
}

module.exports = generatePDF;
