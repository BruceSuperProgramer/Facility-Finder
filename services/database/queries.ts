import * as SQLite from "expo-sqlite";
import type { Facility } from "@/services/models/facility.types";

// Shared type for database row result
type FacilityRow = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  facilities: string | null;
};

// Shared mapper function to transform row to Facility
const mapRowToFacility = (row: FacilityRow): Facility => ({
  id: row.id,
  name: row.name,
  address: row.address,
  location: {
    latitude: row.latitude,
    longitude: row.longitude,
  },
  facilities: row.facilities ? row.facilities.split(",") : [],
});

// Base SQL query for selecting facilities with amenities
const BASE_FACILITY_QUERY = `
  SELECT 
    f.id,
    f.name,
    f.address,
    f.latitude,
    f.longitude,
    GROUP_CONCAT(a.name, ',') as facilities
  FROM facilities f
  LEFT JOIN facility_amenities fa ON f.id = fa.facility_id
  LEFT JOIN amenities a ON fa.amenity_id = a.id
`;

// New query with JOIN - returns facilities as comma-separated string
export const getFacilitiesPaginated = async (
  db: SQLite.SQLiteDatabase,
  limit: number = 20,
  offset: number = 0,
  searchQuery?: string
): Promise<Facility[]> => {
  let query = BASE_FACILITY_QUERY;
  const params: any[] = [];

  if (searchQuery?.trim()) {
    // Matches facilities by name OR by having a matching amenity
    const searchPattern = `%${searchQuery}%`;
    query += ` 
      WHERE f.name LIKE ? 
      OR EXISTS (
        SELECT 1 
        FROM facility_amenities fa_search 
        JOIN amenities a_search ON fa_search.amenity_id = a_search.id
        WHERE fa_search.facility_id = f.id 
        AND a_search.name LIKE ?
      )
    `;
    params.push(searchPattern, searchPattern);
  }

  query += " GROUP BY f.id";
  query += " ORDER BY f.name ASC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const rows = await db.getAllAsync<FacilityRow>(query, ...params);

  return rows.map(mapRowToFacility);
};

export const getFacilityById = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<Facility | null> => {
  const query = `${BASE_FACILITY_QUERY} WHERE f.id = ? GROUP BY f.id`;

  const row = await db.getFirstAsync<FacilityRow>(query, id);

  if (!row) return null;

  return mapRowToFacility(row);
};

// Debug helper functions
export const debugDatabase = async (db: SQLite.SQLiteDatabase) => {
  const facilityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facilities"
  );
  const amenityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM amenities"
  );
  const relationCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facility_amenities"
  );

  console.log("📊 Database Stats:");
  console.log(`  Facilities: ${facilityCount?.count || 0}`);
  console.log(`  Amenities: ${amenityCount?.count || 0}`);
  console.log(`  Relations: ${relationCount?.count || 0}`);

  // Sample data
  const sampleFacilities = await db.getAllAsync(
    "SELECT * FROM facilities LIMIT 3"
  );
  const sampleAmenities = await db.getAllAsync(
    "SELECT * FROM amenities LIMIT 5"
  );

  console.log("\n🏢 Sample Facilities:");
  console.log(JSON.stringify(sampleFacilities, null, 2));

  console.log("\n🎯 Sample Amenities:");
  console.log(JSON.stringify(sampleAmenities, null, 2));

  return {
    counts: {
      facilities: facilityCount?.count || 0,
      amenities: amenityCount?.count || 0,
      relations: relationCount?.count || 0,
    },
    samples: {
      facilities: sampleFacilities,
      amenities: sampleAmenities,
    },
  };
};

export const runCustomQuery = async (
  db: SQLite.SQLiteDatabase,
  query: string,
  params: any[] = []
) => {
  const result = await db.getAllAsync(query, ...params);
  console.log("Query Result:", JSON.stringify(result, null, 2));
  return result;
};
