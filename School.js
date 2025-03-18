import { Base } from "./Base.js";
import { getInstance } from "./Database.js";

let db = getInstance();

export class School extends Base {
  static schema = {
    tableName: "schools",
    primaryKey: "school_id",
    columns: {
      school_id: { usePostgresDefault: true },
      school_name: {},
      created_at: { usePostgresDefault: true },
      updated_at: { usePostgresDefault: true },
      deleted_at: {},
    },
  };

 // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  // async save() {
  //   try {
  //     const query = {
  //       name: "save-school",
  //       text: `
  //       INSERT INTO schools (school_id, school_name, updated_at)
  //       VALUES ($1, $2, NOW())
  //       ON CONFLICT (school_id)
  //       DO UPDATE SET
  //         school_name = EXCLUDED.school_name,
  //         updated_at = NOW()
  //       RETURNING *;
  //     `,
  //       values: [this.schoolId, this.schoolName],
  //     };
  //
  //     const res = await db.queryDb(query);
  //     console.log("Save Successful:", res.rows[0]);
  //   } catch (err) {
  //     console.error("Error during upsert:", err);
  //   }
  // }

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
