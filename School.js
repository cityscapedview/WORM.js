import { Base } from "./Base.js";
import { getInstance } from "./Database.js";

let db = getInstance();

const cachedSchoolIds = {};

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
      const query = {
        name: "create-school",
        text: "INSERT INTO schools(school_name) VALUES($1) RETURNING *",
        values: [school.school_name],
      };
      const res = await db.queryDb(query);

      const row = res.rows[0];

      const schoolInstances = new School(row);

      return schoolInstances;
    } catch (err) {
      console.error("Error creating school:", err);
    }
  }

  // TODO: abstract to base class
  static async find(db) {
    if (cachedSchoolIds[schoolId]) {
      return cachedSchoolIds[schoolId];
    }

    try {
      const query = {
        name: "fetch-school",
        text: "SELECT * FROM schools WHERE school_id = $1",
        values: [schoolId],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];
      const school = new School(row);
      cachedSchoolIds[schoolId] = school;
      return school;
    } catch (err) {
      console.error("Error finding school:", err);
    }
  }

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each school and return that? or is this ok?
  static async fetchAll() {
    try {
      const query = {
        name: "fetch-all-schools",
        text: "SELECT * FROM schools",
      };
      const res = await db.queryDb(query);

      return res.rows;
    } catch (err) {
      console.error("error finding schools:", err);
    }
  }

  // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  async save() {
    try {
      const query = {
        name: "save-school",
        text: `
        INSERT INTO schools (school_id, school_name, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (school_id)
        DO UPDATE SET
          school_name = EXCLUDED.school_name,
          updated_at = NOW()
        RETURNING *;
      `,
        values: [this.schoolId, this.schoolName],
      };

      const res = await db.queryDb(query);
      console.log("Save Successful:", res.rows[0]);
    } catch (err) {
      console.error("Error during upsert:", err);
    }
  }

  async updateGradeLevels(gradeLevels) {
    try {
      this.#deleteRow();

      for (let i = 0; i < gradeLevels.length; i++) {
        const query = {
          name: "update-grade-level",
          text: `INSERT INTO school_grade_level_aff (school_id, grade_level_id) VALUES ($1, $2)`,
          values: [this.schoolId, gradeLevels[i].gradeLevelId],
        };
        const res = await db.queryDb(query);
        console.log(
          "Updated grade level affiliation successfully:",
          res.rowCount,
        );
      }

      await this.save();
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
      this.#deleteRow();
      this.#deleteStudentRow();

      const query = {
        name: "delete-school",
        text: "DELETE FROM schools WHERE school_id = $1",
        values: [this.schoolId],
      };
      const res = await db.queryDb(query);
      console.log("Deleted school rows successfully:", res.rowCount);
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  async #deleteRow() {
    try {
      const query = {
        name: "delete-school-row",
        text: "DELETE FROM school_grade_level_aff WHERE school_id = $1",
        values: [this.schoolId],
      };
      const res = await db.queryDb(query);
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
      const query = {
        name: "delete-student-row",
        text: "DELETE FROM students WHERE school_id = $1",
        values: [this.schoolId],
      };
      const res = await db.queryDb(query);
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
      const query = {
        name: "soft-delete-school",
        text: `
            UPDATE schools
            SET deleted_at = NOW()
            WHERE school_id = $1 AND deleted_at IS NULL
            RETURNING *;
          `,
        values: [this.schoolId],
      };
      const res = await db.queryDb(query);
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
      const query = {
        name: "restore-soft-deleted-school",
        text: `
            UPDATE schools
            SET deleted_at = NULL
            WHERE school_id = $1 AND deleted_at IS NOT NULL
            RETURNING *;
          `,
        values: [this.schoolId],
      };
      const res = await db.queryDb(query);
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
