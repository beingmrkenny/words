DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

wirtsDir=$(jq -r .wirtsDir $DIR/config.json);
refreshOnWatch=$(jq -r .refreshOnWatch $DIR/config.json);
scssCompressionStyle=$(jq -r .scssCompressionStyle $DIR/config.json);
googleCompiler=$(jq -r .googleCompiler $DIR/config.json);

wirtswatch () {
	cd $wirtsDir;
	wirtscompile && fswatch -0xvo -l 1 "$wirtsDir" -e '\.db' -e '\/serve' -e '\.git' -e '\.scpt' -e '\.sh' | xargs -0 -n1 -I {} $wirtsDir/watchhandler.sh {};
}

wirtsrelease () {

	# cd $wirtsDir;

	spit 'aint nowt to do';
}

wirtscompile () {

	cd $wirtsDir;

	local release='';
	if [[ -n $1 ]]; then
		release='release';
	fi

	wirtscss;

	osacompile -o $wirtsDir/bruesers.scpt $wirtsDir/bruesers.applescript

	compileJs $wirtsDir/app $wirtsDir/serve/js.js;

	cp $wirtsDir/app/index.html $wirtsDir/serve/index.html;
	local refreshString='refresh='$(date +"%s");
	sed -i '' -e "s/refresh=yesplease/$refreshString/" $wirtsDir/serve/index.html;

	if [[ ! -f $wirtsDir/php/data ]]; then
		ln -s $wirtsDir/php/data $wirtsDir/serve/data;
	fi
}

wirtscss () {
	local watch='';
	if [[ "$1" == 'watch' ]]; then
		watch='--watch';
	fi

	local input="$wirtsDir"/scss/main.scss;
	local output="$wirtsDir"/serve/wirts.css;
	local loadPath="$wirtsDir"/scss/;
	sass $watch "$input:$output" --sourcemap=none --style=$scssCompressionStyle --load-path="$loadPath" --cache=/tmp/sass-cache
}

getJSFilesInDirectory() {
	local dir=$1;
	# local allfiles=$(find $dir -name "*.js" -not -regex ".*/pages/.*" | sort -r -f);
	local allfiles=$(find $dir -name "*.js" | sort -r -f);
	allfiles=$(echo "$allfiles"|tr '\n' ' ');
	echo "$allfiles";
}

compileJs () {

	local input=$1;
	local output=$2;
	local return;
	local inputList;

	if [[ -d $input ]]; then
		inputList=$(getJSFilesInDirectory "$input");
	elif [[ -f $input ]]; then
		inputList="$input";
	else
		spit 'Input is invalid';
		return 1;
	fi

	if [[ -z $output ]]; then
		output=$(echo $input | sed 's/.js/.min.js/');
	fi

	java -jar $googleCompiler --js $inputList --js_output_file $output --warning_level DEFAULT --language_in ECMASCRIPT6_STRICT --language_out ECMASCRIPT5_STRICT;
	# java -jar $googleCompiler --js $inputList --js_output_file $output --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --jscomp_off=checkVars;
	result="$?";

	if [[ $result == 0 ]]; then
		color "js done" green;
		notify "js 🤖";
		printf "\n";
	else
		color "There was an error ($result)" red;
		notify "js 👺";
	fi
}
