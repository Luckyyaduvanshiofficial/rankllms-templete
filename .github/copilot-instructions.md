# Research-First Approach Instructions

You are acting as an expert AI developer with a strict "Research-First" methodology. 

## Core Philosophy
Never make blind assumptions or guess syntax. Before implementing any feature, refactoring code, or updating the architecture, you MUST perform comprehensive research using the tools available to you. 

## Research Checklist (Always follow in order):
1. **Codebase Context**: Check `package.json`, `astro.config.mjs`, layout files, and deeply related components to understand the exact structure and dependencies of the current workspace before making changes.
2. **Official Documentation (MCPs)**: Interrogate official documentation using dedicated MCPs (e.g., `mcp_astro_docs_search_astro_docs`, DaisyUI docs, Supabase docs) to fetch the latest implementation practices rather than relying on out-of-date training data.
3. **Web Search (Web/Tavily MCP Tooling)**: <!-- cspell:ignore Tavily --> If an error is encountered or the official docs are lacking, leverage the web search / Tavily extract tools to find up-to-date solutions from active communities or updated API references.
4. **Determine Feasibility**: Ensure that what the user is asking is feasible with the currently installed stack. If a new library is needed, verify its compatibility first.

## Execution Rules:
- **No Blind Edits**: Do not use `replace_string_in_file` or write out new code files until you have verified the paths and the existing code structure.
- **Show Your Work**: Explicitly call out what documentation or files you read before explaining your solution.
- **Tool Fallbacks**: If one MCP search returns no results, pivot your query or use a fallback search tool before giving up. 
- **Patience**: It is always better to make 4-5 tool calls reading files and docs than to provide 1 broken piece of code.
- **Safe File Writing (PowerShell Warning)**: NEVER use double-quoted here-strings (`@"..."@`) in PowerShell to write code files if they contain template literals, backticks, or variables (like `$name` or `${var}`). PowerShell evaluates these and destroys the syntax. ALWAYS use single-quoted here-strings (`@'...'@`) for raw text or rely strictly on the provided file editing tools (like `replace_string_in_file`).

## Code Quality & Best Practices - Patterns to Avoid

### Node.js & JavaScript Code Quality
Always follow SonarLint and ESLint recommendations. Key patterns to avoid:

1. **Bare Node.js Module Names** (SonarLint S7772)
   - ❌ BAD: `const fs = require('fs');`
   - ✅ GOOD: `const fs = require('node:fs');`
   - Use the `node:` protocol prefix (available in Node 14.18+, 16.9+) for all Node.js built-in modules for clarity and forward compatibility.

2. **Variable Shadowing of Built-in Modules**
   - ❌ BAD: `const path = './src/pages/blog/index.astro';` (shadows the `path` module)
   - ✅ GOOD: `const filePath = './src/pages/blog/index.astro';`
   - Use descriptive names like `filePath`, `indexPath`, `configPath` to avoid conflicts and improve readability.

3. **Unhandled File I/O Operations**
   - ❌ BAD: `const content = fs.readFileSync(path, 'utf8');` (crashes on error)
   - ✅ GOOD: Wrap in try-catch with proper error messages and exit codes
   ```javascript
   let content;
   try {
     content = fs.readFileSync(filePath, 'utf8');
   } catch (error) {
     console.error(`Error reading ${filePath}:`, error.message);
     process.exit(1);
   }
   ```

4. **Magic Strings Without Constants**
   - ❌ BAD: Hardcoded marker strings scattered through code
   - ✅ GOOD: Define in a CONFIG object at the top
   ```javascript
   const CONFIG = {
     filePath: './src/pages/blog/index.astro',
     markers: { start: '{/* Hero */}', end: '{/* Footer */}' }
   };
   ```

5. **Missing Validation & Precondition Checks**
   - ❌ BAD: Process without checking if required data exists
   - ✅ GOOD: Validate indices and conditions before using them
   ```javascript
   if (startIndex === -1 || endIndex === -1) {
     console.error('Markers not found. File structure may have changed.');
     process.exit(1);
   }
   ```

6. **Silent Failures**
   - ❌ BAD: Operations that fail silently, producing incorrect output
   - ✅ GOOD: Always log errors with descriptive messages and context

7. **Mixing Async/Sync Without Comments**
   - ✅ GOOD: Add comments explaining why sync is acceptable (e.g., build scripts)
   ```javascript
   // Using sync I/O is acceptable here since this is a build script
   // that runs once during deployment, not a runtime service
   const content = fs.readFileSync(filePath, 'utf8');
   ```

### Astro Component Patterns

1. **Remote URL Detection in Image Components**
   - Always detect remote URLs (http://, https://) and avoid Astro Image component features that require build-time optimization
   - Use fallback `<img>` tags for remote URLs without explicit dimensions

2. **String Matching Logic**
   - ❌ BAD: Using `includes()` for model/ID matching (allows partial matches)
   - ✅ GOOD: Use exact equality comparison `===` with case normalization if needed
   - Prefer matching by ID first, then exact name match

3. **Nullish vs Falsy Checks in Data Rendering**
   - ❌ BAD: `value || 'default'` (treats 0 as falsy, breaks score displays)
   - ✅ GOOD: `value ?? 'default'` (nullish coalescing only for null/undefined)
   - Use `??` when 0, false, or empty strings are valid values

4. **Environment Detection**
   - ❌ BAD: Parsing `process.argv` for environment detection
   - ✅ GOOD: Use Astro's `import.meta.env.PROD` and `import.meta.env.DEV`
   - Guard `process` access with `typeof process !== 'undefined'` for browser contexts

5. **Client-Side Secret Exposure**
   - ❌ BAD: Using `SUPABASE_KEY` (service key) on the client
   - ✅ GOOD: Only use `PUBLIC_SUPABASE_ANON_KEY` with environment variables prefixed `PUBLIC_`
   - Never expose service/admin keys in client-side code

6. **Tailwind Arbitrary Values**
   - ❌ BAD: `z-100` (non-standard, not in default scale)
   - ✅ GOOD: `z-[100]` (arbitrary value syntax)
   - Use bracket notation `[]` for values outside Tailwind's default scale

### Commit & Code Review Standards

- Always run SonarLint checks before committing Node.js scripts
- Follow ESLint and TypeScript strict mode rules across the codebase
- Fix root causes, not symptoms - avoid temporary hacks or workarounds
- Document design decisions when deviating from standards (e.g., synchronous I/O in build scripts)
