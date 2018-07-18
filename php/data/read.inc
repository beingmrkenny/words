<?php
require_once 'db/connect.inc';

function getTags() {
	global $db;
	return $db->get_col("SELECT tag FROM tags");
}

function getWordsForTag ($tag) {
	global $db;
	$tag = escape($tag);
	return $db->get_col("SELECT word FROM words JOIN word2tag USING (word) WHERE tag = '$tag'");
}

function getUntaggedWords () {
	global $db;
	return $db->get_col("SELECT word FROM words LEFT JOIN word2tag USING (word) WHERE word2tag.word IS NULL");
}

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
