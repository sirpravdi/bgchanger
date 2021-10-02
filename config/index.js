const path = require('path');

const dbFolder = path.resolve(__dirname, '../db');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const uploadsFolder = path.resolve(__dirname, '../uploads');

module.exports = {
  PORT: 8080, 
  dbFolder, 
  dbDumpFile,
  uploadsFolder
}