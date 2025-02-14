import { Base } from "./Base.js";
import { getInstance } from "./Database.js";

let db = getInstance();

export class School extends Base {
  constructor(row) {
    super();
    this.schoolId = row.school_id;
    this.schoolName = row.school_name;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
    this.deletedAt = row.deleted_at;
  }

  static async create(school) {
    // TODO: Let's abstract the values from the incoming object so it is clean code.

    try {
      db.connect();
      // console.log(getInstance());
      // console.log("inside");
      // console.log(db);

      const query = {
        name: "create-school",
        text: "INSERT INTO schools(school_name) VALUES($1) RETURNING *",
        values: [this.school_name],
      };
      // const text = "INSERT INTO schools(school_name) VALUES($1) RETURNING *";
      // const values = [school.school_name];

      const res = await db.query(query);

      const row = res.rows[0];

      const schoolInstances = new School(row);

      return schoolInstances;
      // won't run after return.
      db.close();
    } catch (err) {
      console.error("Error creating school:", err);
    }
  }

  // TODO: abstract to base class
  static async find(schoolId) {
    try {
      const query = {
        name: "fetch-school",
        text: "SELECT * FROM schools WHERE school_id = $1",
        values: [schoolId],
      };

      const res = await db.query(query);

      const row = res.rows[0];

      return new School(row);
    } catch (err) {
      console.error("Error finding school:", err);
    }
  }

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each school and return that? or is this ok?
  static async fetchAll() {
    try {
      const res = await db.query("SELECT * FROM schools");

      return res.rows;
    } catch (err) {
      console.error("error finding schools:", err);
    }
  }

  // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  async save() {
    try {
      const text = `
        INSERT INTO schools (school_id, school_name, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (school_id)
        DO UPDATE SET
          school_name = EXCLUDED.school_name,
          updated_at = NOW()
        RETURNING *;
      `;

      const values = [this.schoolId, this.schoolName];
      const res = await db.query(text, values);
      console.log("Save Successful:", res.rows[0]);
    } catch (err) {
      console.error("Error during upsert:", err);
    }
  }

  async updateGradeLevels(gradeLevels) {
    try {
      // look up promises water falling.
      // Really understand why you can't use map and for each.

      // Look up 'bluebird' promise waterfalling.
      //
      // Use a for loop to iterate through, but understand why.  Also you can recursion.
      //
      // be careful on insert on conflict because you can run into instances like: (check discord)

      // delete the existing rows first.

      // delete all the values for the school first.

      this.#deleteRow();

      for (let i = 0; i < gradeLevels.length; i++) {
        const query = {
          name: "update-grade-level",
          text: `INSERT INTO school_grade_level_aff (school_id, grade_level_id) VALUES ($1, $2)`,
          values: [this.schoolId, gradeLevels[i].gradeLevelId],
        };
        const res = await db.query(query);
        console.log(
          "Updated grade level affiliation successfully:",
          res.rowCount,
        );
      }

      await this.save(db);
    } catch (err) {
      console.error("Error updating grade levels:", err);
    }
  }

  // TODO: abstract to base class
  getId() {
    return this.schoolId;
  }

  // TODO: abstract to base class and DRY
  async delete() {
    try {
      this.#deleteRow(db);
      this.#deleteStudentRow(db);

      const query = "DELETE FROM schools WHERE school_id = $1";
      const values = [this.schoolId];
      const res = await db.query(query, values);
      console.log("Deleted school rows successfully:", res.rowCount);
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  async #deleteRow() {
    try {
      const query = "DELETE FROM school_grade_level_aff WHERE school_id = $1";
      const values = [this.schoolId];
      const res = await db.query(query, values);
      console.log(
        "Deleted grade level affiliation rows successfully:",
        res.rowCount,
      );
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  // Ask Zach if the intention is to delete all the students in the school?
  async #deleteStudentRow() {
    try {
      const query = "DELETE FROM students WHERE school_id = $1";
      const values = [this.schoolId];
      const res = await db.query(query, values);
      console.log(
        "Deleted student row affiliated with school successfully:",
        res.rowCount,
      );
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  async softDelete() {
    try {
      const query = `
        UPDATE schools
        SET deleted_at = NOW()
        WHERE school_id = $1 AND deleted_at IS NULL
        RETURNING *;
      `;
      const values = [this.schoolId];
      const res = await db.query(query, values);
      if (res.rowCount > 0) {
        console.log("School soft deleted:", res.rows[0]);
      } else {
        console.log("School not found or already deleted");
      }
    } catch (err) {
      console.error("Error soft deleting school:", err);
    }
  }

  async restore() {
    try {
      const query = `
        UPDATE schools
        SET deleted_at = NULL
        WHERE school_id = $1 AND deleted_at IS NOT NULL
        RETURNING *;
      `;
      const values = [this.schoolId];
      const res = await db.query(query, values);
      if (res.rowCount > 0) {
        console.log("School restored:", res.rows[0]);
      } else {
        console.log("School not found or not deleted");
      }
    } catch (err) {
      console.error("Error restoring school:", err);
    }
  }
}
