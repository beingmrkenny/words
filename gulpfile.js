const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

function compileAllCSS (cb) {

	compileCSS ({
		input: 'scss/main.scss',
		output: 'words.css'
	});

	if (typeof cb == 'function') {
		cb();
	}

}

function compileCSS (parameters) {

	const sass = require('gulp-sass');
	sass.compiler = require('node-sass');

	var options = {
		// sourcemap : true,
		outputStyle : 'expanded',
		loadPath : parameters.loadPath,
		cache : '/tmp/sass-cache'
	};
	if (parameters.loadPath) {
		options.loadPath = parameters.loadPath;
	}
	return src(parameters.input)
		.pipe(sourcemaps.init())
		.pipe(sass(options).on('error', sass.logError))
		.pipe(rename(parameters.output))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('serve'));
}

// java -jar $googleCompiler --js $input --js_output_file $output --create_source_map $mapfile --warning_level DEFAULT --language_in ECMASCRIPT6_STRICT --language_out ECMASCRIPT5_STRICT;
// # --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off=checkVars;

function compileJS () {
	const closureCompiler = require('gulp-closure-compiler');

	return src('app/*.js')
		.pipe(sourcemaps.init())
		.pipe(closureCompiler({
			compilerPath: '/Users/mkenny/java/closure-compiler.jar',
			compilationLevel: 'ADVANCED_OPTIMIZATIONS',
			jscompOff: 'checkVars',
			fileName: 'js.js',
			createSourceMap: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('serve'));
}

function serve () {

	const fs = require('fs-extra');
	const hbsAll = require('gulp-handlebars-all');

	fs.mkdirp('serve');
	fs.copy('favicon.ico', 'serve/favicon.ico');
	fs.copy('data', 'serve/data');

	return src('app/index.hbs')
		.pipe(hbsAll('html', {
			context: { refresh : Date.now() },
		}))
		.pipe(rename('index.html'))
		.pipe(dest('serve'));
}

// async function refresh () {
//
// 	const notify = require('node-notify');
// 	const shell = require('gulp-shell');
//
// 	watch(['scss/*.scss'], function() {
// 		compileAllCSS();
// 		notify('Done');
// 		return src('*.js', {read: false})
// 			.pipe(shell([`osascript ${__dirname}/bruesers.scpt`]));
// 	});
//
// }

exports.css = compileAllCSS;
exports.js = compileJS;
exports.default = parallel(compileAllCSS, compileJS, serve);
