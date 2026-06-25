# E-Xanh auth.md

Agent registration for E-Xanh — the smart electricity management platform.

## Authentication

This site supports AI agent authentication per the [Auth.md](https://github.com/workos/auth.md) specification.

- **Resource metadata**: `/.well-known/oauth-protected-resource`
- **Authorization server metadata**: `/.well-known/oauth-authorization-server`
- **Agent registration endpoint**: `/agent/register`
- **Identity endpoint**: `/agent/identity`
- **Claim endpoint**: `/agent/claim`
- **Revocation endpoint**: `/agent/revoke`

## Supported Methods

- Identity Assertion (ID-JAG): `urn:ietf:params:oauth:token-type:id-jag`
- Verified Email
- Anonymous (client credentials)

## Scopes

- `read` — read electricity data and tips
- `write` — submit and share energy usage data
