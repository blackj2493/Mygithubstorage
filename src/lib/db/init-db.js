const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

async function initDb() {
  console.log('Starting database initialization...');
  
  const dbPath = path.join(__dirname, 'schools.db');
  const csvPath = path.join(__dirname, 'ontario-schools.csv');
  
  console.log('Database path:', dbPath);
  console.log('CSV path:', csvPath);

  try {
    // Try to close any existing database connections
    const existingDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    await existingDb.close();
    console.log('Closed existing database connection');
  } catch (error) {
    // Ignore errors here as the database might not exist yet
  }

  // Wait a bit to ensure the file is released
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Delete existing database if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Deleted existing database');
    }
  } catch (error) {
    console.error('Could not delete existing database. Please close any applications using it and try again.');
    console.error('You may need to stop your Next.js server and close VS Code.');
    process.exit(1);
  }

  // Verify CSV exists
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    process.exit(1);
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  console.log('Database connection opened');

  // Create schools table with exact column names from CSV
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      "School Name" TEXT,
      "School Type" TEXT,
      "School Level" TEXT,
      "School Language" TEXT,
      "Grade Range" TEXT,
      "Street" TEXT,
      "Municipality" TEXT,
      "City" TEXT,
      "Province" TEXT,
      "Postal Code" TEXT,
      "School Website" TEXT,
      "Latitude" REAL,
      "Longitude" REAL
    )
  `);
  console.log('Created schools table');

  // Read and parse CSV
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
  console.log(`Parsed ${records.length} records from CSV`);

  // Add this debug line after parsing the CSV but before insertion
  console.log('First CSV record:', records[0]);

  // Insert records
  for (const record of records) {
    await db.run(`
      INSERT INTO schools (
        "School Name", "School Type", "School Level", "School Language",
        "Grade Range", "Street", "Municipality", "City", "Province",
        "Postal Code", "School Website", "Latitude", "Longitude"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      record['School Name'],
      record['School Type'],
      record['School Level'],
      record['School Language'],
      record['Grade Range'],
      record['Street'],
      record['Municipality'],
      record['City'],
      record['Province'],
      record['Postal Code'],
      record['School Website'],
      parseFloat(record['Latitude']),
      parseFloat(record['Longitude'])
    ]);
  }

  // Verify data
  const count = await db.get('SELECT COUNT(*) as count FROM schools');
  console.log(`Inserted ${count.count} schools`);
  
  const sample = await db.get('SELECT * FROM schools LIMIT 1');
  console.log('Sample school:', sample);

  await db.close();
  console.log('Database initialized successfully!');
}

initDb().catch(error => {
  console.error('Error initializing database:', error);
  process.exit(1);
}); 