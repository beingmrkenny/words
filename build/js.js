const fs = require("fs-extra");
const ClosureCompiler = require("google-closure-compiler").compiler;
const exec = require("child_process").execSync;

exports.compileJS = () => {
	const globs = [
		"app/*.js",
	];

	const closureCompiler = new ClosureCompiler({
		js: globs,
		warning_level: "QUIET",
		js_output_file: "serve/words.js",
		create_source_map: "serve/words.js.map",
	});

	closureCompiler.run((exitCode, stdOut, stdErr) => {
		console.log(exitCode);
		console.log(stdOut);
		console.log(stdErr);
		fs.appendFileSync("serve/words.js", "//# sourceMappingURL=words.js.map");
		const sourcemap = JSON.parse(fs.readFileSync("serve/words.js.map"));
		sourcemap.sources.forEach(
			(item, i) => (sourcemap.sources[i] = `../${item}`)
		);
		fs.writeFileSync("serve/words.js.map", JSON.stringify(sourcemap));
		exec("say beep");
	});
};

exports.compileJS();
