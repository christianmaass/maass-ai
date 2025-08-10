# Security Policy

We take security seriously. Please follow these guidelines to report vulnerabilities and handle secrets.

## Reporting a Vulnerability

- Do NOT open public issues for security reports.
- Use GitHub Security Advisories (Security > Advisories) to privately report vulnerabilities, or open a private issue if enabled.
- If neither is possible, create an issue with the `security` label and no sensitive details; we will contact you to continue privately.
- Provide reproduction steps, impact assessment, affected versions, and potential mitigations if known.

### Response & Disclosure

- Acknowledge receipt within 2 business days.
- Initial assessment within 5 business days.
- We strive to fix high/critical issues quickly and coordinate disclosure.

## Supported Versions

- The `main` branch and the latest production deployment are supported for security fixes.

## Handling Secrets

- Never commit secrets. Use environment variables via `.env.local` (not tracked).
- Provide non-sensitive defaults in `.env.example`.
- Rotate compromised credentials immediately and invalidate exposed tokens.

## Dependencies & Monitoring

- Automated dependency updates via Dependabot are enabled.
- We recommend running `npm audit` locally and addressing high severity findings promptly.

## Contact

- Maintainer: Christian Maass (@christianmaass)
- For urgent matters, please mark your advisory as high severity to trigger faster response.
