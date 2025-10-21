// Database configuration
export { openDatabase, initializeDatabase } from "./config";

// Query functions
export {
  getFacilitiesPaginated,
  getFacilityById,
  debugDatabase,
  runCustomQuery,
} from "./queries";

// Types
export type { Facility } from "@/services/models/facility.types";
