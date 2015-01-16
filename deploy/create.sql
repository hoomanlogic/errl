use [hoomanlogic]
go

create schema [errl]
go

-- Getting Started (Test Developer)
--1. Download errl.js
--2. Set errl.config: { test account }
--3. Implement errl.log in window.onerror: errl.log(arguments);

--Premium Benefits: dedicated table (faster results)
--                  environments (ability to separate by different sites)
--					multiple users (ability to assign multiple users to a developer company)
--					ignore and watch lists
--Premium Benefits are extended for Public GitHub Projects, allow any developer to watch the error history of the library

create table [errl].[Developers] (
	[Id] nvarchar(128) not null constraint [PK_Developers] primary key,
	[Key] nvarchar(128) not null constraint [AK_Developers_Key] unique,
	[Handle] varchar(50) not null constraint [AK_Developers_Handle] unique, 
	[Name] varchar(100) not null constraint [AK_Developers_Name] unique,
	[IsPremium] bit not null constraint [DF_Developers_IsPremium] default (0)
)
go

-- create my developer account
insert into [errl].developers values ('54263eb4-6ced-49bf-9bd7-14f0106c2a02','54263eb4-6ced-49bf-9bd7-14f0106c2a02','hoomanlogic','HoomanLogic', 1)

--create table [errl].[DeveloperProducts] (
--	[Id] nvarchar(128) not null constraint [PK_DeveloperProducts] primary key,
--	[Key] nvarchar(128) not null constraint [AK_DeveloperProducts_Key] unique,
--	[Handle] varchar(50) not null constraint [AK_DeveloperProducts_Handle] unique, 
--	[Name] varchar(100) not null constraint [AK_DeveloperProducts_Name] unique
--)
--go
select * FROM [errl].[Errors]
create table [errl].[UsersDevelopers] (
	[UserId] nvarchar(128) not null,
	[DeveloperId] nvarchar(128) not null,
	[IsAdmin] bit not null constraint [DF_UsersDevelopers_IsAdmin] default (0),
	constraint [PK_UsersDevelopers] primary key ([UserId], [DeveloperId])
)
go
select * from AspNetUsers

create table [errl].[UsersDevelopers] (
	[UserId] nvarchar(128) not null,
	[DeveloperId] nvarchar(128) not null,
	[IsAdmin] bit not null constraint [DF_UsersDevelopers_IsAdmin] default (0),
	constraint [PK_UsersDevelopers] primary key ([UserId], [DeveloperId])
)
go

-- assign me to my developer account
insert into [errl].UsersDevelopers values ('db6f45f8-0c0e-4135-9a29-0be2c79a4eb1', '54263eb4-6ced-49bf-9bd7-14f0106c2a02', 1)

-- error logging
create table [errl].[Errors] (
	[DeveloperId] nvarchar(128) not null,
	[Id] nvarchar(128) not null constraint [PK_Errors] primary key clustered,
	[Environment] varchar(20) not null constraint [DF_Errors_Environment] default ('n/a'),
	[Version] varchar(20) not null,
	[ErrorType] varchar(100) not null,
	[ErrorDescription] [varchar](max) not null,
	[ProductName] varchar(20) not null,
	[ObjectName] varchar(255) not null constraint [DF_Errors_Object] default ('n/a'),
	[SubName] varchar(255) not null constraint [DF_Errors_Sub] default ('n/a'),
	[Details] varchar(max) not null,
	[StackTrace] varchar(max) not null,
	[State] varchar(max) null,
	[UserId] varchar(30) not null constraint [DF_Errors_UserId] default ('$anonymous'),
	[Occurred] datetime not null constraint [DF_Errors_Occurred] default (getutcdate())
)
go

