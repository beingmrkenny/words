<?php

function sendAsJSON($data) {
	$json = json_encode($data);
	if (json_last_error() == JSON_ERROR_NONE) {
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		echo $json;
	}
}
