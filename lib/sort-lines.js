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
  var doUnique = (typeof(algorithm) == "boolean" && algorithm);
  lines.sort(doUnique ? undefined : algorithm);
  if (doUnique) {
    var linesUnique = [];
    for (var i = 0; i < lines.length; ++i) {
      if (linesUnique.length == 0 ||
         (linesUnique[linesUnique.length-1] !== lines[i])) {
        linesUnique.push(lines[i]);
      }
    }
    lines = linesUnique;
  }
  textEditor.edit(function (editBuilder) {
    var range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join("\n"));
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
exports.sortUnique = sortActiveSelection.bind(null, true);
