use aehxyfb8hl4u8mvv;

Create table Users
(
	firstname varchar (255) not null,
    lastname varchar (255) not null,
	username varchar(255) not null,
    userpassword varchar(255) not null,
    email varchar(255) not null,
    primary key (email)
);
drop table Users;
create table userdata
(   

	id int (11) auto_increment, --unique identifier 
    creator boolean default false, --is the user the creator of the sentence?
    originalId int (11),    --the id of the original sentence
    revisedId int (11), -- the id of the revision
    upvotes boolean default false, --did the user like this sentence?
    revisor boolean default false, --did the user revise this sentence?
    primary key (id)
);
drop table userdata;
select * from Users;
insert into Users values("erick","codingrocks","erick123@gmail.com");
insert into userdata values(1, 1, 2, 1,0,1);
delete from userdata where id = 1;

select * from userdata;