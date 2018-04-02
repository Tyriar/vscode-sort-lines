import * as vscode from 'vscode';

type SortingAlgorithm = (a: string, b: string) => number;

function sortActiveSelection(algorithm: SortingAlgorithm, removeDuplicateValues: boolean): void {
  const textEditor = vscode.window.activeTextEditor;
  const selection = textEditor.selection;
  if (selection.isSingleLine) {
    return;
  }
  sortLines(textEditor, selection.start.line, selection.end.line, algorithm, removeDuplicateValues);
}

function sortLines(textEditor: vscode.TextEditor, startLine: number, endLine: number, algorithm: SortingAlgorithm, removeDuplicateValues: boolean): void {
  const lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }
  lines.sort(algorithm);

  if (removeDuplicateValues) {
    removeDuplicates(lines, algorithm);
  }

  textEditor.edit(editBuilder => {
    const range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join('\n'));
  });
}

function removeDuplicates(lines: string[], algorithm: SortingAlgorithm): void {
  for (let i = 1; i < lines.length; ++i) {
    if (algorithm(lines[i - 1], lines[i]) === 0) {
      lines.splice(i, 1);
      i--;
    }
  }
}

function reverseCompare(a: string, b: string): number {
  if (a.length === b.length) {
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
  if (a.length === b.length) {
    return 0;
  }
  return a.length > b.length ? -1 : 1;
}

function variableLengthCompare(a: string, b: string): number {
  return getVariableCharacters(a).length > getVariableCharacters(b).length ? 1 : -1;
}

function variableLengthReverseCompare(a: string, b: string): number {
  return getVariableCharacters(a).length > getVariableCharacters(b).length ? -1 : 1;
}

let intlCollator: Intl.Collator;
function naturalCompare(a: string, b: string): number {
  if (!intlCollator) {
    intlCollator = new Intl.Collator(undefined, {numeric: true});
  }
  return intlCollator.compare(a, b);
}

function shuffleCompare(): number {
  return Math.random() > 0.5 ? 1 : -1;
}

function getVariableCharacters(line: string): string {
  return (line.match(/(.*)=/) || []).pop();
}

export const sortNormal = () => sortActiveSelection(undefined, false);
export const sortReverse = () => sortActiveSelection(reverseCompare, false);
export const sortCaseInsensitive = () => sortActiveSelection(caseInsensitiveCompare, false);
export const sortCaseInsensitiveUnique = () => sortActiveSelection(caseInsensitiveCompare, true);
export const sortLineLength = () => sortActiveSelection(lineLengthCompare, false);
export const sortLineLengthReverse = () => sortActiveSelection(lineLengthReverseCompare, false);
export const sortVariableLength = () => sortActiveSelection(variableLengthCompare, false);
export const sortVariableLengthReverse = () => sortActiveSelection(variableLengthReverseCompare, false);
export const sortNatural = () => sortActiveSelection(naturalCompare, false);
export const sortUnique = () => sortActiveSelection(undefined, true);
export const sortShuffle = () => sortActiveSelection(shuffleCompare, false);
