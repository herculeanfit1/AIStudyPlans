#!/usr/bin/env bash
#
# check-no-client-secrets.sh — block NEXT_PUBLIC_* credentials from being committed.
#
# WHY THIS EXISTS
#   Next.js inlines every `NEXT_PUBLIC_*` env var into the client JS bundle at
#   build time, so anything with that prefix is shipped to (and readable by)
#   every browser. A secret behind that prefix is not a secret. This repo once
#   carried a client-side admin login that compared the typed password against
#   `process.env.NEXT_PUBLIC_ADMIN_PASSWORD` (removed in commit e030ae33 in favour
#   of NextAuth SSO); the orphaned default credential lingered in a committed
#   env file. This guard makes that class of mistake un-committable.
#
# WHAT IT FLAGS
#   A NEXT_PUBLIC_* variable is flagged only when it is *assigned* (env / YAML /
#   JSON / shell, `NAME = ...` or `"NAME": ...`) or *referenced in code*
#   (`process.env.NAME`), AND its name contains a credential word (case- and
#   camelCase-aware):
#     PASSWORD PASSWD PASSPHRASE PWD SECRET CREDENTIAL(S) PRIVATE_KEY SECRET_KEY
#     SIGNING_KEY ENCRYPTION_KEY API_KEY ACCESS_KEY SERVICE_ROLE TOKEN BEARER
#     ADMIN_USERNAME ADMIN_USER ADMIN_LOGIN
#   Keys on *assignment/reference* (not any mention), so prose/comments/docs that
#   merely name a forbidden var are not flagged. Keys on whole *words*, so
#   `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_ADMIN_EMAIL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
#   (public by design) and `...CREDENTIALLESS` do NOT match; while
#   `SERVICE_ROLE_KEY`, `*_API_KEY`, `*_TOKEN`, lowercase `next_public_admin_password`,
#   and camelCase `NEXT_PUBLIC_AdminPassword` / `...StripeSecretKey` DO.
#
# OPT-OUT
#   A genuinely-public value (e.g. a public map/analytics token) can be allowed
#   by putting the marker `check-no-client-secrets: allow` on the same line.
#
# USAGE
#   scripts/check-no-client-secrets.sh [file ...]   # scan given files (pre-commit passes staged files)
#   scripts/check-no-client-secrets.sh --all        # scan all git-tracked files (manual / CI audit)
#
# SCOPE NOTE
#   Markdown and docs/ are skipped so documentation *describing* a forbidden var
#   (like this repo's security notes) does not self-trip. High-entropy secrets in
#   prose are covered by the Trivy secret scan (security-scan.yml), the backstop.
#
set -uo pipefail

# ── Credential vocabulary ──────────────────────────────────────────────────
# Two branches so both SCREAMING_SNAKE (case-insensitive, underscore-delimited)
# and camelCase (case-sensitive) names are caught without a lookaround engine
# (BSD grep on macOS has no -P). Assembled from fragments so this script never
# matches its own pattern text.
SNAKE_CRED='PASSWORD|PASSWD|PASSPHRASE|PWD|SECRET|CREDENTIALS?|PRIVATE_KEY|SECRET_KEY|SIGNING_KEY|ENCRYPTION_KEY|API_?KEY|ACCESS_KEY|SERVICE_ROLE|TOKEN|BEARER|ADMIN_USERNAME|ADMIN_USER|ADMIN_LOGIN'
CAMEL_CRED='Password|Passwd|Passphrase|Secret|Credentials?|PrivateKey|SecretKey|SigningKey|EncryptionKey|ApiKey|AccessKey|ServiceRole|Token|Bearer|AdminUsername|AdminUser|AdminLogin'

# NAME forms (a NEXT_PUBLIC_ name that contains a credential word).
NAME_SNAKE="NEXT_PUBLIC_[A-Za-z0-9_]*(${SNAKE_CRED})(_[A-Za-z0-9]+)*"
NAME_CAMEL="NEXT_PUBLIC_[A-Za-z0-9]*[a-z0-9](${CAMEL_CRED})([A-Z][A-Za-z0-9]*)?"

# Fire only on assignment (…NAME[":]=) or a code reference (process.env.NAME).
ctx() { # $1 = a NAME regex → a full pattern requiring assignment/reference context
  local n="$1"
  printf '(^|[^A-Za-z0-9_])%s['\''"]?[[:space:]]*[:=]|process\.env(\.%s|\[[[:space:]]*['\''"]%s)' "$n" "$n" "$n"
}
PAT_SNAKE="$(ctx "$NAME_SNAKE")"   # matched case-insensitively
PAT_CAMEL="$(ctx "$NAME_CAMEL")"   # matched case-sensitively

ALLOW_MARKER='check-no-client-secrets: allow'

# Paths allowed to mention forbidden names (docs, this guard, its wiring, ignore
# lists). Extended-regex, matched against the path.
EXCLUDE='(^|/)(scripts/check-no-client-secrets\.sh|\.pre-commit-config\.yaml|\.trivyignore)$|(^|/)docs/|\.md$|(^|/)\.git/'

is_excluded() { printf '%s' "$1" | grep -qE "$EXCLUDE"; }

# ── Build the file list ────────────────────────────────────────────────────
files=()
if [ "${1:-}" = "--all" ]; then
  while IFS= read -r f; do files+=("$f"); done < <(git ls-files)
else
  for f in "$@"; do files+=("$f"); done
fi

violations=0
for f in "${files[@]}"; do
  [ -f "$f" ] || continue
  is_excluded "$f" && continue
  # SNAKE (case-insensitive) ∪ camelCase (case-sensitive); dedup by line; drop
  # lines with the inline allow marker; redact anything after the first = or :
  # so a real value is never echoed to logs.
  matches=$( { grep -inE "$PAT_SNAKE" "$f" 2>/dev/null; grep -nE "$PAT_CAMEL" "$f" 2>/dev/null; } \
    | sort -t: -k1,1n -u \
    | grep -vF "$ALLOW_MARKER" \
    | sed -E 's/([:=][[:space:]]*).*/\1<REDACTED>/' || true)
  if [ -n "$matches" ]; then
    if [ "$violations" -eq 0 ]; then
      echo "::error::Client-exposed credential(s) detected — NEXT_PUBLIC_* vars ship in the browser bundle and must never name a secret."
    fi
    while IFS= read -r line; do
      [ -n "$line" ] || continue
      echo "  BLOCKED: ${f}:${line}"
    done <<< "$matches"
    violations=$((violations + 1))
  fi
done

if [ "$violations" -gt 0 ]; then
  cat >&2 <<'EOF'

Remediation:
  - Remove the NEXT_PUBLIC_ prefix and move the check server-side (API route /
    server action / middleware) reading a server-only var (e.g. ADMIN_PASSWORD_HASH,
    SUPABASE_SERVICE_ROLE_KEY).
  - If the value already shipped, treat it as compromised and rotate it.
  - Admin authentication in this repo is NextAuth SSO-only (auth.ts). There is no
    supported client-side admin credential.
  - A genuinely-public value can be allowed with an inline `check-no-client-secrets: allow`.
EOF
  exit 1
fi

exit 0
