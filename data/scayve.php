<?php
require_once 'write.inc';
$words = preg_split('/[ ,]+/', $_POST['words']);
addWords($words);
