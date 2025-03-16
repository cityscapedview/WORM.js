import { Base } from "./Base.js";
import { GradeLevel } from "./GradeLevel.js";
import { School } from "./School.js";
import { getInstance } from "./Database.js";

let db = getInstance();

export class Student extends Base {
  #school;
  #gradeLevel;

  static schema = {
    tableName: "students",
    primaryKey: "student_id",
    columns: {
      student_id: { usePostgresDefault: true },
      student_name: {},
      grade_level_id: {},
      school_id: {},
      created_at: { usePostgresDefault: true },
      updated_at: { usePostgresDefault: true },
      deleted_at: {},
    },
  };

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each student and return that? or is this ok?
  static async fetchAll() {
    try {
      const query = {
        name: "fetch-all-students",
        text: "SELECT * FROM schools",
      };
      const res = await db.queryDb(query);

      return res.rows;
    } catch (err) {
      console.error("error finding students:", err);
    }
  }

  // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  async save() {
    try {
      const query = {
        name: "save-student",
        text: `
        INSERT INTO students(student_id, student_name, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
          student_name = EXCLUDED.student_name,
          updated_at = NOW()
        RETURNING *;
      `,
        values: [this.studentId, this.studentName],
      };

      const res = await db.queryDb(query);
      console.log("Save Successful:", res.rows[0]);
    } catch (err) {
      console.error("Error during upsert:", err);
    }
  }

  async getGradeLevel(db) {
    if (this.#gradeLevel) {
      return this.#gradeLevel;
    }

    this.#gradeLevel = await GradeLevel.find(this.gradeLevelId);
    return this.#gradeLevel;
  }

  async getSchool() {
    return await School.find(this.schoolId);

    if (this.#school) {
      return this.#school;
    }

    this.#school = await School.find(this.schoolId);
    return this.#school;
  }

  // TODO: abstract to base class and DRY
  async delete() {
    try {
      const query = {
        name: "delete-students",
        text: "DELETE FROM students WHERE student_id = $1",
        values: [this.studentId],
      };
      const res = await db.queryDb(query);
      console.log("Deleted student rows successfully:", res.rowCount);
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  async softDelete() {
    try {
      const query = {
        name: "soft-delete-students",
        text: `
        UPDATE students
        SET deleted_at = NOW()
        WHERE student_id = $1 AND deleted_at IS NULL
        RETURNING *;
      `,
        values: [this.studentId],
      };
      const res = await db.queryDb(query);
      if (res.rowCount > 0) {
        console.log("User soft deleted:", res.rows[0]);
      } else {
        console.log("User not found or already deleted");
      }
    } catch (err) {
      console.error("Error soft deleting user:", err);
    }
  }

  async restore() {
    try {
      const query = {
        name: "restore-soft-deleted-students",
        text: `
        UPDATE students
        SET deleted_at = NULL
        WHERE student_id = $1 AND deleted_at IS NOT NULL
        RETURNING *;
      `,
        values: [this.studentId],
      };

      const res = await db.queryDb(query);
      if (res.rowCount > 0) {
        console.log("User restored:", res.rows[0]);
      } else {
        console.log("User not found or not deleted");
      }
    } catch (err) {
      console.error("Error restoring user:", err);
    }
  }
}
