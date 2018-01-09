<?php

require_once '../common.inc';
require_once 'db/connect.inc';
require_once 'db/write.inc';

$JSONString = '["tavern","magpie","tabernacle","maggot","drink","Norsemen","skeleton","speed","retard","graze","bastard","coax","hoax","silly","Neodymium","crypt","tamper","tampon","stove","shick","snup","vermillion","pool","cabinet","cabernet","nail","salope","slut","trollope","trolley","wicked","sinister","otherwise","swine","wine","twine","eye","etymon","נֶ֫פֶשׁ","tangerine","jasmine","mine","pith","pit","quelque","bastard","bâtarde","woman","profane","profanity","women","pleb","pledge","scratch","fart","trump","brass","copper","pewter","iron","gross","grocer","gubbins","shupe","combat","bat","cum","nuisance","shop","shoeshop","fork","accrue","execrable","curse","spike","noxious","queue","naieve","waft","raft","float"]';

addWords(json_decode($JSONString));
