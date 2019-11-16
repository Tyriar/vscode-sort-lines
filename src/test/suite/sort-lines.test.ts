import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { commands, window, Range, Selection, Uri, TextDocument, TextEditor } from 'vscode';

function selectAllText(editor: TextEditor): void {
  const selection = new Selection(0, 0, editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length);
  editor.selection = selection;
}

function getAllText(document: TextDocument): string {
  return document.getText(new Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length));
}

const fixtureDir = path.join(__dirname, '../../../fixtures');
const fixtures = fs.readdirSync(fixtureDir).filter(v => v.search('_fixture$') !== -1).map(f => f.replace('_fixture', ''));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json'), 'utf8'));
const extCommands: string[] = packageJson.contributes.commands.map((c: { command: string } | undefined) => {
  if (!c) {
    throw new Error('Command without an id encountered');
  }
  return c.command.replace('sortLines.', '');
});
const expectedExists: { [fixture: string]: { [command: string]: boolean } } = {};

Math.random = function(): 0.9 { return 0.9; };

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
              commands.executeCommand(`sortLines.${extCommand}`).then(() => {
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
