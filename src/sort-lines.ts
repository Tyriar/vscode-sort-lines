import * as vscode from 'vscode';

type SorterFunction = (unsortedLines: string[]) => string[];
type SortingAlgorithm = (a: string, b: string) => number;

function makeSorter(algorithm: SortingAlgorithm): SorterFunction {
  return function(lines: string[]): string[] {
    return lines.sort(algorithm);
  };
}

function sortActiveSelection(sorter: SorterFunction, removeDuplicateValues: boolean): Thenable<boolean> | undefined {
  const textEditor = vscode.window.activeTextEditor;
  const selection = textEditor.selection;

  if (selection.isEmpty && vscode.workspace.getConfiguration('sortLines').get('sortEntireFile') === true) {
    return sortLines(textEditor, 0, textEditor.document.lineCount - 1, sorter, removeDuplicateValues);
  }

  if (selection.isSingleLine) {
    return undefined;
  }
  return sortLines(textEditor, selection.start.line, selection.end.line, sorter, removeDuplicateValues);
}

function sortLines(textEditor: vscode.TextEditor, startLine: number, endLine: number, sorter: SorterFunction, removeDuplicateValues: boolean): Thenable<boolean> {
  let lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  // Remove blank lines in selection
  if (vscode.workspace.getConfiguration('sortLines').get('filterBlankLines') === true) {
    removeBlanks(lines);
  }

  if (sorter) {
    lines = sorter(lines);
  }

  if (removeDuplicateValues) {
    lines = removeDuplicates(lines);
  }

  return textEditor.edit(editBuilder => {
    const range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join('\n'));
  });
}

function removeDuplicates(lines: string[]): string[] {
  return Array.from(new Set(lines));
}

function removeBlanks(lines: string[]): void {
  for (let i = 0; i < lines.length; ++i) {
    if (lines[i].trim() === '') {
      lines.splice(i, 1);
      i--;
    }
  }
}

function reverseCompare(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

function lineLengthCompare(a: string, b: string): number {
  if (a.length === b.length) {
    return 0;
  }
  return a.length > b.length ? 1 : -1;
}

function lineLengthReverseCompare(a: string, b: string): number {
  return lineLengthCompare(a, b) * -1;
}

function variableLengthCompare(a: string, b: string): number {
  return getVariableCharacters(a).length > getVariableCharacters(b).length ? 1 : -1;
}

function variableLengthReverseCompare(a: string, b: string): number {
  return variableLengthCompare(a, b) * -1;
}

let intlCollator: Intl.Collator;
function naturalCompare(a: string, b: string): number {
  if (!intlCollator) {
    intlCollator = new Intl.Collator(undefined, {numeric: true});
  }
  return intlCollator.compare(a, b);
}

function getVariableCharacters(line: string): string {
  const match = line.match(/(.*)=/);
  if (!match) {
    return line;
  }
  return match.pop();
}

function shuffleSorter(lines: string[]): string[] {
    for (let i = lines.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[rand]] = [lines[rand], lines[i]];
    }
    return lines;
}

export const sortNormal = () => sortActiveSelection(makeSorter(undefined), false);
export const sortUnique = () => sortActiveSelection(makeSorter(undefined), true);
export const sortReverse = () => sortActiveSelection(makeSorter(reverseCompare), false);
export const sortCaseInsensitive = () => sortActiveSelection(makeSorter(caseInsensitiveCompare), false);
export const sortCaseInsensitiveUnique = () => sortActiveSelection(makeSorter(caseInsensitiveCompare), true);
export const sortLineLength = () => sortActiveSelection(makeSorter(lineLengthCompare), false);
export const sortLineLengthReverse = () => sortActiveSelection(makeSorter(lineLengthReverseCompare), false);
export const sortVariableLength = () => sortActiveSelection(makeSorter(variableLengthCompare), false);
export const sortVariableLengthReverse = () => sortActiveSelection(makeSorter(variableLengthReverseCompare), false);
export const sortNatural = () => sortActiveSelection(makeSorter(naturalCompare), false);
export const sortShuffle = () => sortActiveSelection(shuffleSorter, false);
export const removeDuplicateLines = () => sortActiveSelection(undefined, true);
