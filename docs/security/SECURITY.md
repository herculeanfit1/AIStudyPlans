# Security Policy

## Reporting a Vulnerability

The SchedulEd team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, please use the GitHub Security Advisory ["Report a Vulnerability"](https://github.com/aistudyplans/scheduledapp/security/advisories/new) tab.

The SchedulEd team will send a response indicating the next steps in handling your report. After the initial reply to your report, the security team will keep you informed of the progress towards a fix and full announcement, and may ask for additional information or guidance.

## Security Update Process

1. The security team will coordinate the fix and release process
2. The vulnerability will be fixed in a private branch
3. A new release will be deployed with the fix
4. An advisory will be published after deploying the fix

## Best Practices for Reporting

* Provide detailed reports with reproducible steps
* Include the version/commit number of the vulnerable code
* If possible, include a proof of concept or code that demonstrates the vulnerability
* Avoid accessing or modifying user data
* Do not publicly disclose the issue until it has been addressed

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Vulnerability Scope

We're particularly interested in vulnerabilities that affect:

* Authentication/authorization
* Data leakage
* Cross-site scripting (XSS)
* Cross-site request forgery (CSRF)
* Injection attacks
* Server-side request forgery (SSRF)
* Remote code execution
* Denial of service vulnerabilities

## Out of Scope

The following are not in scope for our security program:

* Social engineering attacks
* Physical security attacks
* Vulnerabilities in third-party applications or websites
* Vulnerabilities requiring extensive user interaction
* Issues related to self-hosted instances with misconfiguration

## Safe Harbor

We support safe harbor for security researchers who:

* Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
* Only interact with accounts they own or with explicit permission of the account holder
* Do not exploit a security issue for purposes other than verification
* Report vulnerabilities directly to us and allow reasonable time for response and remediation before public disclosure

## Contact

For any questions about this security policy, please contact:
`security@aistudyplans.com` 