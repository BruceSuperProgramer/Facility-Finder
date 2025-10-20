import * as SQLite from "expo-sqlite";
import { seedDatabase } from "./seed";

const DB_NAME = "facilities.db";

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return await SQLite.openDatabaseAsync(DB_NAME);
};

export const resetDatabase = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  await db.execAsync(`
    DROP TABLE IF EXISTS facility_amenities;
    DROP TABLE IF EXISTS amenities;
    DROP TABLE IF EXISTS facilities;
  `);
  await createTables(db);
  await seedDatabase(db);
};

export const initializeDatabase = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  await createTables(db);
  await seedIfEmpty(db);
};

const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS facilities (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
    
    -- Amenities/facilities lookup table
    CREATE TABLE IF NOT EXISTS amenities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    
    -- Junction table (many-to-many relationship)
    CREATE TABLE IF NOT EXISTS facility_amenities (
      facility_id TEXT NOT NULL,
      amenity_id INTEGER NOT NULL,
      PRIMARY KEY (facility_id, amenity_id),
      FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
      FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);
    CREATE INDEX IF NOT EXISTS idx_amenities_name ON amenities(name);
    CREATE INDEX IF NOT EXISTS idx_facility_amenities_facility ON facility_amenities(facility_id);
    CREATE INDEX IF NOT EXISTS idx_facility_amenities_amenity ON facility_amenities(amenity_id);
  `);
};

const seedIfEmpty = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  const facilityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facilities"
  );
  const amenityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM amenities"
  );
  const relationCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facility_amenities"
  );

  // Seed if any table is empty (indicates incomplete or missing seed)
  if (
    (facilityCount?.count || 0) === 0 ||
    (amenityCount?.count || 0) === 0 ||
    (relationCount?.count || 0) === 0
  ) {
    await seedDatabase(db);
  }
};
