const vscode = require('vscode');

let diagnosticCollection;

/**
 * Activate the extension
 */
function activate(context) {
  // Create a diagnostic collection for Protobuf linting
  diagnosticCollection = vscode.languages.createDiagnosticCollection('protobuf');
  context.subscriptions.push(diagnosticCollection);

  // Watch for open text documents
  if (vscode.window.activeTextEditor) {
    checkProtoFile(vscode.window.activeTextEditor.document);
  }

  // Handle document changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      checkProtoFile(event.document);
    })
  );

  // Handle document opens
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      checkProtoFile(document);
    })
  );

  // Handle active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        checkProtoFile(editor.document);
      }
    })
  );

  console.log('Protobuf extension activated');
}

/**
 * Check a proto file for linting issues
 */
function checkProtoFile(document) {
  // Only check .proto files
  if (document.languageId !== 'proto' && !document.fileName.endsWith('.proto')) {
    return;
  }

  const diagnostics = [];
  const text = document.getText();
  const lines = text.split('\n');

  let hasPackageDeclaration = false;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    // Check for package declaration (at the beginning of the file)
    if (lineIndex < 10 && /^\s*package\s+/.test(line)) {
      hasPackageDeclaration = true;
    }

    // Check message definitions
    const messageMatch = line.match(/^\s*message\s+(\w+)\s*\{/);
    if (messageMatch) {
      const messageName = messageMatch[1];
      if (!isPascalCase(messageName)) {
        diagnostics.push(createDiagnostic(
          lineIndex,
          messageMatch.index + messageMatch[0].indexOf(messageName),
          messageName.length,
          `Message name '${messageName}' should be in PascalCase`,
          vscode.DiagnosticSeverity.Warning
        ));
      }
    }

    // Check service definitions
    const serviceMatch = line.match(/^\s*service\s+(\w+)\s*\{/);
    if (serviceMatch) {
      const serviceName = serviceMatch[1];
      if (!isPascalCase(serviceName)) {
        diagnostics.push(createDiagnostic(
          lineIndex,
          serviceMatch.index + serviceMatch[0].indexOf(serviceName),
          serviceName.length,
          `Service name '${serviceName}' should be in PascalCase`,
          vscode.DiagnosticSeverity.Warning
        ));
      }
    }

    // Check RPC methods in services
    const rpcMatch = line.match(/^\s*rpc\s+(\w+)\s*\(/);
    if (rpcMatch) {
      const rpcName = rpcMatch[1];
      if (!isPascalCase(rpcName)) {
        diagnostics.push(createDiagnostic(
          lineIndex,
          rpcMatch.index + rpcMatch[0].indexOf(rpcName),
          rpcName.length,
          `RPC method '${rpcName}' should be in PascalCase`,
          vscode.DiagnosticSeverity.Warning
        ));
      }
    }

    // Check field definitions (name and tag number)
    const fieldMatch = line.match(/^\s*(\w+(?:<\w+>)?)\s+(\w+)\s*=\s*(\d+)\s*;/);
    if (fieldMatch) {
      const fieldType = fieldMatch[1];
      const fieldName = fieldMatch[2];
      const fieldTag = parseInt(fieldMatch[3], 10);

      // Check if field name is snake_case
      if (!isSnakeCase(fieldName)) {
        diagnostics.push(createDiagnostic(
          lineIndex,
          fieldMatch.index + fieldMatch[0].indexOf(fieldName),
          fieldName.length,
          `Field name '${fieldName}' should be in snake_case`,
          vscode.DiagnosticSeverity.Warning
        ));
      }

      // Check if field tag is 0
      if (fieldTag === 0) {
        diagnostics.push(createDiagnostic(
          lineIndex,
          fieldMatch.index + fieldMatch[0].indexOf(fieldTag.toString()),
          1,
          'Field tag cannot be 0',
          vscode.DiagnosticSeverity.Error
        ));
      }
    }
  }

  // Check for missing package declaration
  if (!hasPackageDeclaration && lines.length > 0) {
    diagnostics.push(createDiagnostic(
      0,
      0,
      lines[0].length || 1,
      'Missing package declaration at the top of the file',
      vscode.DiagnosticSeverity.Warning
    ));
  }

  // Set diagnostics for this document
  diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * Create a diagnostic at a specific location
 */
function createDiagnostic(line, character, length, message, severity) {
  const range = new vscode.Range(
    new vscode.Position(line, character),
    new vscode.Position(line, character + length)
  );
  const diagnostic = new vscode.Diagnostic(range, message, severity);
  diagnostic.source = 'Protobuf';
  return diagnostic;
}

/**
 * Check if a string is in PascalCase
 */
function isPascalCase(str) {
  if (!str) return false;
  // First character must be uppercase
  if (str[0] !== str[0].toUpperCase()) return false;
  // No underscores or hyphens
  if (/_|-./.test(str)) return false;
  return true;
}

/**
 * Check if a string is in snake_case
 */
function isSnakeCase(str) {
  if (!str) return false;
  // Must be all lowercase letters, numbers, and underscores
  // First character must be lowercase or underscore
  if (!/^[a-z_][a-z0-9_]*$/.test(str)) return false;
  return true;
}

/**
 * Deactivate the extension
 */
function deactivate() {
  diagnosticCollection.dispose();
}

module.exports = {
  activate,
  deactivate
};
