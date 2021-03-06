use aehxyfb8hl4u8mvv;


CREATE TABLE allusers
(
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	upvotes int DEFAULT 0,
	downvotes int DEFAULT 0,
	totalUploads int DEFAULT 0,
	PRIMARY KEY (username)
);

DROP TABLE allusers;

CREATE TABLE sentences
(
	id int (11) AUTO_INCREMENT,
    original varchar (2048) NOT NULL,
    revised int (11) DEFAULT 0,
    author varchar (255),
    attribution varchar (255),
    ts_create timestamp default current_timestamp,
    ts_update timestamp default current_timestamp on update current_timestamp,
    PRIMARY KEY (id)
);

DROP TABLE sentences;

INSERT INTO sentences VALUES (1, 'Lost all my hair, and lost all my game');
INSERT INTO sentences (original) VALUES('No good way to say goodbye');

ALTER TABLE sentences MODIFY revised INTEGER;

SELECT * FROM sentences;

DELETE FROM sentences WHERE id = 1;

CREATE TABLE 
(
	id int(11) NOT NULL AUTO_INCREMENT,
    revision varchar (2048) NOT NULL,
    upvotes int(11) DEFAULT 0,
    downvotes int(11) DEFAULT 0,
    PRIMARY KEY (id)
);

DROP TABLE sentences;

drop table sentence1;
drop table sentence2;
drop table sentence3;
drop table sentence4;
drop table sentence5;
drop table sentence6;
drop table sentence3;

drop table sentence18;
	
SELECT * FROM sentence1;
SELECT * from sentence2;
SELECT * FROM sentence7;

DELETE FROM sentence2 WHERE id = 3;

select * from sentence8;

INSERT INTO sentence1 (revision) VALUES ('just testing');

UPDATE sentences
SET original = 'I went bald years ago and my game never recovered'
WHERE id = 1;

UPDATE sentence1
SET revision = 'Love, together we ratify the silence'
WHERE id = 1;

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS sentence1, sentence2, sentence3;
SET foreign_key_checks = 1;


Create table Users
(
	firstname varchar (255) not null,
    lastname varchar (255) not null,
	username varchar(255) not null,
    userpassword varchar(255) not null,
    email varchar(255) not null,
    primary key (email)
);


SELECT * FROM Users;
DROP TABLE Users;
DELETE FROM Users WHERE userpassword = 'han';

SELECT * FROM iliketosleep;

DROP table iliketosleep;
DROP TABLE givemetreats;

SHOW TABLES;
DROP TABLE sentence27;


-- FACEBOOK schema
CREATE TABLE fbusers
(   
    fbID varchar (255) NOT NULL, -- unique identifier 
    fbName varchar (255), -- is the user the creator of the sentence?
    primary key (fbID)
); 