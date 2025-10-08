import fs from 'fs';
import csv from 'csv-parser';

const csvParser = async (filePath, costCenterId) => {
  const parsed = [];
  const errors = [];

  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (!row.Serial || !row.Manufacturer || !row.Model) {
          errors.push({ row, error: 'Missing required fields' });
        } else {
          parsed.push({
            serial: row.Serial,
            manufacturer: row.Manufacturer,
            model: row.Model,
            costCenterId,
            date: new Date()
          });
        }
      })
      .on('end', () => resolve({ parsed, errors }));
  });
};

export default csvParser;