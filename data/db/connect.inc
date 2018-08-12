<?php

require_once 'ErrorLogging.inc';
require_once 'db/ez_sql_core.php';
require_once 'db/ez_sql_sqlite3.php';


$db = new ezSQL_sqlite3('db/', 'words.db');

// TODO this needs to do some pragma shit with foreign keys
// FIXME does this work?
$db->query('PRAGMA foreign_keys = ON');

function escape($var) {
	global $db;
	return $db->escape($var);
}

function query($q) {
	global $db;
	_el("\n$q\n");
	$db->query($q);
}
