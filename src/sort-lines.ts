import * as vscode from 'vscode';

type ArrayTransformer = (lines: string[]) => string[];
type SortingAlgorithm = (a: string, b: string) => number;

function makeSorter(algorithm?: SortingAlgorithm): ArrayTransformer {
  return function (lines: string[]): string[] {
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

  let endLine = selection.end.line

  // Ignore unselected last line
  if (selection.end.character == 0 && vscode.workspace.getConfiguration('sortLines').get('ignoreUnselectedLastLine') === true) {
    endLine -= 1
  }
  return sortLines(textEditor, selection.start.line, endLine, transformers);
}

function sortByMarkedRanges(): Thenable<boolean> | undefined {
  const window = vscode.window;
  const textEditor = window.activeTextEditor;

  if (!textEditor) {
    return undefined;
  }

  // class to save the ranges that are to be sorted
  class SortableLines {
    lines: string[] = [];
    startLine: number;
    endLine: number;
    transformers: ArrayTransformer[];
    constructor(startLine: number, endLine: number, transformers: ArrayTransformer[]) {
      this.startLine = startLine;
      this.endLine = endLine;
      this.transformers = transformers;
    }
  }
  let sortableLines: SortableLines[] = [];


  // the line the currently tracked range starts at
  let startLine: number | null = null;
  // the matched modifier the start of the currently tracked range
  let startMatch: [string, ArrayTransformer[]] | null = null;
  // the matched modifier for the currently inspected line
  let currentMatch: [string, ArrayTransformer[]] | null = null;
  const transformersSequencesKeyValues = Object.entries(transformerSequences);
  // iterate through the file and look for marked ranges
  for (let currentLine = 0; currentLine < textEditor.document.lineCount; currentLine++) {
    const line = textEditor.document.lineAt(currentLine);
    currentMatch = null;
    for (const keyValue of transformersSequencesKeyValues) {
      if (line.text.match(new RegExp(`${keyValue[0]} |${keyValue[0]}$`))) {
        if (currentMatch !== null) {
          window.showErrorMessage("multple sorting specifiers at line " + currentLine);
          startLine = null;
          break;
        }
        currentMatch = keyValue;
      }
    }
    if (currentMatch !== null) {
      console.log("match at line " + currentLine + " : " + currentMatch);
      // only match if start is a separate word
      if (line.text.match(/start | start/)) {
        // complain for nested sorting ranges
        if (startLine !== null) {
          window.showErrorMessage("nested sorting ranges at lines "
            + startLine + " and " + currentLine);
        }
        console.log("start found: ", currentLine)
        startMatch = currentMatch;
        startLine = currentLine + 1;
      }
      // only match if end is a separate word
      else if (line.text.match(/end | end/)) {
        // complain for ends without a start (will also complain for nested sorting ranges)
        if (startLine === null || startMatch === null) {
          window.showErrorMessage("unmatched sorting range end specifier at line " + currentLine);
        }
        // complain for mismatched types of sorting
        else if (currentMatch[0] !== startMatch[0]) {
          window.showErrorMessage("mismatched sorting modifier '" + startMatch[0]
            + "' for start at  " + startLine + " and '" + currentMatch[0]
            + "' end at " + currentLine);
        } else {
          console.log("end found: ", currentLine);
          let index = sortableLines.length;
          sortableLines.push(new SortableLines(startLine, currentLine, currentMatch[1]));
          for (let i = startLine; i < currentLine; i++) {
            sortableLines[index].lines.push(textEditor.document.lineAt(i).text);
          }
          startLine = null;
          startMatch = null;
        }
      } else {
        window.showErrorMessage("found sorting modifier, but neither start nor end to signify a range at line " + currentLine);
      }

    }
  }
  // complain if there is an unclosed range at the end
  if (startLine !== null) {
    window.showErrorMessage("found no end for sorting range started at line " + startLine);
  }

  // create return the resulting edit
  return textEditor.edit(editBuilder => {
    sortableLines.forEach(element => {
      element.lines = element.transformers.reduce((currentLines, transform) => transform(currentLines), element.lines);
      const range = new vscode.Range(element.startLine, 0, element.endLine - 1, textEditor.document.lineAt(element.endLine).text.length);
      editBuilder.replace(range, element.lines.join('\n'));
    });
  });
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

function keepOnlyDuplicates(lines: string[]): string[] {
  return Array.from(new Set(lines.filter((element, index, array) => array.indexOf(element) !== index)));
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
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function lineLengthCompare(a: string, b: string): number {
  // Use Array.from so that multi-char characters count as 1 each
  const aLength = Array.from(a).length;
  const bLength = Array.from(b).length;
  if (aLength === bLength) {
    return 0;
  }
  return aLength > bLength ? 1 : -1;
}

function lineLengthReverseCompare(a: string, b: string): number {
  return lineLengthCompare(a, b) * -1;
}

function variableLengthCompare(a: string, b: string): number {
  return lineLengthCompare(getVariableCharacters(a), getVariableCharacters(b));
}

function variableLengthReverseCompare(a: string, b: string): number {
  return variableLengthCompare(a, b) * -1;
}

let intlCollator: Intl.Collator;
function naturalCompare(a: string, b: string): number {
  if (!intlCollator) {
    intlCollator = new Intl.Collator(undefined, { numeric: true });
  }
  return intlCollator.compare(a, b);
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
  removeDuplicateLines: [removeDuplicates],
  keepOnlyDuplicateLines: [keepOnlyDuplicates]
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
export const keepOnlyDuplicateLines = () => sortActiveSelection(transformerSequences.keepOnlyDuplicateLines);

export const rangeSortNormal = () => sortByMarkedRanges();
