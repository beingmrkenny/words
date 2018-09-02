WRDSDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

function lc(){
    echo $1 | tr '[:upper:]' '[:lower:]';
}

# Send the Apple notifications system a message from the CLI (useful for scripts)
function notify() {
    # $1 message
    # $2 title
    # $3 subtitle
    osascript -e "display notification \"$2\" with title \"$1\" subtitle \"$3\"";
}

function color() {

    local text=$1;
    local color=$(lc $2);
    local colorCode='';

    case "$color" in
        black)       colorCode='\e[0;30m'; ;;
        blue)        colorCode='\e[0;34m'; ;;
        green)       colorCode='\e[0;32m'; ;;
        cyan)        colorCode='\e[0;36m'; ;;
        red)         colorCode='\e[0;31m'; ;;
        purple)      colorCode='\e[0;35m'; ;;
        brown)       colorCode='\e[0;33m'; ;;
        lightgray)   colorCode='\e[0;37m'; ;;
        darkgray)    colorCode='\e[1;30m'; ;;
        lightblue)   colorCode='\e[1;34m'; ;;
        lightgreen)  colorCode='\e[1;32m'; ;;
        lightcyan)   colorCode='\e[1;36m'; ;;
        lightred)    colorCode='\e[1;31m'; ;;
        lightpurple) colorCode='\e[1;35m'; ;;
        yellow)      colorCode='\e[1;33m'; ;;
        white)       colorCode='\e[1;37m'; ;;
    esac

    printf "\n$colorCode$text\e[1;37m\n\n";
}

source $WRDSDIR/words.sh;

wordscompile;

command -v terminal-notifier >/dev/null 2>&1;
if [[ "$?" == 0 ]]; then
	# To get notified on macOS when this runs, install the terminal-notifier gem for ruby:
	# sudo gem install terminal-notifier
	terminal-notifier -title "File watch completed" -message "words" -timeout 1
fi
