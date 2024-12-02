const exec = require("child_process").execSync;
const { compileJS } = require("./js");

exports.serveDirectory = () => {
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

exports.serveDirectory();

compileJS();

exec(
	"cp app/index.html serve/index.html && sed -i '' -e \"s/?refresh=today/?refresh=$(echo $RANDOM | md5)/g\" serve/index.html;"
);
exec("sass scss/main.scss serve/words.css");
