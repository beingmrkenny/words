<?php

// FIXME unique constraint fails quite often on this — make sure that words in multiple tags are being tagged regardless of whether the insert words statement fails

require_once 'write.inc';

$csvFiles = glob('../snippets/csv/*.csv');

foreach ($csvFiles as $csvFile) {

	$matches = array();
	preg_match('/([a-z0-9 ]+)-([a-z0-9 ]+)\.csv/i', $csvFile, $matches);

	if ($matches[1] == 'categories') {
		// do something with these later
		break;
	} else if ($matches[1] == 'INBOX') {
		$tag = null;
	} else {
		$tag = strtolower($matches[2]);
	}

	$csv = array_map('str_getcsv', file($csvFile));
	$words = array();
	foreach ($csv as $wordArray) {
		if ($wordArray[0]) {
			$words[] = ($wordArray[0] == 'African') ? $wordArray[0] : strtolower($wordArray[0]);
		}
	}

	addWords($words);
	if ($tag) {
		addTag($tag);
		tagWords([$tag], $words);
	}

}
