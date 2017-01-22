


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

CREATE TABLE sentences
(
	id int (11) AUTO_INCREMENT,
    original varchar (2048) NOT NULL,
    revised boolean DEFAULT false,
    PRIMARY KEY (id)
);

DROP TABLE sentences;

INSERT INTO sentences VALUES (1, 'Lost all my hair, and lost all my game');
INSERT INTO sentences (original) VALUES('No good way to say goodbye');


select * from sentences;

CREATE TABLE sentence18
(
	id int(11) NOT NULL AUTO_INCREMENT,
    revision varchar (2048) NOT NULL,
    upvotes int(11) DEFAULT 0,
    downvotes int(11) DEFAULT 0,
    PRIMARY KEY (id)
);

drop table sentence1;
drop table sentence2;

select * from sentence1;	
select * from sentence2;

INSERT INTO sentence1 (revision) VALUES ('just testing');

UPDATE sentences
SET original = 'Lost all my hair, and lost all my game'
WHERE id = 1;
