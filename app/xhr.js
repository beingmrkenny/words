function eddyt (action, ...args) {

	var success, fail, data, url = `action=${action}`, words = [];

	for (let arg of args) {
		if (typeof arg == 'function' && typeof success == 'undefined') {
			success = arg;
		} else if (typeof arg == 'function' && typeof success != 'undefined') {
			fail = arg;
		} else {
			data = arg;
		}
	}

	if (typeof data != 'undefined') {
		for (let name in data) {

			if (typeof data[name] == 'string') {
				url += `&${name}=${data[name]}`;
			} else {
				for (let item of data[name]) {
					if (name == 'words') {
						words.push(item);
					}
					url += `&${name}[]=${item}`;
				}
			}

		}
	}

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/words/data/eddyt.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.addEventListener("readystatechange", function() {
		if (this.status == 200) {
			if (this.readyState == XMLHttpRequest.DONE) {
				try {
					success(JSON.parse(xhr.response));
				} catch (wee) {
					console.log(wee);
				}
			}
		}
	});

	xhr.send(url);

}
