# words
A little web app to keep track of your favourite words

## no one but me will ever run this app but in case you do

This is all done in gulp, so install that. Then read the gulpfile to find out about all of the things

## Setting up the database

1. cd to the `data/db` directory
2. run `sqlite3 words.db < cret.sql`
3. to view the database, run `sqlite3 words.db` - once you have access you should run `PRAGMA foreign_keys = ON;`

To delete everything from the database, run `sqlite3 words.db < delet.sql`

## Importing a big thing of things

1. cd to the `data` directory
2. run `php -f readCSV.php`
3. I think that's it
