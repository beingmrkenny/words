<?php

require_once 'db/ez_sql_core.php';
require_once 'db/ez_sql_sqlite3.php';

// TODO this needs to do some pragma shit with foreign keys
$db = new ezSQL_sqlite3('db/', 'wirts.db');

function escape($var) {
	global $db;
	return $db->escape($var);
}

function query($q) {
	global $db;
	echo "\n$q\n";
	$db->query($q);
}
