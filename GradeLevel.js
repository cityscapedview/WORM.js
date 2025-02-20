import { Base } from "./Base.js";
import { getInstance } from "./Database.js";

let db = getInstance();

export class GradeLevel extends Base {
  constructor(row) {
    super();
    this.gradeLevelId = row.grade_level_id;
    this.gradeLevelCode = row.grade_level_code;
    this.gradeLevelName = row.grade_level_name;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  // TODO: Let's abstract the values from the incoming object so it is clean code.
  static async create(grade) {
    try {
      const query = {
        name: "create-grade",
        text: "INSERT INTO grade_levels(grade_level_code, grade_level_name) VALUES($1, $2) RETURNING *",
        values: [grade.grade_level_code, grade.grade_level_name],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];

      const gradeLevel = new GradeLevel(row);

      return gradeLevel;
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  // TODO: abstract to base class
  static async find(gradeLevelId) {
    try {
      const query = {
        name: "fetch-grade-level",
        text: "SELECT * FROM grade_levels WHERE grade_level_id = $1",
        values: [gradeLevelId],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];

      return new GradeLevel(row);
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

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

  // TODO: abstract to base class
  getId() {
    return this.gradeLevelId;
  }

  async #deleteGradeLevelAff() {
    try {
      const query = {
        name: "fetch-by-grade-code",
        text: "DELETE FROM school_grade_level_aff WHERE grade_level_id = $1",
        values: [this.gradeLevelId],
      };
      const res = await db.queryDb(query);
      console.log("Deleted grade level affiliate rows successfully:", res.rowCount);
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  }
}
