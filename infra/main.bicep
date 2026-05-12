// ── AIStudyPlans (SchedulEd) Infrastructure ────────────────────────
// Provisions: Functions (Flex Consumption), Storage, App Insights.
// References: existing Key Vault (aistudyplansvault), existing SWA.
//
// NOTE: Functions app is NOT linked to SWA as a backend because
// SWA linked backends intercept ALL /api/* routes, which would break
// NextAuth at /api/auth/*. The Functions app is standalone — the
// frontend calls it directly via its URL with CORS.
//
// Deploy:
//   az deployment group create \
//     --resource-group AIStudyPlans-RG1 \
//     --template-file infra/main.bicep \
//     --parameters infra/parameters.prod.json
// ────────────────────────────────────────────────────────────────────

targetScope = 'resourceGroup'

// ── Parameters ──────────────────────────────────────────────────────

@description('Primary Azure region')
param location string = 'eastus2'

@description('Environment name')
@allowed(['prod', 'staging'])
param environment string = 'prod'

@description('Name of the existing Key Vault')
param keyVaultName string = 'aistudyplansvault'

@description('Name of the existing SWA')
param swaName string = 'aistudyplanslanding'

// ── Naming ──────────────────────────────────────────────────────────

var prefix = 'btai-asp'
var suffix = environment
var names = {
  functions: 'func-${prefix}-${suffix}'
  storage: 'st${replace(prefix, '-', '')}${suffix}'
  appInsights: 'appi-${prefix}-${suffix}'
  logAnalytics: 'log-${prefix}-${suffix}'
  plan: 'plan-${prefix}-${suffix}'
}

// ── Log Analytics + Application Insights ────────────────────────────

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: names.logAnalytics
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: names.appInsights
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
  }
}

// ── Storage Account (Functions runtime) ─────────────────────────────

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: names.storage
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource deployContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'deploymentpackages'
}

// ── Functions App (Flex Consumption) ────────────────────────────────

resource plan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: names.plan
  location: location
  kind: 'functionapp'
  sku: {
    tier: 'FlexConsumption'
    name: 'FC1'
  }
  properties: {
    reserved: true
  }
}

resource functionsApp 'Microsoft.Web/sites@2024-04-01' = {
  name: names.functions
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: [
          'https://aistudyplans.com'
          'https://www.aistudyplans.com'
          'https://scheduledapp.com'
          'https://www.scheduledapp.com'
          'http://localhost:3000'
          'http://localhost:4280'
        ]
        supportCredentials: true
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageAccount.name
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
      ]
    }
    functionAppConfig: {
      runtime: {
        name: 'node'
        version: '22'
      }
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storageAccount.properties.primaryEndpoints.blob}deploymentpackages'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 10
        instanceMemoryMB: 2048
        alwaysReady: [
          {
            name: 'http'
            instanceCount: 1
          }
        ]
      }
    }
  }
}

// Grant Functions app Storage Blob Data Owner on storage account
resource storageBlobDataOwner 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, functionsApp.id, 'StorageBlobDataOwner')
  scope: storageAccount
  properties: {
    principalId: functionsApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b')
  }
}

// ── Key Vault (existing — add RBAC grants only) ────────────────────

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: keyVaultName
}

// Grant Functions managed identity Key Vault Secrets User
resource kvSecretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, functionsApp.id, 'KeyVaultSecretsUser')
  scope: keyVault
  properties: {
    principalId: functionsApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

// SWA MI already has Key Vault Secrets User (granted previously).
// If re-granting is needed:
//   az role assignment create --role "Key Vault Secrets User" \
//     --assignee <SWA-MI-principal-id> \
//     --scope <KV-resource-id>

// ── Auth: allow anonymous ──────────────────────────────────────────

resource authSettings 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: functionsApp
  name: 'authsettingsV2'
  properties: {
    platform: {
      enabled: false
    }
    globalValidation: {
      unauthenticatedClientAction: 'AllowAnonymous'
    }
  }
}

// ── Outputs ─────────────────────────────────────────────────────────

output functionsAppName string = functionsApp.name
output functionsUrl string = 'https://${functionsApp.properties.defaultHostName}'
output functionsIdentityPrincipalId string = functionsApp.identity.principalId
output storageAccountName string = storageAccount.name
output appInsightsName string = appInsights.name
output keyVaultName string = keyVault.name

// ── Post-Deployment Steps ───────────────────────────────────────────
//
// 1. Enable purge protection on existing Key Vault:
//    az keyvault update --name aistudyplansvault -g AIStudyPlans-RG1 \
//      --enable-purge-protection true
//
// 2. Wire Functions app settings with KV references:
//    ./scripts/wire-functions-settings.sh --seed-kv
//
// 3. Wire SWA app settings with KV references (auth secrets):
//    ./scripts/wire-swa-settings.sh
//
// 4. Deploy Functions code:
//    cd api && npm run build
//    func azure functionapp publish func-btai-asp-prod --javascript
//
// 5. Update frontend API base URL:
//    Set NEXT_PUBLIC_API_URL=https://func-btai-asp-prod.azurewebsites.net/api
//
// 6. Verify:
//    curl https://func-btai-asp-prod.azurewebsites.net/api/health
