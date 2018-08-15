<?php

require_once 'http.inc';
require_once 'write.inc';

switch ($_POST['action']) {

	case 'fave':
		toggleFaveWords ($_POST['words']);
		break;

	case 'edit-tag':
		editTag ($_POST['tag'], $_POST['newTag']);
		break;

	case 'tags':
		tagWords ($_POST['tagsToAdd'], $_POST['words']);
		detagWords ($_POST['tagsToRemove'], $_POST['words']);
		break;

	case 'delete':
		deleteWords ($_POST['words']);
		break;

}
