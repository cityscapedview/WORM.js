import pg from "pg";
import { School } from "./School.js";
import { GradeLevel } from "./GradeLevel.js";
import { Student } from "./Student.js";
import { getInstance } from "./Database.js";

let db = getInstance();

(async () => {
  await db.connection();

  // await db.queryDb("BEGIN;");


  // 1) Create School

  // const school = await School.create({
  //   school_name: "Scout Academy",
  // });
  // //
  // console.log("Below is the instantiated instance.");
  // console.log(school.getData());

  // console.log("Below is the public property.");
  // console.log(school.getData("school_name"));

  // 1) Create GradeLevel

  // const gradeLevel = await GradeLevel.create({
  //   grade_level_code: "1",
  //   grade_level_name: "first",
  // });
  // //
  // console.log("Below is the instantiated instance.");
  // console.log(gradeLevel.getData());

  // console.log("Below is the public property.");
  // try {
  //   console.log(eighthGl.getData("grade_leve_code"));
  // } catch (err) {
  //   console.error("abeeek:", err);
  // }

  // console.log({ grade_level_name: eighthGl.getData("grade_level_name") });

  // 1) Create Student

  //  You will have to make a getId function. maybe on base?
  //   Instantiate a school
  //   Instantiate a gradeLevel
  //
  // console.log("get id:");
  // console.log(school.getId());

  // const student = await Student.create({
  //   student_name: "Magic Tookie",
  //   school_id: school.getId(),
  //   grade_level_id: gradeLevel.getId(),
  // });

  // console.log(student.getData());

  // 2) Find method

  // const getSchool = await School.find(1);
  // console.log(getSchool);
  //
  // const gradeLevel = await GradeLevel.find(1);
  // console.log(gradeLevel);
  //
  // const studentTest = await Student.find(1);
  // console.log(studentTest);

  // 3) Find By Grade Code.

  // const kinder = await GradeLevel.findByCode("6");

  // console.log(kinder);

  // 4) Save Method

  const schoolChosen = await School.find(44);
  console.log("school chosen!");
  console.log(schoolChosen);
  // console.log(schoolChosen.getData());

  schoolChosen.setData({ school_name: "Tookerbacker Uni" });

  await schoolChosen.save();
  console.log("shool after save:");
  console.log(schoolChosen);

  // const student = await Student.find(14);
  // console.log(student);

  // const school = await School.find(1);
  // console.log(school);

  // const gradeLevel = (await GradeLevel.findByCode("6")).getId();
  // console.log(gradeLevel);

  // TODO: Resolve grade_level_id error
  // student.setData({ student_name: "Sadie Lady" });
  // student.setData({ grade_level_id: gradeLevel });
  // student.setData({ school_id: school.getId() });
  // await student.save();
  // console.log(student);

  // 5) FetchAll Method

  // const tallGrades = (await GradeLevel.fetchAll());
  // console.log("all grades:");
  // console.log(tallGrades);
  // const allGrades = (await GradeLevel.fetchAll()).map((gl) => gl.grade_level_name);
  // console.log(`${allGrades.join(", ")}`);

  // 6) updateGradeLevels Method

  // const school = await School.find(1);
  // console.log(school);

  // const kinder = await GradeLevel.findByCode("6");
  // const first = await GradeLevel.findByCode("3");
  // await school.updateGradeLevels([kinder, first]);
  // console.log(`school after `);
  // console.log(school);

  // TODO print gradeLevel association
  //

  // 7) getSchool and getGradeLevel methods

  // const alice = await Student.find(14);

  // console.log(alice);

  // const schoolName = (await alice.getSchool()).schoolName;
  // console.log(schoolName);

  // const gl = (await alice.getGradeLevel()).gradeLevelName;
  // console.log(gl);

  // 8) delete function.

  // const kinder = await GradeLevel.findByCode("K");
  // await kinder.delete();

  // const stu = await Student.find(3);
  // const aSchool = await stu.getSchool();
  // await stu.delete();
  // await school.delete();

  // 9) We need a way to soft delete and restore schools
  // and students via the softDelete and restore methods.

  // const stu = await Student.find(14);
  // await stu.softDelete();
  // TODO: deletedAt won't print
  // console.log(`${stu.studentName} was soft deleted on ${stu.deletedAt}`);

  // await stu.restore();
  // console.log(`${stu.studentName} was restored. `);

  // const school = await School.find(3);
  // await school.softDelete();
  // console.log(`${school.schoolName} was soft deleted on ${school.deletedAt}`);

  // await school.restore();
  // console.log(`${school.schoolName} was restored. `);

  // await db.queryDb("ROLLBACK;");
  await db.close();
})();
