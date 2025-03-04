// Import the required libraries
const XLSX = require('xlsx');
const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importExcelData(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath, {
      cellDates: true,
      cellNF: false,
      cellText: false
    });

    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Get a client from the pool
    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // Clear existing exercises
      await client.query('TRUNCATE TABLE exercises RESTART IDENTITY CASCADE');

      // Prepare the insert query
      const insertQuery = `
        INSERT INTO exercises (
          exercise_name,
          description,
          target_muscles,
          met_value,
          category,
          duration,
          estimated_calories
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      // Insert each row
      for (const row of data) {
        await client.query(insertQuery, [
          row.Exercise || '',
          row.Description || '',
          row['Target Muscles'] || '',
          parseFloat(row['MET Value']) || 0,
          row.Category || 'General',
          30, // Default duration
          0   // Default estimated calories (will be calculated per user)
        ]);
      }

      // Commit transaction
      await client.query('COMMIT');
      console.log(`Successfully imported ${data.length} exercises`);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Get the file path from command line argument
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide the Excel file path as an argument');
  process.exit(1);
}

// Run the import
importExcelData(filePath)
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });