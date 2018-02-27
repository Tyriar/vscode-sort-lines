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

// Implementation from http://www.davekoelle.com/alphanum.html
function alphanum(a, b) {
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}

// Implementation from http://www.davekoelle.com/alphanum.html
function alphanumCaseInsensitive(a, b) {
  function chunkify(t) {
    var tz = [], x = 0, y = -1, n = 0, i, j;

    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a.toLowerCase());
  var bb = chunkify(b.toLowerCase());

  for (x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}

exports.sortNormal = sortActiveSelection.bind(null, undefined, false);
exports.sortReverse = sortActiveSelection.bind(null, reverseCompare, false);
exports.sortCaseInsensitive = sortActiveSelection.bind(null, caseInsensitiveCompare, false);
exports.sortLineLength = sortActiveSelection.bind(null, lineLengthCompare, false);
exports.sortLineLengthReverse = sortActiveSelection.bind(null, lineLengthReverseCompare, false);
exports.sortUnique = sortActiveSelection.bind(null, undefined, true);
exports.sortShuffle = sortActiveSelection.bind(null, shuffleCompare, false);
exports.sortAlphanumeric = sortActiveSelection.bind(null, alphanum, false);
exports.sortAlphanumericCaseInsensitive = sortActiveSelection.bind(null, alphanumCaseInsensitive, false);
