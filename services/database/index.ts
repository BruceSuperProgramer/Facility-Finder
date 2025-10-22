// Database configuration
export { initializeDatabase, openDatabase } from "./config";

// Query functions
export {
  debugDatabase,
  getAmenities,
  getFacilitiesPaginated,
  getFacilityById,
  runCustomQuery,
} from "./queries";

// Debug utilities
export {
  copyDatabaseToDocuments,
  debugDatabaseComplete,
  getDatabaseAsBase64,
  getDatabaseInfo,
  shareDatabase,
} from "./debug-utils";
export { logDatabaseLocation } from "./log-db-location";

// Types
export type { Facility } from "@/services/models/facility.types";
export type { DatabaseInfo } from "./debug-utils";
