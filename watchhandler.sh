DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

source $DIR/wirts.sh;

wirtscompile;

command -v terminal-notifier >/dev/null 2>&1;
if [[ "$?" == 0 ]]; then
	# To get notified on macOS when this runs, install the terminal-notifier gem for ruby:
	# sudo gem install terminal-notifier
	terminal-notifier -title "File watch completed" -message "Wirts" -timeout 1
fi

command -v osascript >/dev/null 2>&1;
if [[ "$?" == 0 && $refreshOnWatch == true ]]; then
	# To get chrome to refresh automatically via macOS's AppleScript
	osascript $DIR/bruesers.scpt $openOptionsOnRefresh $extensionKey;
fi
