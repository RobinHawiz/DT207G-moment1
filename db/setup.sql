-- Create database if it doesn't exist
if not exists (
  select name
  from sys.databases
  where name = N'cvdb'
)
begin
  create database cvdb;
end
go

-- Switch to it
use cvdb;
go

-- Create tables
begin

  create table courses (
    id int identity(1,1) primary key,
    CourseCode nvarchar(6) not null,
    CourseName nvarchar(50) not null,
    Syllabus nvarchar(2083) not null,
    Progression char(1) not null
  );

end
go

-- Create stored procedures
create procedure dbo.spCourses_Insert
	@courseCode nvarchar(6),
	@courseName nvarchar(50),
	@syllabus nvarchar(2083),
	@progression char(1)
as
begin
	set nocount on;

	insert into dbo.Courses(CourseCode, CourseName, Syllabus, Progression)
	values(@courseCode, @courseName, @syllabus, @progression);
end
go

CREATE procedure dbo.spCourses_GetAll
as
begin
	set nocount on;

	select Id as id, CourseCode as courseCode, CourseName as courseName, Syllabus as syllabus, Progression as progression
	from dbo.Courses;

end
go

create procedure dbo.spCourses_DeleteById
	@id int
as
begin
	set nocount on;

	delete from dbo.Courses
	where Id = @id;
end
go

create procedure dbo.spCourses_CheckExistanceById
	@id int
as
begin
	set nocount on

	select count(1) from Courses
	where Id = @id;
end
go

-- Create SQL login if it doesn't exist
if not exists (
  select name from sys.sql_logins where name = N'local'
)
begin
  create login [local] with password = 'local';
end;
go

-- Create DB user from login
if not exists (
  select name from sys.database_principals where name = N'local'
)
begin
  create user [local] for login [local];
  alter role db_owner add member [local];
end;
go