export class Base {
  // #gradeLevelId;
  // #gradeLevelCode;
  // #gradeLevelName;
  // #createdAt;
  // #updatedAt;
  #data;

  constructor(data) {
    // this.#gradeLevelId = data.grade_level_id;
    // this.#gradeLevelCode = data.grade_level_code;
    // this.#gradeLevelName = data.grade_level_name;
    // this.#createdAt = data.created_at;
    // this.#updatedAt = data.updated_at;
    this.#data = data;
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

