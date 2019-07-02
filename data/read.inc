<?php
require_once 'db/connect.inc';

function getTags() {
	global $db;
	return $db->get_col("SELECT tag FROM tags");
}

function getWordsForTag ($tag) {
	global $db;
	$tag = escape($tag);
	return $db->get_results("SELECT word, fave FROM words JOIN word2tag USING (word) WHERE tag = '$tag'");
}

function getWordTagPairsForWords ($words) {
	global $db;
	if (is_array($words) && count($words) > 0) {
		foreach ($words as $key => $word) {
			$words[$key] = '"' . escape($word) . '"';
		}
		$wordsString = implode($words, ',');
		$pairs = $db->get_results("SELECT tag, word FROM word2tag WHERE word IN ($wordsString)");
		$returnArray = [];
		if (is_array($pairs)) {
			foreach ($pairs as $pair) {
				$returnArray[$pair->tag][] = $pair->word;
			}
		}
		return $returnArray;
	}
}

function wordIsTagged ($word, $tag) {
	global $db;
	$word = escape($word);
	$tag = escape($tag);
	return $db->get_col("SELECT word FROM words JOIN word2tag USING (word) WHERE tag = '$tag' AND word = '$word'");
}

function getUntaggedWords () {
	global $db;
	return $db->get_results("SELECT word, fave FROM words LEFT JOIN word2tag USING (word) WHERE word2tag.word IS NULL");
}

function wordIsFaved ($word) {
	global $db;
	$word = $db->escape($word);
	return ($db->get_var("SELECT fave FROM words WHERE word = '$word'") === 1);
}

function wordsAreMostlyFaved ($words) {
	global $db;
	foreach ($words as $key => $word) {
		$words[$key] = '"' . escape($word) . '"';
	}
	$wordsString = implode($words, ',');
	$proportion = intval($db->get_var("SELECT COUNT(*) FROM words WHERE word IN ($wordsString) AND fave = 1")) / count($words);
	return ($proportion >= .5);
}

function tagExists ($tag) {
	global $db;
	$tag = escape($tag);
	return ($db->get_var("SELECT tag FROM tags WHERE tag = '$tag'")) ? true : false;
}
