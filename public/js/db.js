import sql from "mssql";

/**
 * SQL Server connection configuration.
 *
 * All values are read from environment variables. If not provided,
 * fallback defaults are used where appropriate.
 */
const config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "",
};

/**
 * Establishes a connection pool to the SQL Server database.
 *
 * Uses environment variables for configuration, constructs the connection string manually,
 * and throws on failure. Connection pooling is handled by the `mssql` library.
 *
 * @returns A connected SQL Server `ConnectionPool` instance
 * @throws If the connection attempt fails
 */
export async function connectToDatabase() {
  try {
    const pool = await sql.connect(
      `Server=${config.server};Database=${config.database};User Id=${config.user};Password=${config.password};Encrypt=true;TrustServerCertificate=true`
    );
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
