# wirts
A little web app to keep track of your favourite words

## Setting up the database

1. cd to the `data/db` directory
2. run `sqlite3 wirts.db < cret.sql`
3. to view the database, run `sqlite3 wirts.db` - once you have access you should run `PRAGMA foreign_keys = ON;`

To delete everything from the database, run `sqlite3 wirts.db < delet.sql`
