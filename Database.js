import pg from "pg";

let db;

class Database {
  constructor() {
    this.client = new pg.Client({
      connectionString: "postgres:postgres:postgres@localhost:5432/worm",
    });
  }

  newInstance() {
    console.log("new instance");
    console.log(db);
  }

  oldInstance() {
    console.log("old instance");
    console.log(db);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to the database");
    } catch {
      console.log("Connection error:", err);
    }
  }

  async query(query) {
    try {
      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error("Databse query error:", error);
    }
  }

  async close() {
    try {
      await this.client.end();
      console.log("Database connection closed");
    } catch {
      console.log("Connection error:", err);
    }
  }
}

function getInstance() {
  if (db) {
    db.oldInstance();
    return db;
  }

  db = new Database();
  db.newInstance();
  return db;
}

export { getInstance };
