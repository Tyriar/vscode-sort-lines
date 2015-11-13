var vscode = require('vscode');

function sortActiveSelection(algorithm) {
  var textEditor = vscode.window.activeTextEditor;
  var selection = textEditor.selection;
  if (selection.isSingleLine) {
    return;
  }
  sortLines(textEditor, selection.start.line, selection.end.line, algorithm);
}

function sortLines(textEditor, startLine, endLine, algorithm) {
  var lines = [];
  for (var i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }
  lines.sort(algorithm);
  textEditor.edit(function (editBuilder) {
    for (var i = startLine; i <= endLine; i++) {
      var line = lines[i - startLine];
      editBuilder.replace(textEditor.document.lineAt(i).range, line);
    }
  });
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, {sensitivity: 'base'});
}

exports.sortNormal = sortActiveSelection.bind(null, undefined);
exports.sortReverse = sortActiveSelection.bind(null, reverseCompare);
exports.sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare);
