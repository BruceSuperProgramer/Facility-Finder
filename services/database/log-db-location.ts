/**
 * Manual database location logger
 *
 * Call this function when you want to see the database location,
 * rather than automatically on startup.
 */

import { getDatabaseInfo } from "./debug-utils";

/**
 * Logs the database location to console
 * Safe to call anytime after the app has started
 */
export const logDatabaseLocation = async (): Promise<void> => {
  try {
    await getDatabaseInfo("facilities.db");
  } catch (error) {
    console.error("❌ Failed to get database info:", error);
  }
};
