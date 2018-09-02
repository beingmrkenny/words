WRDSDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

wordsDir=$(jq -r .wordsDir $WRDSDIR/config.json);
refreshOnWatch=$(jq -r .refreshOnWatch $WRDSDIR/config.json);
scssCompressionStyle=$(jq -r .scssCompressionStyle $WRDSDIR/config.json);
googleCompiler=$(jq -r .googleCompiler $WRDSDIR/config.json);

alias ww="wordswatch";

wordswatch () {
	cd $wordsDir;
	wordscompile && fswatch -0xvo -l 1 "$wordsDir" -e '\/data\/' -e '\.db' -e '\/serve' -e '\.git' -e '\.scpt' -e '\.sh' | xargs -0 -n1 -I {} $wordsDir/watchhandler.sh {};
}

wordsrelease () {
	# cd $wordsDir;
	echo 'aint nowt to do';
}

wordscompile () {

	cd $wordsDir;

	local release='';
	if [[ -n $1 ]]; then
		release='release';
	fi

	wordscss;

	color 'css done' green;

	osacompile -o $wordsDir/bruesers.scpt $wordsDir/bruesers.applescript

	compileJs;

	cp $wordsDir/app/index.html $wordsDir/serve/index.html;
	local refreshString='refresh='$(date +"%s");
	sed -i '' -e "s/refresh=yesplease/$refreshString/" $wordsDir/serve/index.html;

	if [[ ! -f $wordsDir/serve/favicon.ico ]]; then
		ln -s $wordsDir/favicon.ico $wordsDir/serve/favicon.ico;
	fi

	if [[ ! -d $wordsDir/serve/data ]]; then
		ln -s $wordsDir/data $wordsDir/serve/data;
	fi

	if [[ $refreshOnWatch == true ]]; then
		osascript $wordsDir/bruesers.scpt
	fi

}

wordscss () {
	local watch='';
	if [[ "$1" == 'watch' ]]; then
		watch='--watch';
	fi

	local input="$wordsDir"/scss/main.scss;
	local output="$wordsDir"/serve/words.css;
	local loadPath="$wordsDir"/scss/;
	sass $watch "$input:$output" --sourcemap=none --style=$scssCompressionStyle --load-path="$loadPath" --cache=/tmp/sass-cache
}

getJSFilesInDirectory() {
	local dir=$1;
	local allfiles=$(find $dir -name "*.js" | sort -r -f);
	allfiles=$(echo "$allfiles"|tr '\n' ' ');
	echo "$allfiles";
}

compileJs () {

	local input=$(getJSFilesInDirectory "$wordsDir/app");
	local output=$wordsDir/serve/js.js;
	local mapfile=$wordsDir/serve/js.map;

	java -jar $googleCompiler --js $input --js_output_file $output --create_source_map $mapfile --warning_level DEFAULT --language_in ECMASCRIPT6_STRICT --language_out ECMASCRIPT5_STRICT;
	# --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off=checkVars;
	result="$?";

	if [[ $result == 0 ]]; then

		echo "//# sourceMappingURL=js.map" >> $output;

		color "js done" green;
		notify "js 🤖";
	else
		color "There was an error ($result)" red;
		notify "js 👺";
	fi

	printf "\n";
}
