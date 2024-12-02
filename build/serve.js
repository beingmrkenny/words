const fs = require("fs-extra");

exports.prepareServeDirectory = () => {
	const fs = require("fs-extra");

	fs.removeSync("serve");
	fs.mkdirp("serve");
	fs.copy("app/favicon.ico", "serve/favicon.ico");
	fs.copySync("data", "serve/data");

	var filesToDelet = [
		"readCSV.php",
		"readJSON.php",
		"db/cret.sql",
		"db/delet.sql",
		"db/fill.sql",
		"db/setup.sh",
	];
	for (let file of filesToDelet) {
		fs.removeSync("./serve/data/" + file);
	}
};

exports.prepareServeDirectory();
