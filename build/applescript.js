const exec = require("child_process").execSync;

exports.compileAppleScript = () => {
	exec(
		"osacompile -o chrome.scpt build/chrome.applescript"
	);
};

exports.compileAppleScript();
