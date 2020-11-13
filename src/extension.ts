/**
    Copyright 2020 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */
import * as vscode from 'vscode';
import * as childProcess from 'child_process';

/**
 * Runs google-java-format on a file and returns the newly formatted code as a
 * `vscode.TextEdit` against the original file contents.
 */
function runJavaFormat(input: any, token: any, editRange?: vscode.Range) {
    const args = ['--aosp'];
    if (editRange) {
        args.push(`--lines=${editRange.start.line}:${editRange.end.line}`);
    }
    args.push('-');
    return new Promise((resolve, reject) => {
        var _a;
        const proc = childProcess.execFile(
            'google-java-format', args, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stdout);
                }
        });
        if (token) {
            token.onCancellationRequested(() => {
                proc.kill();
            });
        }
        (_a = proc.stdin) === null || _a === void 0 ? void 0 : _a.end(input);
    });
}
class Formatter {
    diags: vscode.DiagnosticCollection;
    constructor() {
        this.diags =
            vscode.languages.createDiagnosticCollection('google-java-format');
    }
    provideDocumentFormattingEdits(document: any, options: any, token: any) {
        return this.runFormatter(document, token);
    }
    provideDocumentRangeFormattingEdits(document: any, range: vscode.Range, options: any, token: any) {
        return this.runFormatter(document, token, range);
    }
    runFormatter(document: any, token: any, range?: vscode.Range) {
        this.diags.clear();  // Clear away any left-over errors from an earlier run.
        const input = document.getText();
        return runJavaFormat(input, token, range)
            .then(formatted => {
                const wholeFileRange = new vscode.Range(
                    document.positionAt(0), document.positionAt(input.length));
                return [vscode.TextEdit.replace(wholeFileRange, formatted as string)];
            })
            .catch((err) => {
                throw err;
            });
    }
}
/**
 * Registers google-java-format as the Java formatter when a Java file is
 * loaded.
 */
function registerFormatter() {
    const editProvider = new Formatter();
    const documentFilter = {
        language: 'java',
        scheme: 'file',
    };
    return vscode.Disposable.from(
        vscode.languages.registerDocumentFormattingEditProvider(
            documentFilter, editProvider),
        vscode.languages.registerDocumentRangeFormattingEditProvider(
            documentFilter, editProvider));
}
/** Called when the extension is activated. */
function activate(context: any) {
    context.subscriptions.push(registerFormatter());
}
exports.activate = activate;
