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

class GoogleAOSPJavaFormatter {
    provideDocumentFormattingEdits(document, options, token) {
        return this.runFormatter(document, null, token);
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return this.runFormatter(document, range, token);
    }
    runFormatter(document, range, token) {
        this.diag.clear();
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "google-java-format-aosp" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('google-java-format-aosp.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        vscode.languages.registerDocumentFormattingEditProvider({
            language: 'java',
            scheme: 'file',
        }, new GoogleAOSPJavaFormatter());
        vscode.languages.registerDocumentRangeFormattingEditProvider({
            language: 'java',
            scheme: 'file',
        }, new GoogleAOSPJavaFormatter());

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Google Java Format AOSP!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
