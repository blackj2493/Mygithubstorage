#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const projectRoot = path.join(__dirname, '..');
const dbPath = path.join(projectRoot, 'data', 'postal-codes.db');

console.log('🧪 Testing postal codes database...');
console.log(`📍 Database: ${dbPath}`);

try {
  // Open database
  const db = new Database(dbPath, { readonly: true });
  console.log('✅ Database connection successful');

  // Test 1: Count total records
  const countResult = db.prepare('SELECT COUNT(*) as count FROM postal_codes').get();
  console.log(`📊 Total postal codes: ${countResult.count.toLocaleString()}`);

  // Test 2: Sample some records
  const sampleResults = db.prepare('SELECT * FROM postal_codes LIMIT 5').all();
  console.log('\n📋 Sample records:');
  sampleResults.forEach(row => {
    console.log(`   ${row.postal_code}: ${row.latitude}, ${row.longitude}`);
  });

  // Test 3: Test specific postal codes (common Ottawa ones)
  const testCodes = ['K1P0C8', 'K2P0A5', 'K1A0A1', 'K1G0A1', 'K2K0A1'];
  console.log('\n🔍 Testing specific postal codes:');
  
  const stmt = db.prepare('SELECT * FROM postal_codes WHERE postal_code = ?');
  testCodes.forEach(code => {
    const result = stmt.get(code);
    if (result) {
      console.log(`   ✅ ${code}: ${result.latitude}, ${result.longitude}`);
    } else {
      console.log(`   ❌ ${code}: Not found`);
    }
  });

  // Test 4: Batch lookup performance test
  console.log('\n⚡ Performance test (batch lookup):');
  const batchCodes = ['K1P0C8', 'K2P0A5', 'K1A0A1', 'K1G0A1', 'K2K0A1', 'K1H0A1', 'K1J0A1', 'K1K0A1', 'K1L0A1', 'K1M0A1'];
  
  const startTime = Date.now();
  const placeholders = batchCodes.map(() => '?').join(',');
  const batchQuery = `SELECT postal_code, latitude, longitude FROM postal_codes WHERE postal_code IN (${placeholders})`;
  const batchResults = db.prepare(batchQuery).all(batchCodes);
  const endTime = Date.now();
  
  console.log(`   📈 Looked up ${batchCodes.length} postal codes in ${endTime - startTime}ms`);
  console.log(`   📍 Found ${batchResults.length} matches`);
  console.log(`   🚀 Speed: ${Math.round(batchResults.length / ((endTime - startTime) / 1000))} lookups/second`);

  // Test 5: Check for common Ontario postal code prefixes
  console.log('\n🗺️ Ontario postal code coverage:');
  const prefixes = ['K0A', 'K0B', 'K0C', 'K1A', 'K1B', 'K1C', 'K1G', 'K1H', 'K1J', 'K1K', 'K1L', 'K1M', 'K1N', 'K1P', 'K1R', 'K1S', 'K1T', 'K1V', 'K1W', 'K1X', 'K1Y', 'K1Z', 'K2A', 'K2B', 'K2C', 'K2E', 'K2G', 'K2H', 'K2J', 'K2K', 'K2L', 'K2M', 'K2P', 'K2R', 'K2S', 'K2T', 'K2V', 'K2W'];
  
  prefixes.slice(0, 10).forEach(prefix => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM postal_codes WHERE postal_code LIKE '${prefix}%'`).get();
    console.log(`   ${prefix}*: ${count.count} postal codes`);
  });

  // Close database
  db.close();
  console.log('\n✅ Database test completed successfully!');
  console.log('🚀 Your postal code database is ready for instant geocoding!');

} catch (error) {
  console.error('❌ Database test failed:', error.message);
  console.log('\n💡 Make sure you have run: npm run setup-postal-codes');
  process.exit(1);
}
