var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
	let json = JSON.parse(this.responseText);
	if (json) {
		WordList.displayWords(json);
	} else {
		console.log('JSON done fucked up');
	}
});
xhr.addEventListener("error", function () {
	console.log('XHR done fucked up');
});
xhr.open("GET", "/words/data/get.php");
xhr.send();

q('#AddWord button').addEventListener ('click', Word.save);

var wordInput = q('#AddWord input');
wordInput.addEventListener ('keyup', function (ev) {
	if (ev.key == 'Escape') {
		qid('AddWord').reset();
	}
	WordList.hideyHideyShowyShowy(this.value);
});

for (let button of qq('button')) {
	button.addEventListener('click', System.buttonClickHandler);
}
