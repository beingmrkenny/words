const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs-extra');


function compileCSS () {

	const sass = require('gulp-sass');
	sass.compiler = require('node-sass');

	var options = {
		outputStyle : 'expanded',
		cache : '/tmp/sass-cache'
	};

	return src('scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(options).on('error', sass.logError))
		.pipe(rename('words.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('serve'));
}

function compileJS () {

	// java -jar $googleCompiler --js $input --js_output_file $output --create_source_map $mapfile --warning_level DEFAULT --language_in ECMASCRIPT6_STRICT --language_out ECMASCRIPT5_STRICT;
	// # --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off=checkVars;

	const closureCompiler = require('google-closure-compiler').gulp();

	return src('app/*.js')
		.pipe(sourcemaps.init())
		.pipe(closureCompiler({
			compilation_level: 'SIMPLE_OPTIMIZATIONS',
			warning_level: 'QUIET',
			js_output_file: 'js.js',
			create_source_map: 'js.map'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('serve'));
}

function compileHTML () {

	const hbsAll = require('gulp-handlebars-all');

	return src('app/index.hbs')
		.pipe(hbsAll('html', {
			context: { refresh : Date.now() },
		}))
		.pipe(rename('index.html'))
		.pipe(dest('serve'));
}

function compileAppleScript () {
	const shell = require('gulp-shell');
	return src('.', {read: false})
		.pipe(shell([`osacompile -o ${__dirname}/chrome.scpt ${__dirname}/chrome.applescript`]));
}


function prepareServeDirectory (cb) {
	fs.removeSync('serve');
	fs.mkdirp('serve');
	fs.copy('app/favicon.ico', 'serve/favicon.ico');
	fs.copySync('data', 'serve/data');
	var filesToDelet = [
		'readCSV.php',
		'readJSON.php',
		'db/cret.sql',
		'db/delet.sql',
		'db/fill.sql',
		'db/setup.sh'
	];
	for (let file of filesToDelet) {
		fs.removeSync(__dirname+'/serve/data/' + file);
	}
	if (typeof cb == 'function') {
		cb();
	}
}

function copyServeDirectoryToReleaseFolder (cb) {
	var filesToDelet = [
		'readCSV.php',
		'readJSON.php',
		'db/words.db',
		'db/cret.sql',
		'db/delet.sql',
		'db/fill.sql',
		'db/setup.sh'
	];
	var releaseFolder = process.env.HOME + '/Desktop/words';
	fs.copySync('serve/', releaseFolder);
	for (let file of filesToDelet) {
		fs.removeSync(releaseFolder + '/data/' + file);
	}
	cb();
}


function refreshBrowser () {
	const shell = require('gulp-shell');
	return src('.', {read: false})
		.pipe(shell([`osascript ${__dirname}/chrome.scpt`]));
}

function notifyDone () {
	const notify = require('gulp-notify');
	return src('*.js', {read: false})
		.pipe(notify('Done'));
}


function wordswatch () {
	prepareServeDirectory();
	watch(['scss/*.scss', 'app/*.*'], series(
		compileCSS,
		compileJS,
		compileHTML,
		refreshBrowser,
		notifyDone
	));
}


exports.css = compileCSS;
exports.js = compileJS;
exports.html = compileHTML;
exports.applescript = compileAppleScript;

exports.default = series(prepareServeDirectory, parallel(compileCSS, compileJS, compileHTML) );
exports.watch = series(prepareServeDirectory, compileCSS, compileJS, compileHTML, wordswatch);

exports.release = series(prepareServeDirectory, parallel(compileCSS, compileJS, compileHTML), copyServeDirectoryToReleaseFolder);
