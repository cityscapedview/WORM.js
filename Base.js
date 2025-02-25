export class Base {
  #gradeLevelId;
  #gradeLevelCode;
  #gradeLevelName;
  #createdAt;
  #updatedAt;
  #data;

  constructor(data) {
    this.#gradeLevelId = data.grade_level_id;
    this.#gradeLevelCode = data.grade_level_code;
    this.#gradeLevelName = data.grade_level_name;
    this.#createdAt = data.created_at;
    this.#updatedAt = data.updated_at;
    this.#data = data;
  }

  getData(fieldName = null) {
    if (this.#data[fieldName]) {
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

  #snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
  }
}

// class Base {
//     #data;
//     constructor(data) {
//         this.#data = data;
//     }

//     getData(fieldName = null) {
//         if (this.#data[fieldName]) {
//             return this.#data[fieldName];
//         }

//         reuturn this.#data;
//     }
// }

// class School extends Base {

// }

// const s = new School({ schoolId: "1234", wobbles: true });
// s.getData("schoolId") -> 1234
// s.getData("wobbles") -> true
