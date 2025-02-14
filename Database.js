import pg from "pg";

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.con();

    Database.instance = this;
  }


  async con() {
    try {
        const database = new pg.Client({
        connectionString: "postgres://postgres:postgres@localhost:5432/worm",
        });
        await database.connect();
        console.log('test');
        console.log('Connected to the database');
    } catch {
        console.log('Connection error:', err);
    }
  }
}

const db = new Database();
Object.freeze(db);

export { db }
