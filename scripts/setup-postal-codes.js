#!/usr/bin/env node

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.join(__dirname, '..');
const dataDir = path.join(projectRoot, 'data');
const dbPath = path.join(dataDir, 'postal-codes.db');
const textFilePath = path.join(projectRoot, 'Ontario-postal-code-to-coordinate.txt');

console.log('🚀 Setting up postal codes database...');
console.log(`📁 Data directory: ${dataDir}`);
console.log(`📄 Text file: ${textFilePath}`);
console.log(`🗄️ Database: ${dbPath}`);

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Check if text file exists
if (!fs.existsSync(textFilePath)) {
  console.error('❌ Error: Ontario-postal-code-to-coordinate.txt not found in project root');
  console.log('📋 Please ensure the file is placed at:', textFilePath);
  process.exit(1);
}

// Initialize database
try {
  const db = new Database(dbPath);
  console.log('✅ Connected to SQLite database');

  // Create table
  db.exec(`
    CREATE TABLE IF NOT EXISTS postal_codes (
      postal_code TEXT PRIMARY KEY,
      latitude REAL,
      longitude REAL
    )
  `);
  console.log('✅ Created postal_codes table');

  // Create index for fast lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_postal_code ON postal_codes(postal_code)
  `);
  console.log('✅ Created index for fast lookups');

// Read and parse the text file
console.log('📖 Reading postal codes file...');
const data = fs.readFileSync(textFilePath, 'utf8');
const lines = data.split('\n');

// Skip header line and filter out empty lines
const dataLines = lines.slice(1).filter(line => line.trim().length > 0);
console.log(`📊 Found ${dataLines.length} postal code records`);

  // Prepare insert statement
  const stmt = db.prepare('INSERT OR REPLACE INTO postal_codes (postal_code, latitude, longitude) VALUES (?, ?, ?)');

  let insertedCount = 0;
  let errorCount = 0;

  console.log('💾 Inserting postal codes into database...');

  // Process each line
  dataLines.forEach((line, index) => {
    try {
      // Split by whitespace and handle the format: "K0A 0A1 45.3107 -75.0894"
      const parts = line.trim().split(/\s+/);

      if (parts.length >= 4) {
        // Handle postal codes that might be split (e.g., "K0A 0A1" or "K0A0A1")
        let postalCode, lat, lng;

        if (parts.length === 4) {
          // Format: "K0A 0A1 45.3107 -75.0894"
          postalCode = parts[0] + parts[1]; // Combine "K0A" + "0A1" = "K0A0A1"
          lat = parseFloat(parts[2]);
          lng = parseFloat(parts[3]);
        } else if (parts.length === 3) {
          // Format: "K0A0A1 45.3107 -75.0894"
          postalCode = parts[0];
          lat = parseFloat(parts[1]);
          lng = parseFloat(parts[2]);
        } else {
          throw new Error(`Unexpected format: ${parts.length} parts`);
        }

        // Validate data
        if (!postalCode || isNaN(lat) || isNaN(lng)) {
          throw new Error(`Invalid data: postal=${postalCode}, lat=${lat}, lng=${lng}`);
        }

        // Clean postal code (remove spaces, convert to uppercase)
        const cleanPostalCode = postalCode.replace(/\s/g, '').toUpperCase();

        // Insert into database
        try {
          stmt.run(cleanPostalCode, lat, lng);
          insertedCount++;

          // Progress indicator
          if (insertedCount % 10000 === 0) {
            console.log(`📈 Inserted ${insertedCount} records...`);
          }
        } catch (err) {
          console.error(`❌ Error inserting ${cleanPostalCode}:`, err.message);
          errorCount++;
        }

      } else {
        throw new Error(`Not enough parts: ${parts.length}`);
      }

    } catch (error) {
      console.error(`❌ Error processing line ${index + 1}: "${line.trim()}" - ${error.message}`);
      errorCount++;
    }
  });

  // Close database
  db.close();
  console.log('✅ Database connection closed');

  // Final summary
  console.log('\n🎉 Setup Complete!');
  console.log(`✅ Successfully inserted: ${insertedCount} postal codes`);
  if (errorCount > 0) {
    console.log(`⚠️ Errors encountered: ${errorCount}`);
  }
  console.log(`📍 Database location: ${dbPath}`);
  console.log('🚀 Your map will now load instantly!');

  process.exit(errorCount > 0 ? 1 : 0);

} catch (error) {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
}
