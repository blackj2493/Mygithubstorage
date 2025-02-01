import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'src/lib/db/schools.db'),
      driver: sqlite3.Database
    });
  }
  return db;
}

async function findNearbySchools(latitude: number, longitude: number) {
  const db = await getDb();
  
  // Using Haversine formula to calculate distances
  const query = `
    SELECT *, 
      (6371 * acos(
        cos(radians(?)) * 
        cos(radians(Latitude)) * 
        cos(radians(Longitude) - radians(?)) + 
        sin(radians(?)) * 
        sin(radians(Latitude))
      )) AS distance
    FROM schools
    HAVING distance <= 8
    ORDER BY distance
    LIMIT 20
  `;
  
  return await db.all(query, [latitude, longitude, latitude]);
}

export {
  getDb,
  findNearbySchools
}; 