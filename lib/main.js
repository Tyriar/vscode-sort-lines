var vscode = require('vscode');
var sortLines = require('./sort-lines');

function activate(context) {
  var commands = [
    vscode.commands.registerCommand('sortLines.sortLines', sortLines.sortNormal),
    vscode.commands.registerCommand('sortLines.sortLinesReverse', sortLines.sortReverse),
    vscode.commands.registerCommand('sortLines.sortLinesCaseInsensitive', sortLines.sortCaseInsensitive),
    vscode.commands.registerCommand('sortLines.sortLinesUnique', sortLines.sortUnique),
    vscode.commands.registerCommand('sortLines.sortLinesTrimUnique', sortLines.sortTrimUnique)
  ];

  commands.forEach(function (command) {
    context.subscriptions.push(command);
  });
}

exports.activate = activate;
