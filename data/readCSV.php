<?php

// FIXME unique constraint fails quite often on this — make sure that words in multiple tags are being tagged regardless of whether the insert words statement fails

require_once 'write.inc';

$csvFiles = glob('../snippets/csv/*.csv');

foreach ($csvFiles as $csvFile) {

	$matches = array();
	preg_match('/([a-z0-9 ]+)-([a-z0-9 ]+)\.csv/i', $csvFile, $matches);

	if ($matches[2] == 'INBOX') {
		$tag = null;
	} else {
		$tag = strtolower($matches[2]);
	}

	$csv = array_map('str_getcsv', file($csvFile));
	$words = array();
	foreach ($csv as $wordArray) {
		if ($wordArray[0]) {
			$words[] = mb_convert_encoding($wordArray[0], 'UTF-8', 'UTF-8');
		}
	}

	addWords($words);

	if ($tag) {
		addTag($tag);
		tagWords([$tag], $words);
	}

}
