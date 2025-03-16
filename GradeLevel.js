import { Base } from "./Base.js";
import { getInstance } from "./Database.js";

let db = getInstance();

export class GradeLevel extends Base {
  static schema = {
    tableName: "grade_levels",
    primaryKey: "grade_level_id",
    columns: {
      grade_level_id: { usePostgresDefault: true },
      grade_level_code: {},
      grade_level_name: {},
      updated_at: { usePostgresDefault: true },
      created_at: { usePostgresDefault: true },
    },
  };

  // TODO: DRY this code with find
  static async findByCode(gradeLevelCode) {
    try {
      const query = {
        name: "fetch-by-grade-code",
        text: "SELECT * FROM grade_levels WHERE grade_level_code = $1",
        values: [gradeLevelCode],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];

      return new GradeLevel(row);
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each grade level and return that? or is this ok?
  static async fetchAll() {
    try {
      const query = {
        name: "fetch-all-gradelevels",
        text: "SELECT * FROM grade_levels",
      };
      const res = await db.queryDb(query);

      return res.rows;
    } catch (err) {
      console.error("error finding grade levels:", err);
    }
  }

  // TODO: abstract to base class and DRY
  async delete() {
    try {
      this.#deleteGradeLevelAff();

      const query = {
        name: "fetch-by-grade-code",
        text: "DELETE FROM grade_levels WHERE grade_level_id = $1",
        values: [this.gradeLevelId],
      };

      const res = await db.queryDb(query);
      console.log("Deleted grade level rows successfully:", res.rowCount);
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }

  async #deleteGradeLevelAff() {
    try {
      const query = {
        name: "fetch-by-grade-code",
        text: "DELETE FROM school_grade_level_aff WHERE grade_level_id = $1",
        values: [this.gradeLevelId],
      };
      const res = await db.queryDb(query);
      console.log(
        "Deleted grade level affiliate rows successfully:",
        res.rowCount,
      );
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }
}
