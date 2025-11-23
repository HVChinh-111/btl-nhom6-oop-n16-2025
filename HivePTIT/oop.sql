CREATE DATABASE IF NOT EXISTS HivePTIT
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE HivePTIT;
create table `users`(
	student_id char(10) primary key,
    password_hash varchar(30) not null,
    username varchar(30) unique not null,
    email varchar(30) unique not null,
    firstname varchar(30), 
    lastname varchar(30),
    avatar_url varchar(50),
    bio text,
    is_verified ENUM('Y','N') default 'N',
    -- tinh bang trigger dua vao cmt va post 
    ranking_core int not null default 0,
    constraint check (email like '%@ptit.edu.vn')
) ENGINE=InnoDB;

create table `roles`(
	role_id int auto_increment primary key,
    role_name varchar(30) unique not null
) ENGINE=InnoDB;

create table `user_role`(
	student_id char(10) not null,
    role_id int not null,
    primary key(student_id,role_id),
    foreign key (student_id) references `users`(student_id)
    on update cascade on delete cascade,
    foreign key (role_id) references `roles`(role_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `permissions`(
	permission_id int auto_increment primary key,
    code varchar(30) unique not null,
    description text
) ENGINE=InnoDB;

create table `role_permission`(
	role_id int not null,
    permission_id int not null,
    primary key (role_id,permission_id),
    foreign key (role_id) references `roles`(role_id) 
    on update cascade on delete cascade,
    foreign key (permission_id) references `permissions`(permission_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `topics`(
	topic_id int auto_increment primary key,
    name varchar(30) unique not null
) ENGINE=InnoDB;

create table `user_topic`(
	student_id char(10) not null,
    topic_id int not null,
    primary key(student_id,topic_id),
    foreign key(student_id) references `users`(student_id)
    on update cascade on delete cascade,
    foreign key(topic_id) references `topics`(topic_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `bookmark_list`(
	list_id int auto_increment primary key,
    student_id char(10) not null, 
    name varchar(50),
    created_at timestamp default current_timestamp,
    foreign key (student_id) references `users`(student_id)
    on update cascade on delete cascade,
    constraint unique(student_id,name)
) ENGINE=InnoDB;

create table `posts`(
	post_id int auto_increment primary key,
    student_id char(10) not null,
    title text not null,
    content longtext not null,
    -- vote_count tinh bang trigger
    vote_count int not null default 0,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (student_id) references `users`(student_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `book_post`(
	list_id int not null,
    post_id int not null,
    added_at timestamp default current_timestamp,
    primary key (list_id,post_id),
    foreign key (list_id) references `bookmark_list`(list_id)
    on update cascade on delete cascade,
    foreign key (post_id) references `posts`(post_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `post_topic`(
	post_id int not null,
    topic_id int not null,
    primary key (post_id,topic_id),
	foreign key (post_id) references `posts`(post_id)
    on update cascade on delete cascade,
    foreign key (topic_id) references `topics`(topic_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

create table `comments`(
	comment_id int auto_increment primary key,
    post_id int not null,
    student_id char(10) not null,
    -- parent_comment_id is null thi la tu cmt bai cua minh
    parent_comment_id int,
    -- vote_count tinh bang trigger
    vote_count int not null default 0,
    content text,
    created_at timestamp default current_timestamp,
    -- dung trigger 
    is_edited enum('Y','N') not null default 'N',
	UNIQUE KEY uk_comment_post (comment_id, post_id),
	KEY idx_comment_post (post_id),
	KEY idx_comment_student (student_id),
	KEY idx_comment_parent_post (parent_comment_id, post_id),
    foreign key (post_id) references `posts`(post_id)
    on update cascade on delete cascade,
    foreign key (student_id) references `users`(student_id)
    on update cascade on delete cascade,
    FOREIGN KEY (parent_comment_id, post_id) REFERENCES `comments`(comment_id, post_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;
-- phai dung trigger de vote cho cmt hoac post( đã xử lý trên be)
create table `votes`(
	vote_id int auto_increment primary key,
	student_id char(10) not null,
    post_id int,
    comment_id int, 
    vote_type enum("upvote","downvote"),
    -- vote cho post hoac cmt cái này phải xử lý ở be nếu không sẽ ảnh hưởng đến trigger tính vote
    constraint unique(student_id,post_id),
    constraint unique(student_id,comment_id),
	foreign key (post_id) references `posts`(post_id)
    on update cascade on delete cascade,
    foreign key (student_id) references `users`(student_id)
    on update cascade on delete cascade,
    foreign key (comment_id) references `comments`(comment_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;

CREATE TABLE `follows`(
  follower_id  char(10) not null,
  following_id char(10) not null,
  created_at   timestamp default current_timestamp,
  -- doan xu ly nguoi kh tu theo doi minh xu ly tren be
  primary key (follower_id, following_id),
  constraint fk_follow_follower  foreign key (follower_id)  references `users`(student_id)
    on update cascade on delete cascade,
  constraint fk_follow_following foreign key (following_id) references `users`(student_id)
    on update cascade on delete cascade
) ENGINE=InnoDB;


-- trigger

-- xu ly vote_count ở cmt, post va ranking_core ở user khi them vote moi
DELIMITER //
CREATE TRIGGER vote_count_after_insert 
AFTER INSERT ON `votes`
FOR EACH ROW
BEGIN
  DECLARE delta INT;
  SET delta = CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END;
  IF NEW.post_id IS NOT NULL THEN
    UPDATE `posts` SET vote_count = vote_count + delta WHERE post_id = NEW.post_id;
    UPDATE `users` SET ranking_core = ranking_core + 5*delta WHERE student_id IN (
			SELECT p.student_id FROM `posts` p WHERE p.post_id = NEW.post_id
	);
  ELSE
    UPDATE `comments` SET vote_count = vote_count + delta WHERE comment_id = NEW.comment_id;
    UPDATE `users` SET ranking_core = ranking_core + delta WHERE student_id IN (
			SELECT c.student_id FROM `comments` c WHERE c.comment_id = NEW.comment_id
	);
  END IF;
END;//

-- xu ly vote_count ở cmt, post va ranking_core ở user khi thay đổi vote
CREATE TRIGGER vote_count_after_update
AFTER UPDATE ON `votes`
FOR EACH ROW
BEGIN
  DECLARE old_delta INT; DECLARE new_delta INT;
  SET old_delta = CASE WHEN OLD.vote_type='upvote' THEN 1 ELSE -1 END;
  SET new_delta = CASE WHEN NEW.vote_type='upvote' THEN 1 ELSE -1 END;
  -- Gỡ ảnh hưởng cũ
  IF OLD.post_id IS NOT NULL THEN
    UPDATE `posts` SET vote_count = vote_count - old_delta WHERE post_id    = OLD.post_id;
    UPDATE `users` SET ranking_core = ranking_core - 5*delta WHERE student_id IN (
			SELECT p.student_id FROM `post` p WHERE p.post_id = OLD.post_id
	);
  ELSE
    UPDATE `comments` SET vote_count = vote_count - old_delta WHERE comment_id = OLD.comment_id;
    UPDATE `users` SET ranking_core = ranking_core - delta WHERE student_id IN (
			SELECT p.student_id FROM `comments` c WHERE c.comment_id = OLD.comment_id
	);
  END IF;
  -- Áp ảnh hưởng mới
  IF NEW.post_id IS NOT NULL THEN
    UPDATE `posts` SET vote_count = vote_count + new_delta WHERE post_id    = NEW.post_id;
	UPDATE `users` SET ranking_core = ranking_core + 5*delta WHERE student_id IN (
			SELECT p.student_id FROM `post` p WHERE p.post_id = NEW.post_id
	);
  ELSE
    UPDATE `comments` SET vote_count = vote_count + new_delta WHERE comment_id = NEW.comment_id;
    UPDATE `users` SET ranking_core = ranking_core + delta WHERE student_id IN (
			SELECT p.student_id FROM `comments` c WHERE c.comment_id = NEW.comment_id
	);
  END IF;
END;//

-- xu ly vote_count ở cmt, post va ranking_core ở user  khi xoá vote
CREATE TRIGGER vote_count_after_delete
AFTER DELETE ON `votes`
FOR EACH ROW
BEGIN
  DECLARE delta INT;
  SET delta = CASE WHEN OLD.vote_type='upvote' THEN 1 ELSE -1 END;
  IF OLD.post_id IS NOT NULL THEN
    UPDATE `posts` SET vote_count = vote_count - delta WHERE post_id    = OLD.post_id;
    UPDATE `users` SET ranking_core = ranking_core - 5*delta WHERE student_id IN (
			SELECT p.student_id FROM `posts` p WHERE p.post_id = OLD.post_id
	);
  ELSE
    UPDATE `comments` SET vote_count = vote_count - delta WHERE comment_id = OLD.comment_id;
    UPDATE `users` SET ranking_core = ranking_core - delta WHERE student_id IN (
			SELECT p.student_id FROM `comments` c WHERE c.comment_id = OLD.comment_id
	);
  END IF;
END;//
DELIMITER ;


-- trigger xử lý nội dung cmt đã được chỉnh sửa chưa 

DELIMITER //
CREATE TRIGGER is_edited_before_update
BEFORE UPDATE ON `comments`
FOR EACH ROW
BEGIN
  -- chỉ gắn cờ khi nội dung thực sự thay đổi (kể cả null vs non-null, hoặc khác sau khi trim)
  IF (
       (OLD.content IS NULL AND NEW.content IS NOT NULL)
       OR (OLD.content IS NOT NULL AND NEW.content IS NULL)
       OR (OLD.content IS NOT NULL AND NEW.content IS NOT NULL AND TRIM(OLD.content) != TRIM(NEW.content))
     )
     AND NEW.is_edited = 'N'  -- tránh ghi đè nếu đã 'Y'
  THEN
    SET NEW.is_edited = 'Y';
  END IF;
END//
DELIMITER ;
