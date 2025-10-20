import { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { initializeDatabase, openDatabase } from "@/services/database";

interface DatabaseContextType {
  db: SQLite.SQLiteDatabase | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
});

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await openDatabase();
        await initializeDatabase(database);
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
