# Protobuf Support Extension - Development Instructions

This VS Code extension provides comprehensive support for Protocol Buffer (.proto) files with industry-standard linting, syntax highlighting, and diagnostics.

## Project Overview

The extension implements:

1. **Naming Convention Linting**
   - Messages and Services: PascalCase
   - RPC Methods: PascalCase
   - Fields: snake_case

2. **Syntax Highlighting**
   - Field names and tag numbers
   - Keywords, types, comments, strings
   - Full Proto3 support

3. **Diagnostic Warnings**
   - Field tag = 0 (Error)
   - Missing package declaration (Warning)

## Project Structure

```
├── extension.js                 # Main extension code (JavaScript)
├── syntaxes/
│   └── proto.tmLanguage.json   # TextMate grammar for syntax highlighting
├── language-configuration.json  # Language configuration
├── package.json                # Extension manifest
├── README.md                   # User documentation
└── test.proto                  # Sample test file
```

## Running and Testing

### Development Mode

1. Open the folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. Open a `.proto` file to test linting and highlighting
4. Use the test.proto file to verify all features

### Testing Checklist

- [ ] Message names in non-PascalCase are flagged
- [ ] Service names in non-PascalCase are flagged
- [ ] RPC method names in non-PascalCase are flagged
- [ ] Field names in non-snake_case are flagged
- [ ] Field tag 0 is flagged as error
- [ ] Missing package declaration is flagged as warning
- [ ] Field names and tag numbers are highlighted
- [ ] Keywords are properly highlighted

### Example Test Cases

The test.proto file includes:
- Missing package declaration (warning)
- Message name "user" (should be "User") - warning
- Field "First_Name" (should be "first_name") - warning
- Field tag 0 - error
- Service name "userManagement" varies in case - warnings expected
- RPC method names vary in case - warnings expected

## Code Overview

### extension.js

The main extension file implements:

- `activate()`: Extension activation - creates diagnostic collection
- `checkProtoFile()`: Main linting logic
- `isPascalCase()`: Validates PascalCase naming
- `isSnakeCase()`: Validates snake_case naming
- `createDiagnostic()`: Creates VS Code diagnostic objects

### proto.tmLanguage.json

TextMate grammar with patterns for:

- Comments (line and block)
- Package declarations
- Import statements
- Syntax declarations
- Message definitions with nested support
- Field definitions (with field name and tag number highlighting)
- Service and RPC definitions
- Enum definitions
- String literals

## Extending the Extension

### Adding New Linting Rules

1. Add validation logic in `checkProtoFile()` function
2. Use regex patterns to match proto constructs
3. Push diagnostics to the `diagnostics` array
4. Test with sample proto files

### Adding New Highlighting

1. Edit `syntaxes/proto.tmLanguage.json`
2. Add new patterns to appropriate repository sections
3. Use proper scope names for semantic highlighting
4. Test in VS Code

### Common Tasks

**To add a new warning type:**
```javascript
const match = line.match(/your_pattern_here/);
if (match) {
  diagnostics.push(createDiagnostic(
    lineIndex,
    match.index + offset,
    length,
    'Your message here',
    vscode.DiagnosticSeverity.Warning
  ));
}
```

## Known Limitations

- Regex-based parsing: Uses regex patterns instead of a full proto parser
- Large files: Performance may degrade on files >10k lines
- Advanced features: Some proto3 advanced features not yet supported

## Future Enhancements

- [ ] Code formatting support
- [ ] Go-to-definition for message types
- [ ] Completion provider for message and service types
- [ ] Support for proto2 syntax
- [ ] Custom rules configuration
- [ ] Integration with protoc compiler

## Dependencies

- VS Code API (built-in)
- No external npm dependencies required

## Version History

- **0.0.1** (Initial Release)
  - Naming convention linting
  - Syntax highlighting
  - Basic diagnostics
  - Proto3 support

---

For more information, see README.md and the vsc-extension-quickstart.md file.
