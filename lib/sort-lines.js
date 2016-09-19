var vscode = require('vscode');

function sortActiveSelection(algorithm, removeDuplicateValues, trim) {
  var textEditor = vscode.window.activeTextEditor;
  var selection = textEditor.selection;
  if (selection.isSingleLine) {
    return;
  }
  sortLines(textEditor, selection.start.line, selection.end.line, algorithm, removeDuplicateValues, trim);
}

function sortLines(textEditor, startLine, endLine, algorithm, removeDuplicateValues, trim) {
  var lines = [];
  for (var i = startLine; i <= endLine; i++) {
    var text = textEditor.document.lineAt(i).text;
    if(trim)
      text = text.trim();
    lines.push(text);
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

exports.sortNormal = sortActiveSelection.bind(null, undefined, false, false);
exports.sortReverse = sortActiveSelection.bind(null, reverseCompare, false, false);
exports.sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare, false, false);
exports.sortUnique = sortActiveSelection.bind(null, undefined, true, false);
exports.sortTrimUnique = sortActiveSelection.bind(null, undefined, true, true);
