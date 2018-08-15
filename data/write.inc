<?php
require_once 'db/connect.inc';
require_once 'http.inc';
require_once 'read.inc';

// NOTE WORDS

function addWord ($word) {
	$word = trim($word);
	if ($word) {
		$word = escape($word);
		query("INSERT INTO words (word, fave) VALUES ('$word', 0)");
	}
}

function deleteWords ($words) {
	_el($words);
	if (is_array($words)) {
		foreach ($words as $i => $word) {
			$words[$i] = '"' . escape(trim($word)) . '"';
		}
		$words = array_unique($words);
		if ($words) {
			$in = implode(',', $words);
			query("DELETE FROM words WHERE word IN ($in)");
			sendAsJSON($words);
		}
	}

}

function addWords ($words) {
	foreach ($words as $word) {
		addWord($word);
	}
}



// NOTE TAGS

function addTag ($tag) {
	$tag = escape($tag);
	query("INSERT INTO tags (tag) VALUES ('$tag')");
}

function editTag ($tag, $newTag) {
	$tag = escape($tag);
	$newTag = escape($newTag);
	query("UPDATE tags SET tag = '$newTag' WHERE tag = '$tag'");
}

function deleteTag ($tag) {
	$tag = escape($tag);
	query("DELETE FROM tags WHERE tag = '$tag'");
}

function wordTagHelper ($tags, $words, $insert) {

	if (
		(is_array($tags) && count($tags) == 0)
		|| (!is_array($tags) && !is_string($tags))
	) {
		return;
	}

	if (
		(is_array($words) && count($words) == 0)
		|| (!is_array($tags) && !is_string($tags))
	) {
		return;
	}

	$valuePairs = array();

	if (is_string($tags)) {
		$tags = [$tags];
	}

	if (is_string($words)) {
		$words = [$words];
	}

	foreach ($tags as $tag) {
		$tag = trim($tag);
		foreach ($words as $word) {
			$word = trim($word);
			$tag = escape($tag);
			$word = escape($word);
			$valuePairs[] = ($insert)
				? "('$word', '$tag')"
				: "(word = '$word' AND tag = '$tag')";
		}
	}
	$valuePairs = array_unique($valuePairs);

	if ($insert) {
		query('INSERT INTO word2tag (word, tag) VALUES ' . implode($valuePairs, ','));
	} else {
		query('DELETE FROM word2tag WHERE ' . implode($valuePairs, ' OR ')); // FIXME untested
	}

}

function tagWords ($tags, $words) {
	wordTagHelper($tags, $words, true);
}

function detagWords ($tags, $words) {
	wordTagHelper($tags, $words, false);
}

function tagWord ($tags, $words) {
	wordTagHelper($tags, $words, true);
}

function detagWord ($tags, $words) {
	wordTagHelper($tags, $words, false);
}



// NOTE Rating

function toggleFaveWords ($words) {

	if (!is_array($words)) {
		$words = [$words];
	}

	$fave = (wordsAreMostlyFaved($words)) ? 0 : 1;

	$echoData = array(
		"fave" => $fave,
		"words" => $words
	);

	foreach ($words as $key => $word) {
		$words[$key] = '"' . escape($word) . '"';
	}
	$wordsString = implode($words, ',');

	query("UPDATE words SET fave = $fave WHERE word IN ($wordsString)");

	// FIXME check if it went ok before just sending it out - and send une erreur if something fucked up
	sendAsJSON($echoData);

}