-- event logging
create table [errl].[Events] (
	[DeveloperId] nvarchar(128) not null,
	[Id] nvarchar(128) not null constraint [PK_Events] primary key clustered,
	[Environment] varchar(20) not null constraint [DF_Events_Environment] default ('n/a'),
	[Version] varchar(20) not null,
	[EventType] varchar(100) not null,
	[ProductName] varchar(20) not null,
	[ObjectName] varchar(255) not null constraint [DF_Events_Object] default ('n/a'),
	[SubName] varchar(255) not null constraint [DF_Events_Sub] default ('n/a'),
	[Details] varchar(max) not null,
	[UserId] varchar(30) not null constraint [DF_Events_UserId] default ('$anonymous'),
	[Occurred] datetime not null constraint [DF_Events_Occurred] default (getutcdate())
)
go

-- notify when an error that meets watcher criteria occurs
--create table [errl].[WatchList] (
--	[Id] nvarchar(128) not null constraint [PK_Watchers] primary key clustered,
--	[AccountId] nvarchar(128) not null,
--	[Environment] varchar(20) null,
--	[Product] varchar(20) not null,
--	[Object] varchar(255) null,
--	[Sub] varchar(255) null,
--	[ErrorType] varchar(100) null,
--	constraint [CK_Watchers] check ([ErrorType] is not null or [Object] is not null or [Sub] is not null)
--)
--go

-- do not include these errors in the view unless explicitly included
--create table [errl].[IgnoreList] (
--	[Id] nvarchar(128) not null constraint [PK_IgnoreList] primary key clustered,
--	[AccountId] nvarchar(128) not null,
--	[Environment] varchar(20) null,
--	[Product] varchar(20) not null,
--	[Object] varchar(255) null,
--	[Sub] varchar(255) null,
--	[ErrorType] varchar(100) null,
--	constraint [CK_Watchers] check ([ErrorType] is not null or [Object] is not null or [Sub] is not null)
--)
--go

create procedure [errl].[GetErrorHistory] (
	@DeveloperId nvarchar(128) = null,
	@Version varchar(20) = null,
	@ErrorType varchar(100) = null,
	@ObjectName varchar(max) = null,
	@SubName varchar(max) = null,
	@UserId varchar(30) = null
)
AS
	set NOCOUNT on

	declare @DataSet TABLE (
		[Id] nvarchar(128) not null,
		[Environment] varchar(20) not null,
		[Version] [varchar](20) not null,
		[ErrorType] varchar(100) not null,
		[ErrorDescription] [varchar](max) not null,
		[ProductName] [varchar](255) not null,
		[ObjectName] [varchar](255) not null,
		[SubName] [varchar](255) not null,
		[Details] varchar(max) not null,
		[StackTrace] [varchar](max) not null,
		[State] varchar(max) null,
		[UserId] [varchar](30) not null,
		[Occurred] [datetime] not null
	)

	-- all history for given parameters
	insert into @DataSet
	select [Id],
		[Environment],
		[Version],
		[ErrorType],
		[ErrorDescription],
		[ProductName],
		[ObjectName],
		[SubName],
		[Details],
		[StackTrace],
		[State],
		[UserId],
		[Occurred]
	from [errl].[Errors] with (nolock)
	where ([DeveloperId] = @DeveloperId)
      and ([Version] like @Version or @Version is null) 
	  and (ErrorType = @ErrorType or @ErrorType is null)
	  and (ObjectName = @ObjectName or @ObjectName is null)
	  and (SubName = @SubName or @SubName is null)
	  and (UserId = @UserId or @UserId is null)
	order by [Occurred] desc

	declare @FirstOccurred datetime
	declare @VersionFirstOccurredIn varchar(20)

	set @FirstOccurred = (select MIN(Occurred) from @DataSet)
	set @VersionFirstOccurredIn = (select TOP 1 [Version] from @DataSet where Occurred = @FirstOccurred)

	declare @Info table (InfoItem varchar(max))

	insert into @Info (InfoItem) select 'First occurred on ' + cast(@FirstOccurred as varchar(50)) + ' in Version ' + @VersionFirstOccurredIn
	insert into @Info (InfoItem) select 'Most affected user is ' + (select TOP 1 UserId from @DataSet GROUP BY UserId order by count(*) desc)

	select * from @Info

	select * from @DataSet order by [Occurred] desc

	set NOCOUNT off

go
