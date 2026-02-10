# Security Policy

## Overview

This repository implements the REPO BRAIN HOSPITAL security framework with multiple layers of protection against common vulnerabilities. All contributors must follow these security guidelines.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it to the repository maintainers privately. Do not open public issues for security vulnerabilities.

## Security Best Practices

### 1. Secret Management

**Never hardcode secrets or API keys in source code.**

✅ **Correct:**
```typescript
const apiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
```

❌ **Incorrect:**
```typescript
const apiKey = "sk-1234567890abcdef...";
```

**Required Environment Variables:**
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GEMINI_API_KEY` - Google Gemini API key
- `GITHUB_TOKEN` - GitHub personal access token
- `WEB3_RPC_URL` - Secure HTTPS RPC endpoint (if using Web3)
- `WALLET_MNEMONIC` - Wallet mnemonic (if using Web3)

All secrets should be stored in `.env` files (which are git-ignored) or in secure environment variable stores. Use `.env.example` as a template.

### 2. Shell Execution Safety

**Always use parameterized execution instead of string concatenation.**

✅ **Correct:**
```typescript
import { execFile } from 'child_process';
const { stdout } = await execFileAsync('bash', [scriptPath], { cwd: workDir });
```

❌ **Incorrect:**
```typescript
import { exec } from 'child_process';
const { stdout } = await execAsync(`bash "${scriptPath}"`, { cwd: workDir });
```

**Shell Script Best Practices:**
- Use `set -euo pipefail` at the start of all bash scripts
- Quote all variable expansions: `"$VAR"` instead of `$VAR`
- Validate and sanitize all user inputs
- Avoid `eval`, `sh -c`, or `bash -c` with dynamic content

### 3. Web3 Security

**For Web3/blockchain integrations:**

✅ **Correct:**
```typescript
const rpcUrl = process.env.WEB3_RPC_URL; // Must be HTTPS
const mnemonic = process.env.WALLET_MNEMONIC;
```

❌ **Incorrect:**
```typescript
const rpcUrl = "http://insecure-rpc.com"; // Never use HTTP
const privateKey = "0x1234..."; // Never hardcode
```

**Web3 Requirements:**
- Always use HTTPS for RPC endpoints
- Never expose private keys or mnemonics in code
- Validate all contract addresses before interaction
- Use secure wallet initialization patterns

### 4. Dependency Management

**Keep dependencies up to date and audit regularly:**

```bash
npm audit
npm audit fix
```

**Before adding new dependencies:**
- Check for known vulnerabilities
- Verify the package is actively maintained
- Review the package's security history
- Use exact versions in production (`package-lock.json`)

### 5. Input Validation

**Validate and sanitize all external inputs:**

✅ **Correct:**
```typescript
const sanitizedName = phaseName.replace(/[^a-z0-9.\-_]/gi, '');
if (!scriptPath.startsWith(allowedBasePath)) {
  throw new Error('Invalid path');
}
```

**Never trust:**
- User input from forms or URLs
- Data from external APIs
- File paths without validation
- Environment variables without verification

### 6. Code Injection Prevention

**Never use dynamic code evaluation:**

❌ **Forbidden:**
```typescript
eval(userInput);
new Function(userInput);
setTimeout(stringCode);
```

### 7. AI Guard Compliance

The repository includes an automated AI Guard scanner (`brain.ai.guard.sh`) that detects:
- Hardcoded API keys and secrets
- Unsafe shell execution patterns
- Code injection vulnerabilities
- Web3 security risks
- Insecure RPC endpoints

**The AI Guard will block commits containing:**
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` with actual values
- `child_process.exec`, `os.system`, `eval()` patterns
- Hardcoded private keys (64-char hex strings in Web3 contexts)
- HTTP (non-HTTPS) RPC endpoints

## Automated Security Checks

### Pre-commit Firewall

The repository uses `brain.firewall.sh` as a Git pre-commit hook to block unsafe patterns:

```bash
# Blocked patterns:
- OPENAI_API_KEY
- child_process
- subprocess
- os.system
- exec(
- eval(
```

### CI Security Scanning

The GitHub Actions workflow includes:
- Dependency vulnerability scanning
- Secret scanning with Gitleaks
- AI Guard pathological pattern detection

## Incident Response

If a security issue is discovered:

1. **Immediate:** Rotate all exposed credentials
2. **Assess:** Determine the scope and impact
3. **Fix:** Apply security patches
4. **Verify:** Run full security scan suite
5. **Document:** Update security documentation
6. **Communicate:** Notify affected parties if necessary

## Security Tools in This Repository

- **AI Guard** (`brain.ai.guard.sh`) - Scans for security pathologies
- **Firewall** (`brain.firewall.sh`) - Pre-commit security checks
- **Gitleaks** (CI) - Secret scanning
- **npm audit** (CI) - Dependency vulnerability scanning

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Version

Security Policy Version: 1.0.0  
Last Updated: 2026-02-10  
MERMEDA Framework Version: v2.2.0
