import { getInstance } from "./Database.js";

let db = getInstance();

export class Base {
  #data;

  constructor(data) {
    this.#data = data;
  }

  static async create(classData) {
    try {
      let query;

      if (this.schema.tableName == "grade_levels") {
        query = {
          name: "create-grade",
          text: `INSERT INTO ${this.schema.tableName}(grade_level_code, grade_level_name) VALUES($1, $2) RETURNING *`,
          values: [classData.grade_level_code, classData.grade_level_name],
        };
      } else if (this.schema.tableName == "schools") {
        query = {
          name: "create-school",
          text: `INSERT INTO ${this.schema.tableName}(school_name) VALUES($1) RETURNING *`,
          values: [classData.school_name],
        };
      } else if (this.schema.tableName == "students") {
        query = {
          name: "create-student",
          text: `INSERT INTO ${this.schema.tableName}(student_name, school_id, grade_level_id) VALUES($1, $2, $3) RETURNING *`,
          values: [
            classData.student_name,
            classData.school_id,
            classData.grade_level_id,
          ],
        };
        // TODO: create else error.
      }

      const res = await db.queryDb(query);

      const row = res.rows[0];

      const childClass = new this(row);

      return childClass;
    } catch (err) {
      // let's update this to a better error handling message.
      console.error("Error finding child class:", err);
    }
  }

  static async find(classData) {
    if (cachedSchoolIds[schoolId]) {
      return cachedSchoolIds[schoolId];
    }

    let query;

    try {
      // Update grade_levels query
      if (this.schema.tableName == "grade_levels") {
        query = {
          name: "create-grade",
          text: `INSERT INTO ${this.schema.tableName}(grade_level_code, grade_level_name) VALUES($1, $2) RETURNING *`,
          values: [classData.grade_level_code, classData.grade_level_name],
        };
      } else if (this.schema.tableName == "schools") {
        query = {
            name: "fetch-school",
            text: "SELECT * FROM schools WHERE school_id = $1",
            values: [classData.school_id],
          };
      // Update students query
      } else if (this.schema.tableName == "students") {
        query = {
          name: "create-student",
          text: `INSERT INTO ${this.schema.tableName}(student_name, school_id, grade_level_id) VALUES($1, $2, $3) RETURNING *`,
          values: [
            classData.student_name,
            classData.school_id,
            classData.grade_level_id,
          ],
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

  getData(fieldName = null) {
    if (fieldName in this.#data) {
      return this.#data[fieldName];
    } else if (fieldName != null && !(fieldName in this.#data)) {
      throw new Error(`Could not find field name:${fieldName}`);
    }

    return this.#data;
  }

  setData(updatedData) {
    const data = updatedData;

    for (const [key, value] of Object.entries(data)) {
      const dynamicProperty = this.#snakeToCamel(key);
      this[dynamicProperty] = value;
    }
  }

  getId() {
    let primaryKey = this.#getPrimaryKey();
    return this.getData(primaryKey);
  }

  #getPrimaryKey() {
    return this.constructor.schema.primaryKey;
  }

  #snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
  }
}
