#!/usr/bin/env bash
# AIStudyPlans (SchedulEd) — Post-deploy: seed KV + wire Functions App settings
#
# Usage:
#   ./scripts/wire-functions-settings.sh           # Wire KV refs only
#   ./scripts/wire-functions-settings.sh --seed-kv # Also seed KV secrets from 1P
#
# Requires:
#   - az CLI (authenticated to BTAI subscription)
#   - op CLI (with BTAI-CC-AIStudyPlans vault access via aistudyplans-sa-token)

set -euo pipefail

RG="AIStudyPlans-RG1"
FUNC="func-btai-asp-prod"
KV="aistudyplansvault"
SWA="aistudyplanslanding"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; exit 1; }

# ─── Optional: Seed Key Vault secrets from 1Password ─────────
if [[ "${1:-}" == "--seed-kv" ]]; then
  info "Seeding Key Vault secrets from 1Password..."

  export OP_SERVICE_ACCOUNT_TOKEN="$(cat ~/.config/op/aistudyplans-sa-token)"
  VAULT="BTAI-CC-AIStudyPlans"

  # Read from 1Password escrow item
  ITEM="Azure Key Vault Escrow"

  seed_from_escrow() {
    local kv_name="$1" op_field="$2"
    local value
    value=$(op item get "$ITEM" --vault "$VAULT" --fields "$op_field" --reveal 2>/dev/null || echo "")
    if [[ -n "$value" ]]; then
      az keyvault secret set --vault-name "$KV" --name "$kv_name" --value "$value" -o none
      info "  Seeded: $kv_name"
    else
      warn "  Skipped (empty): $kv_name → $op_field"
    fi
  }

  # Secrets already in KV (update from 1P escrow)
  seed_from_escrow "api-key" "api-key"
  seed_from_escrow "nextauth-secret" "nextauth-secret"
  seed_from_escrow "azure-ad-client-id" "azure-ad-client-id"
  seed_from_escrow "azure-ad-client-secret" "azure-ad-client-secret"
  seed_from_escrow "azure-ad-tenant-id" "azure-ad-tenant-id"
  seed_from_escrow "supabase-anon-key" "supabase-anon-key"
  seed_from_escrow "supabase-service-role-key" "supabase-service-role-key"
  seed_from_escrow "supabase-url" "supabase-url"
  seed_from_escrow "admin-emails" "admin-emails"

  # Generate new admin API key if not already in KV
  EXISTING=$(az keyvault secret show --vault-name "$KV" --name "admin-api-key" --query value -o tsv 2>/dev/null || echo "")
  if [[ -z "$EXISTING" ]]; then
    ADMIN_KEY=$(openssl rand -hex 32)
    az keyvault secret set --vault-name "$KV" --name "admin-api-key" --value "$ADMIN_KEY" -o none
    info "  Generated + seeded: admin-api-key"
  else
    info "  Exists: admin-api-key (skipped)"
  fi

  info "Key Vault seeded."
  echo ""
fi

# ─── Wire KV references onto Functions app ─────────────────────
info "Wiring Key Vault references to $FUNC..."

KVR="@Microsoft.KeyVault(VaultName=${KV};SecretName="

az webapp config appsettings set \
  --name "$FUNC" \
  --resource-group "$RG" \
  --settings \
    "RESEND_API_KEY=${KVR}api-key)" \
    "SUPABASE_SERVICE_ROLE_KEY=${KVR}supabase-service-role-key)" \
    "FEEDBACK_CAMPAIGN_API_KEY=${KVR}api-key)" \
    "ADMIN_API_KEY=${KVR}admin-api-key)" \
    "NEXT_PUBLIC_SUPABASE_URL=$(az keyvault secret show --vault-name "$KV" --name supabase-url --query value -o tsv)" \
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=$(az keyvault secret show --vault-name "$KV" --name supabase-anon-key --query value -o tsv)" \
    "EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>" \
    "EMAIL_REPLY_TO=support@aistudyplans.com" \
  -o none

info "Functions app settings wired."
echo ""

# ─── Wire SWA auth secrets with KV references ──────────────────
info "Wiring SWA auth secrets for $SWA..."

az staticwebapp appsettings set \
  --name "$SWA" \
  --resource-group "$RG" \
  --setting-names \
    "NEXTAUTH_SECRET=${KVR}nextauth-secret)" \
    "AZURE_AD_CLIENT_SECRET=${KVR}azure-ad-client-secret)" \
    "AZURE_AD_CLIENT_ID=$(az keyvault secret show --vault-name "$KV" --name azure-ad-client-id --query value -o tsv)" \
    "AZURE_AD_TENANT_ID=$(az keyvault secret show --vault-name "$KV" --name azure-ad-tenant-id --query value -o tsv)" \
    "NEXTAUTH_URL=https://aistudyplans.com" \
    "ADMIN_EMAILS=$(az keyvault secret show --vault-name "$KV" --name admin-emails --query value -o tsv)" \
  -o none 2>/dev/null || warn "SWA KV references may not be supported — verify in portal"

info "SWA settings wired."
echo ""
info "Verify Functions: az webapp config appsettings list --name $FUNC -g $RG -o table"
info "Verify SWA: az staticwebapp appsettings list --name $SWA -o table"
