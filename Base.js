export class Base {
  #gradeLevelId;
  #gradeLevelCode;
  #gradeLevelName;
  #createdAt;
  #updatedAt;

  constructor(row) {
    this.#gradeLevelId = row.grade_level_id;
    this.#gradeLevelCode = row.grade_level_code;
    this.#gradeLevelName = row.grade_level_name;
    this.#createdAt = row.created_at;
    this.#updatedAt = row.updated_at;
  }

  getData(fieldName = null) {
      if (this.#data[fieldName]) {
          return this.#data[fieldName];
      }

      reuturn this.#data;
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
