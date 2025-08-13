import Database from 'better-sqlite3';
import path from 'path';

// Database path
const dbPath = path.join(process.cwd(), 'data', 'postal-codes.db');

/**
 * Fast batch postal code geocoding using local SQLite database
 * 
 * POST /api/geocode/batch-postal-codes
 * Body: { postalCodes: ["K1P0C8", "K2P0A5", "K1A0A1"] }
 * Response: { "K1P0C8": { lat: 45.42, lng: -75.69 }, ... }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  const startTime = Date.now();
  
  try {
    const { postalCodes } = req.body;
    
    // Validate input
    if (!postalCodes || !Array.isArray(postalCodes)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'postalCodes must be an array of postal code strings'
      });
    }
    
    if (postalCodes.length === 0) {
      return res.status(200).json({});
    }
    
    console.log(`🔍 Looking up ${postalCodes.length} postal codes in database`);
    
    // Clean and normalize postal codes
    const cleanPostalCodes = postalCodes.map(code => {
      if (typeof code !== 'string') return null;
      return code.replace(/\s/g, '').toUpperCase();
    }).filter(Boolean);
    
    if (cleanPostalCodes.length === 0) {
      return res.status(400).json({
        error: 'Invalid postal codes',
        message: 'No valid postal codes found in the request'
      });
    }
    
    // Open database connection
    const db = new Database(dbPath, { readonly: true });

    // Create placeholders for SQL query
    const placeholders = cleanPostalCodes.map(() => '?').join(',');

    const query = `
      SELECT postal_code, latitude, longitude
      FROM postal_codes
      WHERE postal_code IN (${placeholders})
    `;

    // Execute query
    const rows = db.prepare(query).all(cleanPostalCodes);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Build results object
    const results = {};
    let foundCount = 0;

    rows.forEach(row => {
      results[row.postal_code] = {
        lat: row.latitude,
        lng: row.longitude
      };
      foundCount++;
    });

    // Log results
    console.log(`✅ Found ${foundCount}/${cleanPostalCodes.length} postal codes in ${duration}ms`);

    if (foundCount < cleanPostalCodes.length) {
      const missing = cleanPostalCodes.filter(code => !results[code]);
      console.log(`⚠️ Missing postal codes: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`);
    }

    // Close database connection
    db.close();

    // Return results with metadata
    res.status(200).json({
      results,
      metadata: {
        requested: cleanPostalCodes.length,
        found: foundCount,
        missing: cleanPostalCodes.length - foundCount,
        duration_ms: duration
      }
    });
    
  } catch (error) {
    console.error('❌ Unexpected error in batch-postal-codes API:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing postal codes'
    });
  }
}

/**
 * Configuration for Next.js API route
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Allow larger requests for batch processing
    },
  },
}
