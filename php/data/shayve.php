<?php
require_once 'write.inc';
$wirts = preg_split('/[ ,]+/', $_POST['wirts']);
addWords($wirts);
