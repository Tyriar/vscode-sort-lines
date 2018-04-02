import * as vscode from 'vscode';
import * as sortLines from './sort-lines';

export function activate(context: vscode.ExtensionContext): void {
  const commands = [
    vscode.commands.registerCommand('sortLines.sortLines', sortLines.sortNormal),
    vscode.commands.registerCommand('sortLines.sortLinesReverse', sortLines.sortReverse),
    vscode.commands.registerCommand('sortLines.sortLinesCaseInsensitive', sortLines.sortCaseInsensitive),
    vscode.commands.registerCommand('sortLines.sortLinesCaseInsensitiveUnique', sortLines.sortCaseInsensitiveUnique),
    vscode.commands.registerCommand('sortLines.sortLinesLineLength', sortLines.sortLineLength),
    vscode.commands.registerCommand('sortLines.sortLinesLineLengthReverse', sortLines.sortLineLengthReverse),
    vscode.commands.registerCommand('sortLines.sortLinesVariableLength', sortLines.sortVariableLength),
    vscode.commands.registerCommand('sortLines.sortLinesVariableLengthReverse', sortLines.sortVariableLengthReverse),
    vscode.commands.registerCommand('sortLines.sortLinesNatural', sortLines.sortNatural),
    vscode.commands.registerCommand('sortLines.sortLinesUnique', sortLines.sortUnique),
    vscode.commands.registerCommand('sortLines.sortLinesShuffle', sortLines.sortShuffle)
  ];

  commands.forEach(command => context.subscriptions.push(command));
}
