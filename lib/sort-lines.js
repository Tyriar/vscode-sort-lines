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
    lines = getUniqueArray(lines);
  }

  textEditor.edit(function (editBuilder) {
    var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join("\n"));
  });
}

function getUniqueArray(lines) {
  var unique = [];
  for (var i = 0; i < lines.length; ++i) {
    if (unique.length === 0 || (unique[unique.length - 1] !== lines[i])) {
      unique.push(lines[i]);
    }
  }
  return unique;
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, {sensitivity: 'base'});
}

function lineLengthCompare(a, b) {
  return a.length > b.length ? 1 : -1;
}

function lineLengthReverseCompare(a, b) {
  return a.length > b.length ? -1 : 1;
}

function shuffleCompare(a, b) {
  return Math.random() > 0.5 ? 1 : -1;
}

exports.sortNormal = sortActiveSelection.bind(null, undefined, false);
exports.sortReverse = sortActiveSelection.bind(null, reverseCompare, false);
exports.sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare, false);
exports.sortLineLength = sortActiveSelection.bind(null, lineLengthCompare, false);
exports.sortLineLengthReverse = sortActiveSelection.bind(null, lineLengthReverseCompare, false);
exports.sortUnique = sortActiveSelection.bind(null, undefined, true);
exports.sortShuffle = sortActiveSelection.bind(null, shuffleCompare, false);
