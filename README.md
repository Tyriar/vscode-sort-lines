# Functionality

Sort lines of text in Visual Studio Code. The following types of sorting are supported:

| Command | Title | Comments
|---|---|---|
| sortLines.sortLines | Sort lines (ascending, case sensitive) | Keybound to F9\*
| sortLines.sortLinesCaseInsensitive | Sort lines (ascending, case insensitive) |
| sortLines.sortLinesCaseInsensitiveUnique | Sort lines (unique ascending, case insensitive) |
| sortLines.sortLinesReverse | Sort lines (descending, case sensitive) | Reverse character code based sort
| sortLines.sortLinesLineLength | Sort lines (line length ascending) |
| sortLines.sortLinesLineLengthReverse | Sort lines (line length descending) |
| sortLines.sortLinesVariableLength | Sort lines (variable length ascending) |
| sortLines.sortLinesVariableLengthReverse | Sort lines (variable length descending) |
| sortLines.sortLinesNatural | Sort lines (natural) | Sorts alphabetically but groups multi-digit numbers ([Wikipedia](https://en.wikipedia.org/wiki/Natural_sort_order))
| sortLines.sortLinesUnique | Sort lines (unique ascending, case sensitive) | Regular character code keeping only unique items
| sortLines.sortLinesShuffle | Sort lines (shuffle) |
| sortLines.removeDuplicateLines | Sort lines (remove duplicate lines)

\* *Note that this overrides the toggle breakpoint keybinding, you can unbind it by adding this to your `keybindings.json` file:*

    `{ "key": "f9", "command": "-sortLines.sortLines", "when": "editorTextFocus" }`

# Settings

| Name | Description | Default
|---|---|---|
| sortLines.filterBlankLines | _(boolean)_ Filter out blank (empty or whitespace-only) lines. | false
| sortLines.sortEntireFile | _(boolean)_ Sort entire file if no selection is active. | false

# Install

1. Open VS Code
2. Press F1
3. Type "install"
4. Select "Extensions: Install Extension".
5. Select sort-lines from the list

![Install animation](images/install-animation.gif)

# Usage

Select the lines to sort, press F1 type sort and select the desired sort. The regular sort has the default hotkey F9.

![Usage animation](images/usage-animation.gif)
