<?php

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

$json = json_encode($spint);

if (json_last_error() == JSON_ERROR_NONE) {
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');
	echo $json;
}
