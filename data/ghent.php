<?php

require_once 'http.inc';
require_once 'read.inc';

$what = ($_REQUEST['what']) ? $_REQUEST['what'] : null;

if ($what === 'WordsAndTags') {

	$spint = getWordTagPairsForWords($_POST['words']);

} else {

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

}

sendAsJSON($spint);
