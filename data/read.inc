<?php

require_once '../common.inc';
require_once 'db/connect.inc';

function getWordScore ($word) {
	global $db;
	$word = $db->escape($word);
	$score = $db->get_var("SELECT score FROM words WHERE word = '$word'");
	return intval($score);
}

function wordIsFaved ($word) {
	global $db;
	$word = $db->escape($word);
	// QUESTION how is this returned
	return ($db->get_var("SELECT fave FROM words WHERE word = '$word'") === 1);
}
