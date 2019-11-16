import * as vscode from 'vscode';

type ArrayTransformer = (lines: string[]) => string[];
type SortingAlgorithm = (a: string, b: string) => number;

function makeSorter(algorithm?: SortingAlgorithm): ArrayTransformer {
  return function(lines: string[]): string[] {
    return lines.sort(algorithm);
  };
}

function sortActiveSelection(transformers: ArrayTransformer[]): Thenable<boolean> | undefined {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return undefined;
  }
  const selection = textEditor.selection;

  if (selection.isEmpty && vscode.workspace.getConfiguration('sortLines').get('sortEntireFile') === true) {
    return sortLines(textEditor, 0, textEditor.document.lineCount - 1, transformers);
  }

  if (selection.isSingleLine) {
    return undefined;
  }
  return sortLines(textEditor, selection.start.line, selection.end.line, transformers);
}

function sortLines(textEditor: vscode.TextEditor, startLine: number, endLine: number, transformers: ArrayTransformer[]): Thenable<boolean> {
  let lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  // Remove blank lines in selection
  if (vscode.workspace.getConfiguration('sortLines').get('filterBlankLines') === true) {
    removeBlanks(lines);
  }

  lines = transformers.reduce((currentLines, transform) => transform(currentLines), lines);

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
  return getVariableCharacters(a).length >= getVariableCharacters(b).length ? 1 : -1;
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

function shuffleCompare(): number {
  return Math.random() >= 0.5 ? 1 : -1;
}

function getVariableCharacters(line: string): string {
  const match = line.match(/(.*)=/);
  if (!match) {
    return line;
  }
  const last = match.pop();
  if (!last) {
    return line;
  }
  return last;
}

function shuffleSorter(lines: string[]): string[] {
    for (let i = lines.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[rand]] = [lines[rand], lines[i]];
    }
    return lines;
}

const transformerSequences = {
  sortNormal: [makeSorter()],
  sortUnique: [makeSorter(), removeDuplicates],
  sortReverse: [makeSorter(reverseCompare)],
  sortCaseInsensitive: [makeSorter(caseInsensitiveCompare)],
  sortCaseInsensitiveUnique: [makeSorter(caseInsensitiveCompare), removeDuplicates],
  sortLineLength: [makeSorter(lineLengthCompare)],
  sortLineLengthReverse: [makeSorter(lineLengthReverseCompare)],
  sortVariableLength: [makeSorter(variableLengthCompare)],
  sortVariableLengthReverse: [makeSorter(variableLengthReverseCompare)],
  sortNatural: [makeSorter(naturalCompare)],
  sortShuffle: [shuffleSorter],
  removeDuplicateLines: [removeDuplicates]
};

export const sortNormal = () => sortActiveSelection(transformerSequences.sortNormal);
export const sortUnique = () => sortActiveSelection(transformerSequences.sortUnique);
export const sortReverse = () => sortActiveSelection(transformerSequences.sortReverse);
export const sortCaseInsensitive = () => sortActiveSelection(transformerSequences.sortCaseInsensitive);
export const sortCaseInsensitiveUnique = () => sortActiveSelection(transformerSequences.sortCaseInsensitiveUnique);
export const sortLineLength = () => sortActiveSelection(transformerSequences.sortLineLength);
export const sortLineLengthReverse = () => sortActiveSelection(transformerSequences.sortLineLengthReverse);
export const sortVariableLength = () => sortActiveSelection(transformerSequences.sortVariableLength);
export const sortVariableLengthReverse = () => sortActiveSelection(transformerSequences.sortVariableLengthReverse);
export const sortNatural = () => sortActiveSelection(transformerSequences.sortNatural);
export const sortShuffle = () => sortActiveSelection(transformerSequences.sortShuffle);
export const removeDuplicateLines = () => sortActiveSelection(transformerSequences.removeDuplicateLines);
