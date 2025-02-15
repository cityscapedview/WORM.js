import pg from "pg";

let db;

class Database {
  constructor() {
    this.client = new pg.Client({
      connectionString: "postgres://postgres:postgres@localhost:5432/worm",
    });
  }

  async connection() {
    try {
      await this.client.connect();
      console.log("Connected to the database");
    } catch (err) {
      console.log("Connection error:", err);
    }
  }

  async queryDb(userQuery) {
    try {
      console.log(userQuery);
      const result = await this.client.query(userQuery);
      return result;
    } catch (err) {
      console.error("Database query error:", err);
    }
  }

  async close() {
    try {
      await this.client.end();
      console.log("Database connection closed");
    } catch (err) {
      console.log("Connection error:", err);
    }
  }
}

function getInstance() {
  if (db) {
    return db;
  }

  db = new Database();
  return db;
}

export { getInstance };
