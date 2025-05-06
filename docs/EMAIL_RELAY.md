# Email Relay Architecture for AIStudyPlans

This document provides detailed information about the Email Relay architecture using Azure Functions with Azure Key Vault integration.

## Architecture Overview

The Email Relay architecture enables secure sending of transactional emails (like waitlist confirmations, password resets, etc.) through a dedicated serverless API. This approach offers several benefits:

1. **Enhanced Security**: Sensitive API keys are stored in Azure Key Vault, not in environment variables or code
2. **Scalability**: Azure Functions auto-scale based on demand
3. **Isolation**: Email functionality is isolated from the main application
4. **Cost Efficiency**: Pay only for the execution time of email operations

### Architecture Diagram

```
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│   Next.js     │        │    Azure      │        │    Resend     │
│  Application  │───────>│   Functions   │───────>│   Email API   │
└───────────────┘        └───────────────┘        └───────────────┘
                                │
                                │
                                ▼
                         ┌───────────────┐
                         │  Azure Key    │
                         │    Vault      │
                         └───────────────┘
```

## Components

### 1. Azure Functions App

The serverless API component that processes email requests, retrieves the necessary secrets from Key Vault, and communicates with the Resend API.

**Key Files:**
- `azure-functions/waitlist/index.js`: Main function for waitlist emails
- `azure-functions/host.json`: Configuration for the Functions app, including CORS settings
- `azure-functions/package.json`: Dependencies for the Functions app

### 2. Azure Key Vault

Securely stores sensitive credentials like the Resend API key. The Function App accesses these secrets using a system-assigned managed identity.

**Key Secrets:**
- `resend-api-key`: The API key for the Resend service

### 3. Resend Email Service

The third-party email delivery service that handles the actual sending of emails.

## Deployment

All Azure resources for this system are deployed in the **AIStudyPlans-RG1** resource group.

The email relay system can be deployed using the provided deployment script:

```bash
./scripts/deploy-azure-functions.sh
```

This script performs the following actions:
1. Uses the existing Resource Group (AIStudyPlans-RG1)
2. Creates or updates required Azure resources (Storage Account, Function App)
3. Uses the existing Key Vault (aistudyplansvault)
4. Enables managed identity for the Function App
5. Sets up Key Vault access policies
6. Configures environment variables for the Function App
7. Deploys the Function code

### Manual Setup

If you prefer to manually set up resources:

1. Use the existing Azure Resource Group (AIStudyPlans-RG1)
2. Create an Azure Storage Account in AIStudyPlans-RG1
3. Use the existing Azure Key Vault (aistudyplansvault) in AIStudyPlans-RG1
4. Create an Azure Function App in AIStudyPlans-RG1 with name aistudyplans-function
5. Enable managed identity for the Function App
6. Grant the Function App's managed identity access to Key Vault secrets
7. Add the Resend API key to Key Vault
8. Configure Function App settings
9. Deploy the Function code

## Configuration

### Required Application Settings

The Function App requires the following application settings:

| Setting | Description |
|---------|-------------|
| KEY_VAULT_NAME | Name of the Azure Key Vault (aistudyplansvault) |
| EMAIL_FROM | Sender email address (e.g., "Lindsey <lindsey@aistudyplans.com>") |
| EMAIL_REPLY_TO | Reply-to email address (e.g., "support@aistudyplans.com") |
| NEXT_PUBLIC_APP_URL | Base URL of the application |
| ADMIN_EMAIL | Email address for admin notifications |

### CORS Configuration

The Function App uses CORS to control which origins can access the API. The configuration in `host.json` includes:

- Allowed origins (production domains and local development)
- Allowed methods (GET, POST, PUT, OPTIONS)
- Allowed headers
- Maximum age for CORS caching

## Security Considerations

1. **Managed Identity**: The Function App uses Azure's managed identity feature to access Key Vault without storing credentials.
2. **Access Policies**: The Key Vault is configured to allow the Function App to only get and list secrets.
3. **CORS Settings**: CORS is configured to restrict API access to known origins.
4. **Input Validation**: All inputs are validated before processing.
5. **Error Handling**: Errors are caught and logged without exposing sensitive information.

## Monitoring

To monitor the email relay system:
1. Use Azure Application Insights to track function execution and errors
2. Check function logs in the Azure Portal
3. Set up alerts for failures or high latency

## Troubleshooting

Common issues and their solutions:

### 1. Function App Can't Access Key Vault

**Symptom**: Function returns a 500 error with "Failed to initialize Key Vault client"
**Solutions**:
- Verify the KEY_VAULT_NAME setting is correct (should be "aistudyplansvault")
- Check that the Function App's managed identity is enabled
- Ensure the Key Vault access policy is correctly configured

### 2. Emails Not Being Sent

**Symptom**: Function executes successfully but no emails are received
**Solutions**:
- Verify the Resend API key is correctly stored in Key Vault
- Check that the email addresses are valid
- Look for error messages in the function logs
- Verify Resend service status

### 3. CORS Errors

**Symptom**: Browser console shows CORS errors when calling the API
**Solutions**:
- Verify the origin is listed in the allowed origins in host.json
- Ensure the request includes the correct headers
- Check that the response is including the right CORS headers

## Integration with the Main Application

To integrate the email relay with the main application:

1. Update API endpoints to point to the Function App URL
2. Ensure the correct headers are sent with requests
3. Handle error responses appropriately

For the Next.js application, update API calls to use the Function App URL:

```javascript
// Before
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email }),
});

// After
const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL || 'https://aistudyplans-function.azurewebsites.net';
const response = await fetch(`${FUNCTION_APP_URL}/api/waitlist`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email }),
});
```

## Future Improvements

Potential enhancements to consider:

1. Add rate limiting to prevent abuse
2. Implement email templates in a database or Azure Blob Storage
3. Add email tracking and analytics
4. Create additional function endpoints for different email types
5. Implement queue-based processing for high-volume scenarios 