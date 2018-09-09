<?php

require_once 'http.inc';
require_once 'write.inc';

switch ($_POST['action']) {

	case 'fave':
		toggleFaveWords ($_POST['words']);
		break;

	case 'edit-word':
		editWord ($_POST['oldSpelling'], $_POST['newSpelling']);
		break;

	case 'edit-tag':
		editTag ($_POST['tag'], $_POST['newTag']);
		break;

	case 'tagging-words':
		if (
			tagWords ($_POST['add'], $_POST['words'])
			|| detagWords ($_POST['remove'], $_POST['words'])
		) {
			$words = array();
			foreach ($_POST['words'] as $word) {
				$words[$word] = [
					'add'    => ( is_array($_POST['add']) )    ? $_POST['add']    : [],
					'remove' => ( is_array($_POST['remove']) ) ? $_POST['remove'] : []
				];
			}
			sendASJson($words);
		}
		break;

	case 'delete':
		deleteWords ($_POST['words']);
		break;

}
