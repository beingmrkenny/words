# words
A little web app to keep track of your favourite words

## no one but me will ever run this app but in case you do

1. `npm i -g sass`
2. `npm i`

## Setting up the database

1. cd to the `data/db` directory
2. run `sqlite3 words.db < create.sql`
3. to view the database, run `sqlite3 words.db` - once you have access you should run `PRAGMA foreign_keys = ON;`

To delete everything from the database, run `sqlite3 words.db < delete.sql`

## Importing a big thing of things

1. cd to the `data` directory
2. run `php -f readCSV.php`
3. I think that's it
