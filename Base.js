import { getinstance } from "./database.js";

let db = getinstance();

export class Base {
  #data;

  constructor(data) {
    this.#data = data;
  }

  static async create(grade) {
    try {
      // TODO: Abstract into a function for query.
      if (this.schema.tableName == "grade_levels") {
        const query = {
          name: "create-grade",
          text: "INSERT INTO this.schema.tableName(grade_level_code, grade_level_name) VALUES($1, $2) RETURNING *",
          values: [grade.grade_level_code, grade.grade_level_name],
        };
      }

      const res = await db.queryDb(query);

      const row = res.rows[0];

      console.log("below is the row:")
      console.log(row);

      const gradeLevel = new this(row);

      return gradeLevel;
    } catch (err) {
      console.error("Error finding grade level:", err);
    }
  }

  getData(fieldName = null) {
    if (this.#data[fieldName]) {
      console.log(this.#data[fieldName])
      return this.#data[fieldName];
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

  // static async find(gradeLevelId) {
    // handle caching later
    //
    // if (cachedGradeLevelIds[gradeLevelId]) {
    //   return cachedGradeLevelIds[gradeLevelId];
    // }

  //   try {
  //     const query = {
  //       name: "fetch-grade-level",
  //       text: "SELECT * FROM grade_levels WHERE grade_level_id = $1",
  //       values: [gradeLevelId],
  //     };

  //     const res = await db.queryDb(query);

  //     const row = res.rows[0];
  //     const gradeLevel = new GradeLevel(row);
  //     cachedGradeLevelIds[gradeLevelId] = gradeLevel;
  //     return gradeLevel;
  //   } catch (err) {
  //     console.error("Error finding grade level:", err);
  //   }
  // }

  #snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
  }
}

