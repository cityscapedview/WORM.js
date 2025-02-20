import pg from "pg";
import { School } from "./School.js";
import { GradeLevel } from "./GradeLevel.js";
import { Student } from "./Student.js";
import { getInstance } from "./Database.js";

let db = getInstance();

(async () => {
  await db.connection();
  // Now you got a database connection to work with

  // const res = await db.query("SELECT NOW()");

  // console.log("res");

  // test stuff

  // 1) Create School

  const school = await School.create({
    school_name: "Scout Academy",
  });

  // console.log("Below is the instantiated instance.");
  // console.log(school);

  console.log("Below is the public property.");
  console.log(school.schoolName);

  // 1) Create GradeLevel

  // const fourthGl = await GradeLevel.create({
  //   grade_level_code: "4",
  //   grade_level_name: "4th Grade",
  // });

  // console.log("Below is the instantiated instance.");
  // console.log(fourthGl);

  // console.log("Below is the public property.");
  // console.log(fourthGl.gradeLevelCode);
  // console.log(fourthGl.gradeLevelName);

  // 2) Find method

  // const school = await School.find(2);
  // console.log(school);
  // const gradeLevel = await GradeLevel.find(2);
  // const student = await Student.find(4);

  // console.log(student);

  // 1) Create Student

  //  You will have to make a getId function. maybe on base?
  //   Instantiate a school
  //   Instantiate a gradeLevel
  //

  // const student = await Student.create({
  //   student_name: "Alice",
  //   school_id: school.getId(),
  //   grade_level_id: gradeLevel.getId(),
  // });

  // console.log(student);

  // 3) Find By Grade Code.

  // const kinder = await GradeLevel.findByCode("K");

  // console.log(kinder);

  // 4) Save Method

  const schoolChosen = await School.find(1);
  console.log("school chosen!");
  console.log(schoolChosen);

  school.setData({ school_name: "AbaaaAaAak Uni" });
  console.log(school.dynamicProperty);
  // await school.save();
  // console.log(school);

  // const student = await Student.find(1);
  // student.setData({ student_name: "Alice A" });
  // student.setData({ grade_level_id: await GradeLevel.findByCode("1").getId() });
  // student.setData({ school_id: school.getId() });
  // await student.save();

  // 5) FetchAll Method

  // const tallGrades = (await GradeLevel.fetchAll());
  // console.log(tallGrades)
  // const allGrades = (await GradeLevel.fetchAll()).map((gl) => gl.grade_level_name);
  // console.log(`${allGrades.join(", ")}`);

  // 6) updateGradeLevels Method

  // const kinder = await GradeLevel.findByCode("K");
  // const first = await GradeLevel.findByCode("1");
  // await school.updateGradeLevels([kinder, first]);
  // console.log(`school after: ${school}`);
  //

  // 7) getSchool and getGradeLevel methods

  // const alice = await Student.find(4);

  // console.log(alice);

  const schoolName = (await alice.getSchool()).schoolName;
  const gl = (await alice.getGradeLevel()).gradeLevelName;

  console.log(schoolName);

  // 8) delete function.

  // const kinder = await GradeLevel.findByCode("K");
  // await kinder.delete();

  // const stu = await Student.find(3);
  // const aSchool = await stu.getSchool();
  // await stu.delete();
  // await school.delete();

  // 9) We need a way to soft delete and restore schools
  // and students via the softDelete and restore methods.

  // const stu = await Student.find(4);
  // await stu.softDelete();
  // console.log(`${stu.student_name} was soft deleted on ${stu.deleted_at}`);

  // await stu.restore();
  // console.log(`${stu.student_name} was restored. `);

  // const school = await School.find(2);
  // await school.softDelete();
  // console.log(`${school.schoolName} was soft deleted on ${school.deletedAt}`);

  // await school.restore();
  // console.log(`${school.schoolName} was restored. `);

  await db.close();
})();
