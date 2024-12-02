PRAGMA foreign_keys = ON;

-- on edit word, update word2tag
-- on edit tag, update word2tag

create table words (
    word text primary key not null,
    fave integer default 0,
	unique(word)
);

create table tags (
    tag text primary key not null
    -- , jealous integer default 0
);

create table word2tag (
    word text not null,
    tag text not null,
    unique(word, tag),
    foreign key(word) references words(word) on delete cascade on update cascade,
    foreign key(tag) references tags(tag) on delete cascade on update cascade
);

-- if new.tag is jealous, clear all tags for this word
-- NB jealous tags always overwrite all other tags
-- create trigger jealousTagsClear
-- before insert on word2tag
-- when (select jealous from tags where tag = NEW.tag) = 1
-- begin
-- 	delete from word2tag where word = NEW.word;
-- end;

-- -- if word is tagged with a jealous tag, and the new tag is not jealous, do not tag this word
-- create trigger jealousTagsPrevent
-- before insert on word2tag
-- for each row
-- when (select jealous
--     from tags
--     join word2tag USING (tag)
--     join words USING (word)
--     where word = NEW.word AND jealous = 1) = 1
-- begin
--     select raise(abort, 'This word is already jealously tagged')
--     where (select jealous from tags where tag = NEW.tag) = 0;
-- end;
