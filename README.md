# Protobuf Support Extension

A comprehensive VS Code extension providing industry-standard language support for Protocol Buffer (.proto) files with intelligent linting, syntax highlighting, and diagnostics.

## Features

### 1. **Naming Convention Linting**

The extension enforces strict naming conventions to maintain code consistency:

- **Message Names**: Must be in `PascalCase`
  - ✓ `UserMessage`, `RequestData`
  - ✗ `user_message`, `requestData`

- **Service Names**: Must be in `PascalCase`
  - ✓ `UserService`, `DataService`
  - ✗ `user_service`, `dataService`

- **RPC Method Names**: Must be in `PascalCase`
  - ✓ `GetUser`, `CreateData`
  - ✗ `get_user`, `createData`

- **Field Names**: Must be in `snake_case`
  - ✓ `user_name`, `email_address`, `age`
  - ✗ `userName`, `EmailAddress`, `Age`

### 2. **Syntax Highlighting**

Comprehensive syntax highlighting for all Protobuf language constructs:

- Keywords: `syntax`, `package`, `import`, `message`, `service`, `rpc`, `option`, etc.
- Types: Built-in types and custom message types
- **Field Names**: Highlighted as variable members
- **Field Tag Numbers**: Highlighted as numeric constants
- Strings and Comments: Properly highlighted
- Enums and oneof constructs: Full support

### 3. **Diagnostic Warnings**

The extension provides intelligent diagnostics:

- **Field Tag = 0 Error**: Warns when a field is assigned tag 0 (reserved)
  - Severity: Error
  - Message: "Field tag cannot be 0"

- **Missing Package Declaration Warning**: Warns when no package is declared at the top of the file
  - Severity: Warning
  - Message: "Missing package declaration at the top of the file"

## Installation

1. Install the extension from the VS Code Marketplace (or load it as an unpacked extension for development)
2. Restart VS Code
3. The extension will automatically activate when you open `.proto` files

## Configuration

The extension works out of the box with no configuration required. It automatically detects `.proto` files and applies linting rules.

### Language Configuration

The extension provides:

- Line comments: `//`
- Block comments: `/* ... */`
- Auto-closing pairs for brackets, quotes
- Proper bracket matching and highlighting

## Example Usage

Create a file named `user.proto`:

```protobuf
syntax = "proto3";

package com.example.user;  // Package declaration

message User {
  string first_name = 1;    // ✓ snake_case field name
  string last_name = 2;     // ✓ snake_case field name
  int32 age = 3;            // ✓ Valid tag number
}

service UserService {
  rpc GetUser(GetUserRequest) returns (User);    // ✓ PascalCase method
  rpc CreateUser(CreateUserRequest) returns (User);  // ✓ PascalCase method
}
```

### Issues Detected

The extension will flag the following issues in `problematic.proto`:

```protobuf
// ✗ Missing package declaration warning

message user {                    // ✗ Should be 'User' (PascalCase)
  string FirstName = 1;           // ✗ Should be 'first_name' (snake_case)
  int32 invalid_tag = 0;          // ✗ Field tag cannot be 0
}

service userManagement {          // ✗ Should be 'UserManagement' (PascalCase)
  rpc get_user(UserRequest) returns (User);  // ✗ Should be 'GetUser' (PascalCase)
}
```

## Requirements

- VS Code 1.60.0 or higher

## Known Issues

- The extension performs regex-based parsing for maximum compatibility; for very large files (>10k lines), there may be slight performance implications
- Some advanced proto3 features (like service streaming options) are highlighted but not linted separately

## Release Notes

### 0.0.1

Initial release with:
- Naming convention linting (PascalCase for messages/services/methods, snake_case for fields)
- Syntax highlighting for Protobuf constructs
- Diagnostic warnings for field tag 0
- Warning for missing package declarations
- Full Proto3 support with TextMate grammar

## Support

For issues, feature requests, or contributions, please visit the project repository.

---

**Extension**: Protobuf Support  
**Version**: 0.0.1  
**Language**: Protobuf (Proto3)
