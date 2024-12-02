const fs = require("fs-extra");

exports.copyServeDirectoryToReleaseFolder = () => {
	var filesToDelet = [
		"readCSV.php",
		"readJSON.php",
		"db/words.db",
		"db/cret.sql",
		"db/delet.sql",
		"db/fill.sql",
		"db/setup.sh",
	];
	var releaseFolder = process.env.HOME + "/Desktop/words";
	fs.copySync("serve/", releaseFolder);
	for (let file of filesToDelet) {
		fs.removeSync(releaseFolder + "/data/" + file);
	}
};

exports.copyServeDirectoryToReleaseFolder();
