# AIStudyPlans Azure Functions - Email Relay

This directory contains the Azure Functions implementation for the AIStudyPlans email relay system.

## Overview

The Azure Functions in this directory provide secure email functionality for the AIStudyPlans/SchedulEd application by:

1. Securely accessing credentials from Azure Key Vault
2. Processing email requests from the main application
3. Sending emails through the Resend email service
4. Handling error cases and providing appropriate responses

## Function Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/waitlist` | POST | Processes waitlist signups and sends confirmation emails |

## Local Development

### Prerequisites

- Node.js 18 or later
- Azure Functions Core Tools v4
- An Azure account with access to:
  - Azure Functions
  - Azure Key Vault
  - Azure Storage

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `local.settings.json` file:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "KEY_VAULT_NAME": "your-key-vault-name",
       "EMAIL_FROM": "Lindsey <lindsey@aistudyplans.com>",
       "EMAIL_REPLY_TO": "support@aistudyplans.com",
       "NEXT_PUBLIC_APP_URL": "http://localhost:3000",
       "ADMIN_EMAIL": "waitlist@aistudyplans.com"
     }
   }
   ```

3. Authenticate with Azure:
   ```
   az login
   ```

4. Start the local Function App:
   ```
   func start
   ```

## Key Vault Integration

This Function App uses Azure Key Vault to securely store and access sensitive credentials like the Resend API key. This approach avoids storing secrets in environment variables or code.

The integration is implemented with these components:

1. **DefaultAzureCredential**: Used for authentication to Azure Key Vault
2. **SecretClient**: Used to retrieve secrets from the Key Vault
3. **Managed Identity**: Used in production to securely access Key Vault without storing credentials

### Required Key Vault Secrets

- `resend-api-key`: The API key for the Resend email service

## Deployment

The Function App can be deployed using the deployment script in the scripts directory:

```bash
../scripts/deploy-azure-functions.sh
```

Alternatively, you can use the Azure CLI or Azure Portal to deploy the functions.

## Security Considerations

1. **Managed Identity**: In production, the Function App uses a system-assigned managed identity to access Key Vault, eliminating the need for stored credentials.
   
2. **Access Policies**: The Key Vault is configured to allow the Function App's managed identity to only access the specific secrets it needs.

3. **CORS Settings**: The `host.json` file contains CORS settings that restrict which origins can access the Function App.

4. **Input Validation**: All inputs are validated before processing to prevent injection attacks.

## Monitoring and Troubleshooting

1. **Function Logs**: View logs in the Azure Portal under the Function App > Functions > [Function Name] > Monitor.

2. **Application Insights**: If configured, Application Insights provides detailed telemetry.

3. **Status Codes**:
   - 200: Success
   - 400: Bad request (missing or invalid parameters)
   - 500: Server error (check logs for details)

## Related Documentation

For more detailed information about the email relay architecture, see:

- [Email Relay Architecture](../docs/EMAIL_RELAY.md) - Comprehensive architecture documentation
- [Email Setup Guide](../docs/EMAIL.md) - General email setup guide 