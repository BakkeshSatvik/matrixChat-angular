# Security Policy

## Supported Versions

We are committed to maintaining the security of this project. The following versions are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Updates

### Latest Security Patches (February 2026)

**Angular 19.2.18 Update**

We have upgraded from Angular 18.2.14 to Angular 19.2.18 to address critical security vulnerabilities:

#### Fixed Vulnerabilities

1. **XSRF Token Leakage via Protocol-Relative URLs**
   - **Severity**: High
   - **CVE**: Affects Angular HTTP Client
   - **Fix**: Angular 19.2.16+ includes patches
   - **Impact**: Prevented Cross-Site Request Forgery attacks through protocol-relative URLs

2. **XSS Vulnerability via Unsanitized SVG Script Attributes**
   - **Severity**: Critical
   - **CVE**: Multiple instances in @angular/core and @angular/compiler
   - **Fix**: Angular 19.2.18 includes complete patches
   - **Impact**: Prevented Cross-Site Scripting attacks via SVG elements

3. **Stored XSS via SVG Animation, SVG URL and MathML Attributes**
   - **Severity**: Critical  
   - **CVE**: Affects template compiler
   - **Fix**: Angular 19.2.17+ includes patches
   - **Impact**: Prevented stored XSS attacks through SVG and MathML content

### Remaining Known Issues

The following vulnerabilities exist only in development dependencies and do **not** affect production builds:

1. **ajv ReDoS vulnerability** (Moderate)
   - Affects: Development build tools only
   - Impact: None on production bundle
   - Status: Monitoring for upstream fix

2. **node-tar vulnerabilities** (High)
   - Affects: Development CLI tools only
   - Impact: None on production bundle
   - Status: Monitoring for upstream fix

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly:

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email the maintainers at: [security contact - to be added]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We will work with you to understand and fix the issue
- We will credit you in the security advisory (unless you prefer anonymity)
- We request 90 days before public disclosure to allow time for fixes

## Security Best Practices

### For Developers

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

2. **Run Security Checks**
   ```bash
   npm audit fix
   ```

3. **Review Pull Requests**
   - Check for suspicious code changes
   - Verify dependency updates
   - Test security-sensitive features

### For Users/Deployers

1. **Use HTTPS Only**
   - WebRTC calls require HTTPS
   - Session storage should be encrypted in transit

2. **Content Security Policy**
   - Configure strict CSP headers
   - Limit script sources
   - Disable inline scripts where possible

3. **Regular Updates**
   - Update to latest stable version
   - Monitor security advisories
   - Apply patches promptly

4. **Secure Session Storage**
   - Consider encrypting localStorage data
   - Clear sessions on logout
   - Implement session timeout

5. **Homeserver Validation**
   - Validate homeserver URLs
   - Use trusted homeservers only
   - Verify SSL certificates

## Security Features

### Implemented Security Measures

1. **Authentication**
   - Secure session management
   - Token-based authentication via Matrix
   - Auto-logout on session expiry

2. **End-to-End Encryption**
   - Support for E2EE rooms
   - Matrix protocol encryption
   - Secure key exchange

3. **Input Sanitization**
   - Angular's built-in XSS protection
   - Sanitized user inputs
   - Safe HTML rendering

4. **CSRF Protection**
   - Angular's XSRF protection (patched)
   - Token-based verification
   - Same-origin policy enforcement

5. **Secure Communications**
   - HTTPS enforcement for WebRTC
   - Secure WebSocket connections
   - Certificate validation

## Security Audit History

| Date | Version | Auditor | Findings | Status |
|------|---------|---------|----------|--------|
| 2026-02-18 | 1.0.0 | Internal | Angular vulnerabilities | Fixed |
| 2026-02-18 | 1.0.0 | npm audit | Dev dependency issues | Monitored |

## Resources

- [Angular Security Guide](https://angular.dev/best-practices/security)
- [Matrix Security Best Practices](https://matrix.org/docs/guides/security-guide)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## Acknowledgments

We thank the security researchers and the Angular team for identifying and patching these vulnerabilities.

## Contact

For security concerns, please contact the maintainers through GitHub issues (for non-sensitive matters) or via email for sensitive security reports.

---

**Last Updated**: February 18, 2026  
**Current Version**: 1.0.0  
**Security Status**: ✅ All known critical vulnerabilities patched
