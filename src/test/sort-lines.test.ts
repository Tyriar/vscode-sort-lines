//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { commands, window, Range, Selection, Uri, TextDocument, TextEditor, workspace } from 'vscode';

function selectAllText(editor: TextEditor): void {
  const selection = new Selection(0, 0, editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length);
  editor.selection = selection;
}

function getAllText(document: TextDocument): string {
  return document.getText(new Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length));
}

const fixtureDir = path.join(__dirname, '..', '..', 'fixtures');
const fixtures = fs.readdirSync(fixtureDir).filter(v => v.search('_fixture$') !== -1).map(f => f.replace('_fixture', ''));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));
const nonDeterministicCommands = ['sortLinesShuffle'];
const extCommands: string[] = packageJson.contributes.commands.map(c => c.command.replace('sortLines.', '')).filter(c => nonDeterministicCommands.indexOf(c) === -1);
const expectedExists: { [fixture: string]: { [command: string]: boolean } } = {};

suite('Sort Lines', () => {
  suite('All command fixtures exist', () => {
    fixtures.forEach(fixture => {
      test(fixture, () => {
        expectedExists[fixture] = {};
        extCommands.forEach(extCommand => {
          const exists = fs.existsSync(path.join(fixtureDir, `${fixture}_expected/${extCommand}`));
          expectedExists[fixture][extCommand] = exists;
          assert.ok(exists, `Expected result of fixture ${fixture} for command ${extCommand} does not exist. Create the expected result in fixtures/${fixture}_expected/${extCommand}.`);
        });
      });
    });
  });

  extCommands.forEach(extCommand => {
    suite(extCommand, () => {
      fixtures.forEach(fixture => {
        test(fixture, done => {
          if (!expectedExists[fixture][extCommand]) {
            done(new Error(`Could not find expected text for fixture ${fixture}`));
            return;
          }
          commands.executeCommand('workbench.action.closeActiveEditor').then(() => {
            return window.showTextDocument(Uri.file(path.join(fixtureDir, `${fixture}_fixture`))).then(editor => {
              selectAllText(editor);

              let execution;
              if (fixture === 'preprocess') {
                execution = workspace.getConfiguration('sortLines').update('linePreprocessorRegex', '^[Tt]he (.*)$').then(() => commands.executeCommand(`sortLines.${extCommand}`));
              } else {
                execution = commands.executeCommand(`sortLines.${extCommand}`);
              }

              execution.then(() => {
                const expectedPath = path.join(fixtureDir, `${fixture}_expected/${extCommand}`);
                const expected = fs.readFileSync(expectedPath, 'utf8');
                const actual = getAllText(editor.document);
                if (actual !== expected) {
                  done(Error(`Command output is not expected\n\nExpected:\n${expected}\n\nActual:\n${actual}`));
                } else {
                  done();
                }
              });
            });
          });
        });
      });
    });
  });
});
