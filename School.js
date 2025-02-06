import { Base } from "./Base.js";

export class School extends Base {
  constructor(row) {
    super();
    this.schoolId = row.school_id;
    this.schoolName = row.school_name;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
    this.deletedAt = row.deleted_at;
  }

  static async create(db, school) {
    // TODO: Let's abstract the values from the incoming object so it is clean code.
    try {
      const text = "INSERT INTO schools(school_name) VALUES($1) RETURNING *";
      const values = [school.school_name];

      const res = await db.query(text, values);

      const row = res.rows[0];

      const schoolInstances = new School(row);

      return schoolInstances;
    } catch (err) {
      console.error("Error creating school:", err);
    }
  }

  // TODO: abstract to base class
  static async find(db, schoolId) {
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
  static async fetchAll(db) {
    try {
      const res = await db.query("SELECT * FROM schools");

      return res.rows;
    } catch (err) {
      console.error("error finding schools:", err);
    }
  }

  // TODO: abstract to base if possible
  // Different classes might need to change different values, could be a challenge.
  async save(db) {
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

  async updateGradeLevels(db, gradeLevels) {
    try {
      const updatedGradeLevels = gradeLevels.map(gl => gl.gradeLevelId);
        const query = {
          name: "update-grade-level",
          text:  `
            INSERT INTO school_grade_level_aff (school_id, grade_level_id)
            VALUES ($1, $2)
            ON CONFLICT (school_id)
            DO UPDATE SET
              school_id = EXCLUDED.school_id,
              grade_level_id = $2,
            RETURNING *;
          `,
          values: [this.schoolId, updatedGradeLevels],
        };
        const res = await db.query(query);
        console.log("Updated grade level affiliation successfully:", res.rows[0]);
    } catch (err) {
      console.error("Error updating grade levels:", err);
    }
  }

  // TODO: abstract to base class
  getId() {
    return this.schoolId;
  }
}
