import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  console.log('Starting database initialization...');
  
  // Check current working directory
  console.log('Current working directory:', process.cwd());
  
  const dbPath = path.join(process.cwd(), 'src/lib/db/schools.db');
  const csvPath = path.join(process.cwd(), 'src/lib/db/ontario-schools.csv');
  
  console.log('Database path:', dbPath);
  console.log('CSV path:', csvPath);
  
  // Verify CSV file exists
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found!');
    console.log('Looking for file at:', csvPath);
    process.exit(1);
  }

  // Verify database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    console.log('Creating database directory...');
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Delete existing database if it exists
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing database');
  }

  // Open database connection
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