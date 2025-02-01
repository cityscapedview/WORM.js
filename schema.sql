CREATE TABLE IF NOT EXISTS grade_levels (
grade_level_id serial PRIMARY KEY,
grade_level_code varchar(10) NOT NULL,
grade_level_name varchar(255) NOT NULL,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
UNIQUE(grade_level_code)
);

CREATE TABLE IF NOT EXISTS schools (
school_id serial PRIMARY KEY,
school_name varchar(255) NOT NULL,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
deleted_at timestamptz
);

CREATE TABLE school_grade_level_aff (
school_id integer NOT NULL REFERENCES schools,
grade_level_id integer NOT NULL REFERENCES grade_levels,
UNIQUE(school_id, grade_level_id)
);

CREATE TABLE IF NOT EXISTS students (
student_id serial PRIMARY KEY,
student_name varchar(255) NOT NULL,
grade_level_id integer NOT NULL REFERENCES grade_levels,
school_id integer NOT NULL REFERENCES schools,
created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
deleted_at timestamptz
);

CREATE INDEX idx_students_school_grade_level ON students (school_id,
grade_level_id)
WHERE deleted_at IS NULL;
