/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";
import type { IPostgresInterval } from "postgres-interval";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type GroupStatus = "ACTIVE" | "CANCELED" | "FINISHED" | "PLANNED";

export type Interval = ColumnType<IPostgresInterval, IPostgresInterval | number | string>;

export type LessonStatus = "CANCELED" | "DONE" | "PLANNED";

export type Timestamp = ColumnType<Date | string>;

export type UserRole = "ADMIN" | "STUDENT" | "TEACHER";

export interface Courses {
  course_duration: Interval;
  id: Generated<number>;
  lesson_duration: Interval;
  title: string;
}

export interface Groups {
  course_id: number;
  id: Generated<number>;
  status: Generated<GroupStatus>;
  teacher_id: number;
  title: string;
}

export interface Lessons {
  end_time: Timestamp;
  group_id: number;
  id: Generated<number>;
  room_id: number;
  start_time: Timestamp;
  status: Generated<LessonStatus>;
  teacher_id: number;
  title: string;
}

export interface Rooms {
  id: Generated<number>;
  title: string;
}

export interface Students {
  id: number;
}

export interface StudentsOnLessons {
  lesson_id: number;
  participated: Generated<boolean>;
  student_id: number;
}

export interface Teachers {
  id: number;
}

export interface Users {
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  name: string;
  password: string;
  role: Generated<UserRole>;
  username: string;
}

export interface DB {
  courses: Courses;
  groups: Groups;
  lessons: Lessons;
  rooms: Rooms;
  students: Students;
  students_on_lessons: StudentsOnLessons;
  teachers: Teachers;
  users: Users;
}