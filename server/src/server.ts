/* Original code comes from from github.com/Microsoft/vscode-languageserver-node-example, which is
   licensed under MIT */
'use strict';

import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind,
	Files
} from 'vscode-languageserver';
import {exec} from 'sb-exec';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

// After the server has started the client sends an initialize request. The server receives in the
// passed params the rootPath of the workspace plus the client capabilities.
let workspaceRoot: string|null;
connection.onInitialize((params): InitializeResult => {
	workspaceRoot = params.rootPath;
	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that the server support code complete
			completionProvider: {
				resolveProvider: true
			}
		}
	}
});

// The settings interface describe the server relevant settings part
interface Settings {
	checkstyle: CheckstyleSettings;
}

// These are the checkstyle settings we defined in the client's package.json file
interface CheckstyleSettings {
	enable?: boolean;
	checkstylePath?: string;
	configurationPath?: string;
	properties?: object
}

// hold the maxNumberOfProblems setting
let checkstylePath: string;
let configurationPath: string|null;
let properties: object|null;

// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration((change) => {
	let settings = <Settings>change.settings;
	checkstylePath = settings.checkstyle.checkstylePath || "checkstyle";
	configurationPath = settings.checkstyle.configurationPath || null;
	properties = settings.checkstyle.properties || null;
	// Revalidate any open text documents
	documents.all().forEach(doc => validateDocument(doc.uri));
});

function parseOutput(output: string): Diagnostic[] {
	let regex = /^(?:\[[A-Z]*?\] )?(.*\.\w+):(\d+)(?::([\w \-]+))?: (warning:|)(.+)/
	let diagnostics: Diagnostic[] = []

    // Split into lines
    let lines = output.split(/\r?\n/)
    for (let line of lines) {
		const match = line.match(regex);

		if (match) {
			let [file, lineNum, colNum, typeStr, mess] = match.slice(1, 6)

			diagnostics.push({
				severity: DiagnosticSeverity.Warning,
				range: {
					start: { line: Number(lineNum)-1, character: Number(colNum)},
					end: { line: Number(lineNum)-1, character: Number(colNum || Number.MAX_VALUE) }
				},
				message: mess,
				source: 'checkstyle'
			});
		}
	}

	return diagnostics
}

/**
 * Returns the command and arguments needed to run checkstyle.
 * @param extraArgs	Arguments to be passed to checkstyle
 */
function getCmdAndArgs(extraArgs: string[]): [string, string[]] {
	if (checkstylePath.endsWith('.jar')) {
		return ['java', ['-jar', checkstylePath].concat(extraArgs)];
	} else {
		return [checkstylePath, extraArgs];
	}
}

/**
 * Returns the set of arguments to pass to checkstyle.
 * @param file	The file to lint via checkstyle
 */
function getCheckstyleArguments(file: string): string[] {
	let systemProperties: string[] = []

	if (properties) {
		systemProperties = Object.keys(properties).map(key => `-D${key}=${properties[key]}`);
	}

	if (configurationPath) {
		return systemProperties.concat(['-c', configurationPath, file]);
	} else {
		return systemProperties.concat([file]);
	}
}

async function validateDocument(uri: string): Promise<void> {
	let fsPath = Files.uriToFilePath(uri);
	if (!fsPath) {
		// checkstyle can only lint files on disk
		return;
	}

	const checkStyleArgs = getCheckstyleArguments(fsPath);
	try {
		const {stdout, stderr, exitCode} = await exec(...getCmdAndArgs(checkStyleArgs), { stream: 'both', throwOnStderr: false, ignoreExitCode: true })
		if (stdout.lastIndexOf('Audit done.') != -1) { // Use lastindexof because the string will be at the end
			let diagnostics = parseOutput(stdout);

			// Send the computed diagnostics to VSCode.
			connection.sendDiagnostics({ uri, diagnostics });
		} else {
			connection.console.error(`Checkstyle failed with error code ${exitCode}:\n${stdout + stderr}`);
		}
	} catch (e) {
		connection.console.error(e.message);
	}
}

// Don't suggest any completion items
connection.onCompletion(() => []);

documents.onDidOpen((event) => {
	validateDocument(event.document.uri);
})

documents.onDidSave((event) => {
	validateDocument(event.document.uri);
})

// Listen on the connection
connection.listen();
