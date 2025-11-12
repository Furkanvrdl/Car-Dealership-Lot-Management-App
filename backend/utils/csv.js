const { Parser } = require("json2csv"); // Import the Parser from json2csv

function generateCSV(data, fields) {
  const parser = new Parser({ fields }); // Create a new parser instance
  return parser.parse(data); // Parse the data to CSV format
}

module.exports = generateCSV;
