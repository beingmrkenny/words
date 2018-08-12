<?php

require_once 'http.inc';
require_once 'read.inc';

$spint = array();

foreach (getTags() as $tag) {
	$spint[] = array (
		'tag' => $tag,
		'words' => getWordsForTag($tag)
	);
}

$spint[] = array(
	'tag' => null,
	'words' => getUntaggedWords()
);

sendAsJSON($spint);
