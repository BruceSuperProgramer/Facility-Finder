import * as SQLite from "expo-sqlite";
import facilitiesData from "@/assets/facilities.json";
import type { Facility } from "@/services/models/facility.types";

export const seedDatabase = async (
  db: SQLite.SQLiteDatabase
): Promise<void> => {
  const facilities = facilitiesData as Facility[];

  // Step 1: Collect all unique amenities
  const uniqueAmenities = new Set<string>();
  facilities.forEach((facility) => {
    facility.facilities.forEach((amenity) => uniqueAmenities.add(amenity));
  });

  // Use a transaction to batch all inserts together
  // This ensures atomicity and performance
  await db.withTransactionAsync(async () => {
    // Step 2: Insert amenities
    const amenityStatement = await db.prepareAsync(
      "INSERT OR REPLACE INTO amenities (name) VALUES (?)"
    );

    try {
      for (const amenityName of uniqueAmenities) {
        await amenityStatement.executeAsync([amenityName]);
      }
    } finally {
      await amenityStatement.finalizeAsync();
    }

    // Fetch amenity IDs to map names to IDs
    const amenityIdMap = new Map<string, number>();
    const amenityRows = await db.getAllAsync<{ id: number; name: string }>(
      "SELECT id, name FROM amenities"
    );
    amenityRows.forEach((row) => {
      amenityIdMap.set(row.name, row.id);
    });

    // Step 3: Insert facilities
    const facilityStatement = await db.prepareAsync(
      "INSERT OR REPLACE INTO facilities (id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)"
    );

    try {
      for (const facility of facilities) {
        await facilityStatement.executeAsync([
          facility.id,
          facility.name,
          facility.address,
          facility.location.latitude,
          facility.location.longitude,
        ]);
      }
    } finally {
      await facilityStatement.finalizeAsync();
    }

    // Step 4: Insert facility-amenity relationships
    const relationStatement = await db.prepareAsync(
      "INSERT OR REPLACE INTO facility_amenities (facility_id, amenity_id) VALUES (?, ?)"
    );

    try {
      for (const facility of facilities) {
        for (const amenityName of facility.facilities) {
          const amenityId = amenityIdMap.get(amenityName);
          if (amenityId) {
            await relationStatement.executeAsync([facility.id, amenityId]);
          }
        }
      }
    } finally {
      await relationStatement.finalizeAsync();
    }
  });
};
