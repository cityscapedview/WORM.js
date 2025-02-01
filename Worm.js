import pg from "pg";
import { School } from "./School.js";
import { GradeLevel } from "./GradeLevel.js";
import { Student } from "./Student.js";

(async () => {
  const db = new pg.Client({
    connectionString: "postgres://postgres:postgres@localhost:5432/worm",
  });
  await db.connect();

  // Now you got a database connection to work with

  // const res = await db.query("SELECT NOW()");

  // console.log("res");

  // test stuff

  // 1) Create School

  // const school = await School.create(db, {
  //   school_name: "Turtle Academy",
  // });

  // console.log("Below is the instantiated instance.");
  // console.log(school);

  // console.log("Below is the public property.");
  // console.log(school.schoolName);

  // 1) Create GradeLevel

  // const fourthGl = await GradeLevel.create(db, {
  //   grade_level_code: "4",
  //   grade_level_name: "4th Grade",
  // });

  // console.log("Below is the instantiated instance.");
  // console.log(fourthGl);

  // console.log("Below is the public property.");
  // console.log(fourthGl.gradeLevelCode);
  // console.log(fourthGl.gradeLevelName);

  // 2) Find method

  // const school = await School.find(db, 1);
  // const gradeLevel = await GradeLevel.find(db, 1);
  // const student = await Student.find(db, 4);

  // console.log(student);

  // 1) Create Student

  //  You will have to make a getId function. maybe on base?
  //   Instantiate a school
  //   Instantiate a gradeLevel
  //

  // const student = await Student.create(db, {
  //   student_name: "Alice",
  //   school_id: school.getId(),
  //   grade_level_id: gradeLevel.getId(),
  // });

  // console.log(student);

  // 3) Find By Grade Code.

  // const kinder = await GradeLevel.findByCode(db, "K");

  // console.log(kinder);

  // 4) Save Method

  const school = await School.find(db, 1);
  school.setData({ school_name: "AbaaaAaAak Uni" });
  // console.log(school.dynamicProperty);
  await school.save(db);
  console.log(school);

  // const student = await Student.find(1);
  // student.setData({ student_name: "Alice A" });
  // student.setData({ grade_level_id: await GradeLevel.findByCode("1").getId() });
  // student.setData({ school_id: school.getId() });
  // await student.save();

  await db.end();
})();
