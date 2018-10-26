create database everkeep;
use everkeep;

create table `user` (
userid int auto_increment primary key,
username varchar(100) default null,
`password` text not null,
email varchar(100) not null unique,
isConfirm tinyint default 0,
createTime timestamp not null default current_timestamp
);

create table mark (
markid int auto_increment primary key,
userid int not null,
markName text not null,
createTime timestamp not null default current_timestamp,
updateTime timestamp not null default current_timestamp on update current_timestamp,
isStar tinyint default 0,
isDelete tinyint default 0,

constraint fk_markid_userid foreign key (userid) references  `user`(userid)
);

create table notebook (
notebookid int auto_increment primary key,
userid int not null,
bookName text not null,
createTime timestamp not null default current_timestamp,
updateTime timestamp not null default current_timestamp on update current_timestamp,
noteNumber int not null default 0,
 
isStar tinyint default 0,
isShare tinyint default 0,
isDelete tinyint default 0,

sharedPeople text default null,

constraint fk_notebookid_userid foreign key (userid) references  `user`(userid)
);

create table note (
noteid int auto_increment primary key,
userid int not null,
title text default null,
content longtext not null,
createTime timestamp not null default current_timestamp,
updateTime timestamp not null default current_timestamp on update current_timestamp,
markid int default null,
notebookid int default null,
remindTime timestamp default 0,
isStar tinyint default 0,
isShare tinyint default 0,
isDelete tinyint default 0,

sharedPeople text default null,

constraint fk_noteid_notebookid foreign key(notebookid) references notebook(notebookid),
constraint fk_noteid_markid foreign key (markid) references mark(markid),
constraint fk_noteid_userid foreign key (userid) references  `user`(userid)
);

create table `comment` (
commentid int auto_increment primary key,
userid int not null,
noteid int not null,
content text not null,
filename text default null,
ext text default null,
`type` text default null,
filepath text default null, 

constraint fk_commentid_userid foreign key (userid) references  `user`(userid),
constraint fk_commentid_noteid foreign key (noteid) references  note(noteid)
);

create table `file` (
fileid varchar(32) primary key,
userid int not null,
filename text not null,
filesize int not null,
filedata longblob not null,
link int default 1,
constraint fk_fileid_userid foreign key(userid) references `user`(userid)
);

create table `confirm` (
userid int not null,
confirmCode int(6) not null,
applyTime timestamp not null default current_timestamp,
`usage` tinyint not null default 0,

constraint confirmuid_userid foreign key (userid) references  `user`(userid)
);


