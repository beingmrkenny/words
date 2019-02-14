if [[ -f words.db ]]; then
	rm words.db;
fi;

touch words.db;

sqlite3 words.db < cret.sql;

cd '../';

php -f '../readCSV.php';
