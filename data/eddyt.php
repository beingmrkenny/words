<?php

require_once 'http.inc';
require_once 'write.inc';

$words = $_POST['words'];

switch ($_POST['action']) {

	case 'fave':
		toggleFaveWords ($words);
		break;

	case 'tags':
		$tagsToAdd = $_POST['add'];
		$tagsToRemove = $_POST['remove'];
		$words = $_POST['words'];
		if (count($words) > 0) {
			if (count($tagsToAdd) > 0) {
				tagWords ($tagsToAdd, $words);
			}
			if (count($tagsToRemove) > 0) {
				detagWords ($tagsToRemove, $words);
			}
		}
		break;

	case 'delete':
		deleteWords ($words);
		break;

}
