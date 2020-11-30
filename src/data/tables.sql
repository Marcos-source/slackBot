CREATE TYPE "student_status" AS ENUM (
  'regular',
  'migration',
  'gone',
  'graduated'
);

CREATE TYPE "external_services" AS ENUM (
  'github'
);

CREATE TYPE "team_status" AS ENUM (
  'regular',
  'migration',
  'gone'
);


-- table migrated to sequelize
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar(60) NOT NULL,
  "last_name" varchar(60) NOT NULL,
  "dni" integer UNIQUE NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "date_of_birth" date NOT NULL,
  "region" varchar(110),
  "address" varchar(110),
  "telephone" varchar(110),
  "external_account" int UNIQUE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "externalaccounts" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(50),
  "service_name" external_services DEFAULT 'github',
  "token" varchar(50),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "peerfeedbacks" (
  "id" SERIAL PRIMARY KEY,
  "team" int NOT NULL,
  "rater" int NOT NULL,
  "rated" int NOT NULL,
  "tech_rating" int NOT NULL,
  "soft_rating" int NOT NULL,
  "social_rating" int NOT NULL,
  "notes" varchar(280)
);

CREATE TABLE IF NOT EXISTS "students" (
  "id" SERIAL PRIMARY KEY,
  "user" int UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "pms" (
  "id" SERIAL PRIMARY KEY,
  "user" int UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "instructors" (
  "id" SERIAL PRIMARY KEY,
  "user" int UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cohorts" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid UNIQUE NOT NULL,
  "start_date" date NOT NULL,
  "instructor" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "studentsxcohorts" (
  "id" SERIAL PRIMARY KEY,
  "student" int UNIQUE NOT NULL,
  "cohort" int NOT NULL,
  "pm" int NOT NULL,
  "status" student_status DEFAULT 'regular'
);

CREATE TABLE IF NOT EXISTS "teams" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid NOT NULL,
  "status" team_status DEFAULT 'regular',
  "week" int NOT NULL,
  "module" int
);

CREATE TABLE IF NOT EXISTS "courses" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid NOT NULL,
  "name" varchar(50) NOT NULL,
  "description" varchar(180) NOT NULL,
  "duration" int NOT NULL,
  "cohort" int UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "phases" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid NOT NULL,
  "name" varchar(50) NOT NULL,
  "description" varchar(180) NOT NULL,
  "course" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "modules" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid NOT NULL,
  "name" varchar(50) NOT NULL,
  "repo" varchar NOT NULL,
  "phase" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "checkpoints" (
  "id" SERIAL PRIMARY KEY,
  "description" varchar(180) NOT NULL,
  "module" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "studentsxcheckpoints" (
  "id" SERIAL PRIMARY KEY,
  "date" date NOT NULL,
  "score" int NOT NULL,
  "checkpoint" int NOT NULL,
  "student" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "classes" (
  "id" SERIAL PRIMARY KEY,
  "order" int NOT NULL,
  "slug" uuid NOT NULL,
  "name" varchar(50) NOT NULL,
  "description" varchar(180) NOT NULL,
  "content" text,
  "homework" text,
  "repo" varchar NOT NULL,
  "quiz_link" varchar NOT NULL,
  "feedback_link" varchar NOT NULL,
  "video_link" varchar NOT NULL,
  "module" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "resources" (
  "id" SERIAL PRIMARY KEY,
  "slug" uuid NOT NULL,
  "name" varchar(50) NOT NULL,
  "description" varchar(180) NOT NULL,
  "link" varchar,
  "module" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "studentsxteams" (
  "id" SERIAL PRIMARY KEY,
  "student" int,
  "team" int
);

ALTER TABLE "users" ADD FOREIGN KEY ("external_account") REFERENCES "externalaccounts" ("id");

ALTER TABLE "students" ADD FOREIGN KEY ("user") REFERENCES "users" ("id");

ALTER TABLE "pms" ADD FOREIGN KEY ("user") REFERENCES "users" ("id");

ALTER TABLE "instructors" ADD FOREIGN KEY ("user") REFERENCES "users" ("id");

ALTER TABLE "studentsxcohorts" ADD FOREIGN KEY ("student") REFERENCES "students" ("id");

ALTER TABLE "studentsxcohorts" ADD FOREIGN KEY ("cohort") REFERENCES "cohorts" ("id");

ALTER TABLE "cohorts" ADD FOREIGN KEY ("instructor") REFERENCES "instructors" ("id");

ALTER TABLE "studentsxcohorts" ADD FOREIGN KEY ("pm") REFERENCES "pms" ("id");

ALTER TABLE "studentsxteams" ADD FOREIGN KEY ("student") REFERENCES "students" ("id");

ALTER TABLE "studentsxteams" ADD FOREIGN KEY ("team") REFERENCES "teams" ("id");

ALTER TABLE "resources" ADD FOREIGN KEY ("module") REFERENCES "modules" ("id");

ALTER TABLE "classes" ADD FOREIGN KEY ("module") REFERENCES "modules" ("id");

ALTER TABLE "modules" ADD FOREIGN KEY ("phase") REFERENCES "phases" ("id");

ALTER TABLE "cohorts" ADD FOREIGN KEY ("id") REFERENCES "courses" ("cohort");

ALTER TABLE "phases" ADD FOREIGN KEY ("course") REFERENCES "courses" ("id");

ALTER TABLE "checkpoints" ADD FOREIGN KEY ("module") REFERENCES "modules" ("id");

ALTER TABLE "studentsxcheckpoints" ADD FOREIGN KEY ("checkpoint") REFERENCES "checkpoints" ("id");

ALTER TABLE "studentsxcheckpoints" ADD FOREIGN KEY ("student") REFERENCES "students" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("module") REFERENCES "modules" ("id");

ALTER TABLE "peerfeedbacks" ADD FOREIGN KEY ("rater") REFERENCES "users" ("id");

ALTER TABLE "peerfeedbacks" ADD FOREIGN KEY ("rated") REFERENCES "users" ("id");

ALTER TABLE "peerfeedbacks" ADD FOREIGN KEY ("team") REFERENCES "teams" ("id");
