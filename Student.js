import { Base } from "./Base.js";
import { GradeLevel } from "./GradeLevel.js";
import { School } from "./School.js";
import { getInstance } from "./Database.js";

let db = getInstance();

const cachedStudentIds = {};

export class Student extends Base {
  #school;
  #gradeLevel;

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
  static async create(student) {
    try {
      const query = {
        name: "create-student",
        text: "INSERT INTO students(student_name, school_id, grade_level_id) VALUES($1, $2, $3) RETURNING *",
        values: [student.student_name, student.school_id, student.grade_level_id],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];

      return new Student(row);
    } catch (err) {
      console.error("Error creating student:", err);
    }
  }

  // TODO: abstract to base class

  static async find(studentId) {
    if (cachedStudentIds[studentId]) {
      return cachedStudentIds[studentId];
    }

    try {
      const query = {
        name: "fetch-student",
        text: "SELECT * FROM students WHERE student_id = $1",
        values: [studentId],
      };

      const res = await db.queryDb(query);

      const row = res.rows[0];

      const student = new Student(row);
      cachedStudentIds[studentId] = student;
      return student;
    } catch (err) {
      console.error("Error finding student:", err);
    }
  }

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
