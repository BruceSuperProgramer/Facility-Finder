import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as SQLite from "expo-sqlite";

export interface DatabaseInfo {
  path: string;
  exists: boolean;
  size: number;
  sizeFormatted: string;
  modificationTime: number | null;
  directory: string;
}

/**
 * Get detailed information about the SQLite database file location and stats
 */
export const getDatabaseInfo = async (
  dbName: string = "facilities.db"
): Promise<DatabaseInfo> => {
  const dbDir = `${FileSystem.documentDirectory}SQLite/`;
  const dbPath = `${dbDir}${dbName}`;

  const info = await FileSystem.getInfoAsync(dbPath);

  const sizeFormatted = info.exists ? formatBytes(info.size || 0) : "N/A";

  const result: DatabaseInfo = {
    path: dbPath,
    exists: info.exists,
    size: info.exists ? info.size || 0 : 0,
    sizeFormatted,
    modificationTime: info.exists ? info.modificationTime || null : null,
    directory: dbDir,
  };

  console.log("📁 Database Information:");
  console.log(`  Path: ${result.path}`);
  console.log(`  Exists: ${result.exists ? "✅ Yes" : "❌ No"}`);
  console.log(`  Size: ${result.sizeFormatted}`);
  console.log(`  Directory: ${result.directory}`);
  if (result.modificationTime) {
    console.log(
      `  Last Modified: ${new Date(result.modificationTime).toLocaleString()}`
    );
  }

  return result;
};

/**
 * Share/export the database file (useful for debugging or backup)
 */
export const shareDatabase = async (
  dbName: string = "facilities.db"
): Promise<void> => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const info = await FileSystem.getInfoAsync(dbPath);

  if (!info.exists) {
    console.error("❌ Database file not found:", dbPath);
    throw new Error("Database file does not exist");
  }

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    console.error("❌ Sharing is not available on this device");
    throw new Error("Sharing is not available on this device");
  }

  console.log("📤 Sharing database file:", dbPath);
  await Sharing.shareAsync(dbPath, {
    mimeType: "application/x-sqlite3",
    dialogTitle: "Export SQLite Database",
  });
};

/**
 * Copy database to a more accessible location (Downloads/Documents)
 */
export const copyDatabaseToDocuments = async (
  dbName: string = "facilities.db"
): Promise<string> => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const info = await FileSystem.getInfoAsync(dbPath);

  if (!info.exists) {
    throw new Error("Database file does not exist");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const copyPath = `${FileSystem.documentDirectory}${dbName.replace(
    ".db",
    ""
  )}_${timestamp}.db`;

  await FileSystem.copyAsync({
    from: dbPath,
    to: copyPath,
  });

  console.log("📋 Database copied to:", copyPath);
  return copyPath;
};

/**
 * Get database file as base64 string (useful for upload/sync)
 */
export const getDatabaseAsBase64 = async (
  dbName: string = "facilities.db"
): Promise<string> => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const info = await FileSystem.getInfoAsync(dbPath);

  if (!info.exists) {
    throw new Error("Database file does not exist");
  }

  const base64 = await FileSystem.readAsStringAsync(dbPath, {
    encoding: FileSystem.EncodingType.Base64,
  });

  console.log(`📦 Database encoded as base64 (${base64.length} characters)`);
  return base64;
};

/**
 * Comprehensive database debug function that combines file info with data stats
 */
export const debugDatabaseComplete = async (
  db: SQLite.SQLiteDatabase,
  dbName: string = "facilities.db"
): Promise<void> => {
  console.log("\n" + "=".repeat(50));
  console.log("🔍 COMPLETE DATABASE DEBUG INFORMATION");
  console.log("=".repeat(50) + "\n");

  // File system info
  await getDatabaseInfo(dbName);

  console.log("\n" + "-".repeat(50) + "\n");

  // Database content stats
  const facilityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facilities"
  );
  const amenityCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM amenities"
  );
  const relationCount = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM facility_amenities"
  );

  console.log("📊 Database Statistics:");
  console.log(`  Facilities: ${facilityCount?.count || 0}`);
  console.log(`  Amenities: ${amenityCount?.count || 0}`);
  console.log(`  Relations: ${relationCount?.count || 0}`);

  console.log("\n" + "=".repeat(50) + "\n");
};

// Helper function to format bytes
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
