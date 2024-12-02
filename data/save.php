<?php
require_once 'write.inc';
$words = preg_split('/\s*,\s*/', $_POST['words']);
addWords($words);
