use ija2qhszw3zfbdpc;

select * from photos;

delete 
from photos
where id >= 273 AND id <= 300;


CREATE TABLE allusers
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	red int DEFAULT 50,
	green int DEFAULT 50,
	blue int DEFAULT 50,
	bw int DEFAULT 50,
	totalUpvotes int,
	totalDownvotes int,
	totalUploads int,
	PRIMARY KEY (id)
);

INSERT INTO allusers (username, password, email) VALUES ('hanbom', 'mickey', 'tmesis3@gmail.com');

select * from allusers;	

/* counts total number of images */
SELECT COUNT(*) AS images
FROM photos;

select * from photos;

SELECT * FROM `photos` WHERE id =133;

delete from me;

DELETE
FROM hanbom
WHERE id > 2;

drop table allusers;

