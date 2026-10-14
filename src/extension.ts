import * as vscode from 'vscode';
import { execFile } from 'child_process';

// 1. Dictionary mapping standard ugly Lua errors to pretty explanations
const errorDictionary: { [key: string]: { title: string; explanation: string; fix: string } } = {
    "attempt to perform arithmetic on a nil value": {
        title: "Math Error (Arithmetic on Nil)",
        explanation: "You tried to perform a math operation (+, -, *, /) using a variable that is empty or hasn't been given a number yet.",
        fix: "Check the variable name. Make sure you initialized it earlier in the script (e.g., local score = 0)."
    },
    "attempt to index a nil value": {
        title: "Table Error (Indexing Nil)",
        explanation: "You tried to read a property or key from a table that doesn't exist.",
        fix: "Ensure the table variable is correctly defined as a table {} before you try to look inside it."
    },
    "attempt to call a nil value": {
        title: "Function Error (Calling Nil)",
        explanation: "You tried to execute a function, but Lua couldn't find it.",
        fix: "Check for spelling mistakes in your function call, or make sure the function is defined *above* where you are calling it."
    }
};

// 2. The parser function that transforms raw error text into clean UI text
function parseLuaError(rawError: string): string {
    const luaErrorRegex = /([\w.-]+):(\d+): ([^(\n]+)(?:\s*(.+))?/;
    const match = rawError.match(luaErrorRegex);

    if (match) {
        const [_, fileName, lineNum, errorMessage, details] = match;
        const trimmedMessage = errorMessage.trim();
        const mappedError = errorDictionary[trimmedMessage];

        if (mappedError) {
            const contextDetail = details ? `\n🔍 Context details: Variable named [ ${details} ]` : '';
            return `
❌ [Pretty Lua] ${mappedError.title}
======================================================================
📍 Location:  File "${fileName}" at Line ${lineNum}
💡 Definition:  ${mappedError.explanation}${contextDetail}

🛠️ How to Fix:
${mappedError.fix}
======================================================================
`;
        }
    }
    return rawError;
}

// 3. Extension lifecycle management
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel("Pretty Lua Errors");

    let disposable = vscode.commands.registerCommand('pretty-lua-errors.runScript', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage("No active text file open!");
            return;
        }

        const filePath = activeEditor.document.fileName;
        outputChannel.clear();
        outputChannel.show(true);
        outputChannel.appendLine(`🚀 Running: ${filePath}...\n`);

        // 🟢 PRODUCTION LOOKUP LOGIC:
        // Fetch setting values from User configuration profile
        const config = vscode.workspace.getConfiguration('prettyLuaErrors');
        let luaExePath = config.get<string>('executablePath') || 'lua';

        // Fall back explicitly to your local user setup if global shorthand defaults fail
        if (luaExePath === 'lua') {
            luaExePath = `C:\\Users\\deboj\\AppData\\Local\\Programs\\Lua\\bin\\lua.exe`;
        }

        // execFile completely bypasses cmd.exe shell string sanitization, avoiding quote failures
        execFile(luaExePath, [filePath], (error, stdout, stderr) => {
            if (stdout) {
                outputChannel.appendLine("--- Standard Output ---");
                outputChannel.appendLine(stdout);
            }

            if (stderr) {
                outputChannel.appendLine("--- System Error Caught ---");
                const beautifulError = parseLuaError(stderr);
                outputChannel.appendLine(beautifulError);
            } else if (error) {
                if (error.message.includes("ENOENT") || error.message.includes("not recognized")) {
                    outputChannel.appendLine("❌ Error: Could not find the Lua execution engine on your system.");
                    outputChannel.appendLine("💡 Fix: Go to VS Code Settings (Ctrl+,), search for 'Pretty Lua Errors' and specify your exact path.");
                } else {
                    outputChannel.appendLine(error.message);
                }
            } else {
                outputChannel.appendLine("\n✅ Script executed successfully with zero errors!");
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
