// Database configuration
export { openDatabase, initializeDatabase } from "./config";

// Query functions
export {
  getFacilitiesPaginated,
  getFacilityById,
  debugDatabase,
  runCustomQuery,
} from "./queries";

// Debug utilities
export {
  getDatabaseInfo,
  shareDatabase,
  copyDatabaseToDocuments,
  getDatabaseAsBase64,
  debugDatabaseComplete,
} from "./debug-utils";
export { logDatabaseLocation } from "./log-db-location";

// Types
export type { Facility } from "@/services/models/facility.types";
export type { DatabaseInfo } from "./debug-utils";
