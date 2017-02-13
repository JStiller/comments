var vscode = require('vscode');

function activate(context) {
    let count = 0;
    const files = new Map();
    const statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusbar.text = '$(comment) 0 / 0';
    // statusbar.command = 'extension.sayHello';
    statusbar.tooltip = 'Aufgaben';
    statusbar.color = '#FFFFFF';
    statusbar.show();

    var disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        searchFor(event.document.uri);
    }));

    function findFiles() {
        vscode.workspace.findFiles('**/*.*', '', 1000).then((uris) => {
            if(uris.length === 0) {

            } else {
                uris.forEach(function(file) {
                    searchFor(file);
                }, this);
            }
        });
    }

    function getCount() {
        return Array.from(files.values()).reduce(function(a, b) {
            return a + b;
        }, 0)
    }

    function getCountOf(fileURI) {
        if(files.has(fileURI)) {
            return files.get(fileURI)
        }

        return 0;
    }

    function searchFor(file) {
        vscode.workspace.openTextDocument(file).then((openedFile) => {
            let fileContent = openedFile.getText();
            let matches = fileContent.match(/@todo/igm);
            if(matches !== null) {
                files.set(openedFile.uri.toString(), matches.length);
            } else {
                files.set(openedFile.uri.toString(), 0);
            }
            statusbar.text = '$(comment) ' + getCount() + ' / ' + getCountOf(vscode.window.activeTextEditor.document.uri.toString());
        });
    }

    findFiles();

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;