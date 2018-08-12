PRAGMA foreign_keys = ON;

insert into words (word, fave) values
    ('word', 0),
    ('dsfsdfgsdfg', 0),
    ('sdfgwt', 0),
    ('fdgsdfg', 0),
    ('sdfgsdfg', 0),
    ('gsfdgsdfg', 0),
    ('rtuyrtyurtyu', 0),
    ('wertwertwert', 0),
    ('fghjfghjfghj', 0),
    ('qwetwertwertw', 0),
    ('ertyerty', 0),
    ('ertyertyerty', 0),
    ('gsgsdfg', 0);

insert into tags (tag, jealous) values
    ('tag one', 0),
    ('this tag', 0),
    ('that rag', 0),
    ('JEALOUS', 1),
    ('MOREJEALOUS', 1);

delete from word2tag;
insert into word2tag (word, tag) values
    ('word', 'tag one'),
    ('word', 'this tag'),
    ('word', 'that rag');

-- Test queries

PRAGMA foreign_keys = ON;

select * from word2tag where word = 'word';
-- Should select all three

insert into word2tag (word, tag) values ('word', 'JEALOUS');
select * from word2tag where word = 'word';
-- Should select just JEALOUS

insert into word2tag (word, tag) values ('word', 'MOREJEALOUS');
select * from word2tag where word = 'word';
-- Should select just MOREJEALOUS

insert into word2tag (word, tag) values ('word', 'tag one');
select * from word2tag where word = 'word';
-- Should return an error 'This word is already jealously tagged'

insert into word2tag (word, tag) values ('word', 'fart tag');
select * from word2tag where word = 'word';
-- Should return a foreign key restraint
-- NB You will need to run the PRAGMA command at the top, or otherwise switch on foreign keys
