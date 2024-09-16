import { type Kysely, sql } from 'kysely'
import { type DB } from 'kysely-codegen'

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema.createType('user_role')
	.asEnum(['ADMIN', 'TEACHER', 'STUDENT'])
	.execute();
	await db.schema.createType('lesson_status')
	.asEnum(['PLANNED', 'DONE', 'CANCELED'])
	.execute();
	await db.schema.createType('group_status')
	.asEnum(['PLANNED', 'ACTIVE', 'FINISHED', 'CANCELED'])
	.execute();
	await db.schema.createTable('users')
	.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
	.addColumn('username', 'varchar(120)', (col) => col.unique().notNull())
	.addColumn('password', 'varchar(120)', (col) => col.notNull())
	.addColumn('name', 'varchar(120)', (col) => col.notNull())
	.addColumn('role', sql`USER_ROLE`, (col) => col.defaultTo('STUDENT').notNull())
	.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
	.execute();

	await db.schema.createTable('students')
	.addColumn('id', 'integer', (col) => col.primaryKey().notNull().references('users.id'))
	.execute()

	await db.schema.createTable('teachers')
	.addColumn('id', 'integer', (col) => col.primaryKey().notNull().references('users.id'))
	.execute()

	await sql`
	CREATE OR REPLACE FUNCTION create_student_or_teacher() 
	RETURNS TRIGGER 
	LANGUAGE PLPGSQL
	AS 
	$$
	BEGIN
		IF NEW.role = 'STUDENT' THEN
			INSERT INTO students (id) VALUES (NEW.id);
		ELSIF NEW.role = 'TEACHER' THEN
			INSERT INTO teachers (id) VALUES (NEW.id);
		END IF;
		RETURN NEW;
	END;
	$$
	`.execute(db);
	await sql`
	CREATE TRIGGER create_student_or_teacher_trigger \
	AFTER INSERT ON users \
	FOR EACH ROW \
	EXECUTE FUNCTION create_student_or_teacher();
	`.execute(db);


	await db.schema.createTable('courses')
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('title', 'varchar(120)', (col) => col.notNull())
		.addColumn('lesson_duration', sql`interval`, (col) => col.notNull())
		.addColumn('course_duration', sql`interval`, (col) => col.notNull())
		.execute();

	await db.schema.createTable('groups')
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('title', 'varchar(120)', (col) => col.notNull())
		.addColumn('course_id', 'integer', (col) => col.notNull().references('courses.id'))
		.addColumn('status', sql`GROUP_STATUS`, (col) => col.defaultTo('PLANNED').notNull())
		.addColumn('teacher_id', 'integer', (col) => col.notNull().references('teachers.id'))
		.execute();

	await db.schema.createTable('rooms')
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('title', 'varchar(120)', (col) => col.notNull())
		.execute();


	await db.schema.createTable('lessons')
		.addColumn('id', 'serial', (col) => col.primaryKey().notNull())
		.addColumn('title', 'varchar(120)', (col) => col.notNull())
		.addColumn('start_time', 'timestamp', (col) => col.notNull())
		.addColumn('end_time', 'timestamp', (col) => col.notNull())
		.addColumn('room_id', 'integer', (col) => col.notNull().references('rooms.id'))
		.addColumn('teacher_id', 'integer', (col) => col.notNull().references('teachers.id'))
		.addColumn('group_id', 'integer', (col) => col.notNull().references('groups.id'))
		.addColumn('status', sql`LESSON_STATUS`, (col) => col.defaultTo('PLANNED').notNull())
		.execute();

	await db.schema.createTable('students_on_lessons')
		.addColumn('lesson_id', 'integer', (col) => col.notNull().references('lessons.id'))
		.addColumn('student_id', 'integer', (col) => col.notNull().references('students.id'))
		.addColumn('participated', 'boolean', (col) => col.notNull().defaultTo(false))
		.execute();

	await db.schema.createIndex('students_on_lessons_main_index').on('students_on_lessons').columns(['lesson_id', 'student_id']).execute();
	
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('students_on_lessons').execute();
	await db.schema.dropTable('lessons').execute();
	await db.schema.dropTable('rooms').execute();
	await db.schema.dropTable('groups').execute();
	await db.schema.dropTable('courses').execute();
	await db.schema.dropTable('teachers').execute();
	await db.schema.dropTable('students').execute();
	await sql`DROP TRIGGER create_student_or_teacher_trigger ON users`.execute(db);
	await sql`DROP FUNCTION create_student_or_teacher()`.execute(db);
	await db.schema.dropTable('users').execute();
	await db.schema.dropType('user_role').execute();
	await db.schema.dropType('lesson_status').execute();
	await db.schema.dropType('group_status').execute();
}
