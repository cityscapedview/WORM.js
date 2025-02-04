import { Base } from "./Base.js";

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
  static async create(db, grade) {
    try {
      const text =
        "INSERT INTO grade_levels(grade_level_code, grade_level_name) VALUES($1, $2) RETURNING *";
      const values = [grade.grade_level_code, grade.grade_level_name];

      const res = await db.query(text, values);

      const row = res.rows[0];

      const gradeLevel = new GradeLevel(row);

      return gradeLevel;
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  // TODO: abstract to base class
  static async find(db, gradeLevelId) {
    try {
      const query = {
        name: "fetch-grade-level",
        text: "SELECT * FROM grade_levels WHERE grade_level_id = $1",
        values: [gradeLevelId],
      };

      const res = await db.query(query);

      const row = res.rows[0];

      return new GradeLevel(row);
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  // TODO: DRY this code with find
  static async findByCode(db, gradeLevelCode) {
    try {
      const query = {
        name: "fetch-by-grade-code",
        text: "SELECT * FROM grade_levels WHERE grade_level_code = $1",
        values: [gradeLevelCode],
      };

      const res = await db.query(query);

      const row = res.rows[0];

      return new GradeLevel(row);
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each grade level and return that? or is this ok?
  static async fetchAll(db) {
    try {
      const res = await db.query("SELECT * FROM grade_levels");

      return res.rows;
    } catch (err) {
      console.error("error finding grade levels:", err);
    }
  }

  // TODO: abstract to base class
  getId() {
    return this.gradeLevelId;
  }

  // TODO: implement contstructor
  // TODO: implement get methods
  // TODO: make variables public (based on zach's prompt)
  // TODO: Read about classes in node and JS in MDN
  // TODO: How do classes differ in php and js, how does async await help classes?
  // TODO: Node has concurrency, if you try to do 4 inserts at the same time and didn't do async await, what would happen?
  // TODO: Note that postgres can only handle one query at a time.  Understand concurrent languages like node and postgres that can only have one connection at a time.
  // TODO: Connections vs pools.
}
