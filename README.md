# Prettier Lua Errors 🚀

A high-performance, low-level VS Code extension that natively intercepts Lua compiler execution streams, instantly mapping raw diagnostics and cryptic errors into readable, actionable workspace alerts. 

Built completely from the ground up via an optimized TypeScript compiler framework to ensure zero-overhead execution directly inside your environment.

## ⚡ Why Prettier Lua Errors?

Standard extension wrappers introduce memory lag and latency by layering heavy process orchestration libraries. **Prettier Lua Errors** solves this by bypassing boilerplate abstractions and tapping directly into system stream events.

- **Direct Shell Interception:** Hooks into underlying shell processes natively via the Node.js `child_process` API to capture diagnostic emissions the microsecond they occur.
- **Micro-Parsing Engine:** Uses a custom, low-level regex mapping layer that handles raw `stdout` and `stderr` streams line-by-line without dropping runtime cycles.
- **Integrated Workspace Diagnostics:** Seamlessly maps parsed system stream errors directly to your VS Code editor workspace (underlines errors, populates the Problems pane).

## 🛠️ Installation

1. Launch **VS Code**.
2. Open the Extensions Marketplace pane (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search for **Prettier Lua Errors** and select **Install**.
4. Reload or restart the editor environment to flush the native configuration.

## ⚙️ Configuration & Fine-Tuning

Fine-tune the direct stream parser by custom-configuring your workspace or user `settings.json` profile:

```json
{
  "prettierLuaErrors.shellExecutionPath": "lua",
  "prettierLuaErrors.maxBufferAllocation": 2048,
  "prettierLuaErrors.realTimeStreamParsing": true
}
```

## 💻 Workflows & Usage

The stream capture listener launches automatically during execution phases or can be invoked on demand:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to expose the Command Palette.
2. Select **Prettier Lua Errors: Parse Execution Stream**.
3. Watch cryptic system terminal streams transform instantly into structured workspace alerts.

## 📋 Environment Requirements

- **VS Code Engine:** v1.80.0 or higher
- **Runtime Environment:** Managed natively via the internal VS Code V8 environment.

---
**Engineered with absolute control over the custom TypeScript compilation pipeline.**
