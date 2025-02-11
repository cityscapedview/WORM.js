import { Base } from "./Base.js";
import { GradeLevel } from "./GradeLevel.js";

export class Student extends Base {
  constructor(row) {
    super();
    this.studentId = row.student_id;
    this.studentName = row.student_name;
    this.gradeLevelId = row.grade_level_id;
    this.schoolId = row.school_id;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
    this.deletedAt = row.deleted_at;
  }

  // TODO: Let's abstract the values from the incoming object so it is clean code.
  static async create(db, student) {
    try {
      const text =
        "INSERT INTO students(student_name, school_id, grade_level_id) VALUES($1, $2, $3) RETURNING *";
      const values = [
        student.student_name,
        student.school_id,
        student.grade_level_id,
      ];

      const res = await db.query(text, values);

      const row = res.rows[0];

      return new Student(row);
    } catch (err) {
      console.error("Error creating student:", err);
    }
  }

  // TODO: abstract to base class
  static async find(db, studentId) {
    try {
      const query = {
        name: "fetch-student",
        text: "SELECT * FROM students WHERE student_id = $1",
        values: [studentId],
      };

      const res = await db.query(query);

      const row = res.rows[0];

      return new Student(row);
    } catch (err) {
      console.error("Error finding student:", err);
    }
  }

  // TODO: abstract to base?
  // Question: should this instantiate an instance of each student and return that? or is this ok?
  static async fetchAll(db) {
    try {
      const res = await db.query("SELECT * FROM students");

      return res.rows;
    } catch (err) {
      console.error("error finding students:", err);
    }
  }

  // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  async save(db) {
    try {
      const text = `
        INSERT INTO students(student_id, student_name, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
          school_name = EXCLUDED.student_name,
          updated_at = NOW()
        RETURNING *;
      `;

      const values = [this.studentId, this.studentName];
      const res = await db.query(text, values);
      console.log("Save Successful:", res.rows[0]);
    } catch (err) {
      console.error("Error during upsert:", err);
    }
  }

  // TODO: DRY this code with find
  async getGradeLevel(db) {
    try {
      const query = {
        name: "fetch-by-grade-level-id",
        text: "SELECT * FROM grade_levels WHERE grade_level_id = $1",
        values: [this.gradeLevelId],
      };

      const res = await db.query(query);

      const row = res.rows[0];

      return new GradeLevel(row);
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }
}
