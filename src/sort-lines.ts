var vscode = require('vscode');

function sortActiveSelection(algorithm, removeDuplicateValues) {
  var textEditor = vscode.window.activeTextEditor;
  var selection = textEditor.selection;
  if (selection.isSingleLine) {
    return;
  }
  sortLines(textEditor, selection.start.line, selection.end.line, algorithm, removeDuplicateValues);
}

function sortLines(textEditor, startLine, endLine, algorithm, removeDuplicateValues) {
  var lines = [];
  for (var i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }
  lines.sort(algorithm);

  if (removeDuplicateValues) {
    lines = getUniqueArray(lines, algorithm);
  }

  textEditor.edit(function (editBuilder) {
    var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join("\n"));
  });
}

function getUniqueArray(lines, algorithm) {
  var unique = [];
  for (var i = 0; i < lines.length; ++i) {
    if (unique.length === 0 || (algorithm(unique[unique.length - 1], lines[i])) !== 0) {
      unique.push(lines[i]);
    }
  }
  return unique;
}

function reverseCompare(a, b) {
  if (a.length === b.length) {
    return 0;
  }
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, undefined, {sensitivity: 'base'});
}

function lineLengthCompare(a, b) {
  if (a.length === b.length) {
    return 0;
  }
  return a.length > b.length ? 1 : -1;
}

function lineLengthReverseCompare(a, b) {
  if (a.length === b.length) {
    return 0;
  }
  return a.length > b.length ? -1 : 1;
}

function getVariableCharacters(line) {
  return (line.match(/(.*)=/) || []).pop();
}

function variableLengthCompare(a, b) {
  return getVariableCharacters(a).length > getVariableCharacters(b).length ? 1 : -1;
}

function variableLengthReverseCompare(a, b) {
  return getVariableCharacters(a).length > getVariableCharacters(b).length ? -1 : 1;
}

var intlCollator;
function naturalCompare(a, b) {
  if (!intlCollator) {
    intlCollator = new Intl.Collator(undefined, {numeric:true});
  }
  return intlCollator.compare(a, b);
}

function shuffleCompare() {
  return Math.random() > 0.5 ? 1 : -1;
}

export const sortNormal = sortActiveSelection.bind(null, undefined, false);
export const sortReverse = sortActiveSelection.bind(null, reverseCompare, false);
export const sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare, false);
export const sortCaseInsensitiveUnique = sortActiveSelection.bind(null, caseInsensitiveCompare, true);
export const sortLineLength = sortActiveSelection.bind(null, lineLengthCompare, false);
export const sortLineLengthReverse = sortActiveSelection.bind(null, lineLengthReverseCompare, false);
export const sortVariableLength = sortActiveSelection.bind(null, variableLengthCompare, false);
export const sortVariableLengthReverse = sortActiveSelection.bind(null, variableLengthReverseCompare, false);
export const sortNatural = sortActiveSelection.bind(null, naturalCompare, false);
export const sortUnique = sortActiveSelection.bind(null, undefined, true);
export const sortShuffle = sortActiveSelection.bind(null, shuffleCompare, false);
