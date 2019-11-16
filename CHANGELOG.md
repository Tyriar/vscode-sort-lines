## 1.9.0

- Update icon to play well with dark backgrounds ([#51](https://github.com/Tyriar/vscode-sort-lines/pull/51)) via [@Pustur](https://github.com/Pustur)
- New context menu item ([#52](https://github.com/Tyriar/vscode-sort-lines/pull/52)) via [@petty](https://github.com/petty)
- Add tests for shuffle sorts ([#56](https://github.com/Tyriar/vscode-sort-lines/pull/56)) via [@merelj](https://github.com/merelj)
- Migrate to GitHub Actions and automate release ([#56](https://github.com/Tyriar/vscode-sort-lines/pull/60), [#61](https://github.com/Tyriar/vscode-sort-lines/pull/61), [#63](https://github.com/Tyriar/vscode-sort-lines/pull/63)) via [@Tyriar](https://github.com/Tyriar)
- Upgrade to TypeScript 3.7, Mocha 6 and new VS Code test framework ([#62](https://github.com/Tyriar/vscode-sort-lines/pull/62)) via [@Tyriar](https://github.com/Tyriar)
- New remove duplicate lines command ([#57](https://github.com/Tyriar/vscode-sort-lines/pull/57)) via [@merelj](https://github.com/merelj)
- Enable TypeScript strict mode ([#64](https://github.com/Tyriar/vscode-sort-lines/pull/64)) via [@Tyriar](https://github.com/Tyriar)
- Make sorts aware of multi-length characters ([#65](https://github.com/Tyriar/vscode-sort-lines/pull/65)) via [@Tyriar](https://github.com/Tyriar)
- Make all commands use stable sorts ([#66](https://github.com/Tyriar/vscode-sort-lines/pull/66)) via [@Tyriar](https://github.com/Tyriar)

## 1.8.0

- Added `sortLines.sortEntireFile` setting (defaults to false) that sorts the entire file when there is no selection [#43](https://github.com/Tyriar/vscode-sort-lines/pull/43) via [@chrsmutti](https://github.com/chrsmutti)

## 1.7.0

- Added `sortLines.filterBlankLines` setting (defaults to false) [#35](https://github.com/Tyriar/vscode-sort-lines/pull/35) via [@SoftwareApe](https://github.com/SoftwareApe)

## 1.6.0

- Added `sortLines.sortLinesVariableLength` and `sortLines.sortLinesVariableLengthReverse` commands to sort by variable length [#30](https://github.com/Tyriar/vscode-sort-lines/pull/30) via [@labithiotis](https://github.com/labithiotis)
- Added `sortLines.sortLinesCaseInsensitiveUnique` command to sort case insensitively and remove duplicates [#29](https://github.com/Tyriar/vscode-sort-lines/pull/29) via [@lynxnake](https://github.com/lynxnake)
  - Convert to TypeScript
  - Add TSLint
  - Add CI
  - Add tests

## 1.5.0

- Added `sortLines.sortLinesNatural` command sort lines alphabetically but group together digits [#26](https://github.com/Tyriar/vscode-sort-lines/pull/26) via [@Gerrit-K](https://github.com/Gerrit-K)
- Remove backtick from install heading [#23](https://github.com/Tyriar/vscode-sort-lines/pull/23) via [@wald-tq](https://github.com/wald-tq)
- Made a note in the README about default keybinding overriding toggle breakpoint [#22](https://github.com/Tyriar/vscode-sort-lines/issues/22) via [@Tyriar](https://github.com/Tyriar)

## 1.4.1

- Added `sortLines.sortLinesLineLengthReverse` command to sort lines by line length (descending) [#21](https://github.com/Tyriar/vscode-sort-lines/pull/21) via [@prplx](https://github.com/prplx)
- Improved clarity of command titles [#20](https://github.com/Tyriar/vscode-sort-lines/pull/20) via [@Eldaw](https://github.com/Eldaw)

## 1.3.0

- Added `sortLines.sortLinesShuffle` command to shuffle lines randomly [#12](https://github.com/Tyriar/vscode-sort-lines/pull/12) via [@mhavas](https://github.com/mhavas).
