<?php

require_once '../common.inc';
require_once 'db/connect.inc';
require_once 'read.inc';

function addWord ($word) {
	$word = escape($word);
	query("INSERT INTO words (word, fave, score) VALUES ('$word', 0, 0)");
}

function addWords ($words) {
	foreach ($words as &$word) {
		$word = "('{escape($word)}', 0, 0)";
	}
	$wordsJoined = implode($words, ',');
	query("INSERT INTO words (word, fave, score) VALUES $wordsJoined");
}

function tagWord ($tag, $word) {
	$tag = escape($tag);
	$word = escape($word);
	query("INSERT INTO word2tag (word, tag) VALUES ('$word', '$tag')");
}

function tagWords ($tag, $words) {
	$tag = escape($tag);
	foreach ($words as &$word) {
		$word = "('{escape($word)}', '$tag')";
	}
	$wordsTagsJoined = implode($words, ',');
	query("INSERT INTO word2tag (word, tag) VALUES $wordsTagsJoined");
}

function detagWord ($tag, $word) {
	$tag = escape($tag);
	$word = escape($word);
	query("DELETE FROM word2tag WHERE word = '$word' AND tag = '$tag'");
}

function addTag ($tag, $jealous=false) {
	$tag = escape($tag);
	$jealous = ($jealous) ? 1 : 0;
	query("INSERT INTO tags (tag, jealous) VALUES ('$tag', $jealous)");
}


function deleteTag ($tag) {
	$tag = escape($tag);
	query("DELETE FROM tags WHERE tag = '$tag'");
}

function faveWord ($word) {
	if (!wordIsFaved($word)) {
		$word = escape($word);
		query("UPDATE words SET fave = 1 WHERE word = '$word'");
		scoreWord($word, 100);
	}
}

function unfaveWord ($word) {
	if (wordIsFaved($word)) {
		$word = escape($word);
		query("UPDATE words SET fave = 0 WHERE word = '$word'");
		scoreWord($word, -100);
	}
}

function scoreWord ($word, $score) {
	$score = getWordScore($word) + $score;
	$word = escape($word);
	query("UPDATE words SET score = $score WHERE word = '$word'");
}
