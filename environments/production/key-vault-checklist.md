# Azure Key Vault Checklist for AIStudyPlans

This checklist ensures all required secrets are properly configured in Azure Key Vault (aistudyplansvault) for production deployment.

## Required Secrets

| Secret Name | Description | Status |
|-------------|-------------|--------|
| `azure-ad-client-id` | Azure AD application client ID for authentication | ✅ |
| `azure-ad-client-secret` | Azure AD application client secret | ✅ |
| `azure-ad-tenant-id` | Azure AD tenant ID | ✅ |
| `admin-emails` | Comma-separated list of admin email addresses | ✅ |
| `nextauth-secret` | Random string used to hash tokens, sign cookies | ✅ |
| `supabase-url` | Supabase project URL | ✅ |
| `supabase-anon-key` | Supabase anonymous API key | ✅ |
| `supabase-service-role-key` | Supabase service role key for admin operations | ✅ |
| `resend-api-key` | Resend.com API key for email sending | ✅ (as RESEND-API-KEY) |
| `api-key` | API key for server functions | ✅ |
| `applicationinsights-connection-string` | Azure Application Insights connection string | ✅ |

## Notes on Naming Conventions

- Some secrets in the vault use uppercase format:
  - `RESEND-API-KEY` instead of lowercase `resend-api-key`
  - `NEXTAUTH-URL` instead of lowercase `nextauth-url`
- The environment variable configuration has been updated to reflect these capitalization differences

## All Required Secrets Verified ✓

All required secrets for the AIStudyPlans production deployment are now configured in the Azure Key Vault. 

## How to Add or Update Secrets

```bash
# Use Azure CLI to add or update secrets
az keyvault secret set --vault-name "aistudyplansvault" --name "secret-name" --value "secret-value"
```

Or use the Azure Portal:

1. Navigate to Azure Portal > Key Vaults > aistudyplansvault
2. Go to "Secrets" in the left menu
3. Click "Generate/Import"
4. Enter the name and value for each secret
5. Click "Create"

## Important Notes

- Ensure all secret values are properly generated and secure
- Store a backup of all secrets in a secure location separate from the code repository
- Update application environment variables to reference these secrets using the correct Key Vault reference format

## Key Vault Reference Format

When creating your `.env.production` file, use the following format to reference Key Vault secrets:

```
VARIABLE_NAME=@Microsoft.KeyVault(SecretUri=https://aistudyplansvault.vault.azure.net/secrets/secret-name/)
```

For example:
```
RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://aistudyplansvault.vault.azure.net/secrets/RESEND-API-KEY/)
```

Note the capitalization differences in some secrets:
- `RESEND-API-KEY` (uppercase in Key Vault)
- `nextauth-secret` (lowercase in Key Vault)

A template file has been provided at `environments/production/env-production-template.txt`.
You can use the script `scripts/create-env-production.sh` to create your `.env.production` file. 