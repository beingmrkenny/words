on run argv

	tell application "Google Chrome"

		if it is running then

			set windowList to every tab of every window whose URL starts with "http://localhost/words"

			repeat with tabList in windowList
				set tabList to tabList as any
				repeat with tabItr in tabList
					tell tabItr to reload
				end repeat
			end repeat

		end if

	end tell

end run
