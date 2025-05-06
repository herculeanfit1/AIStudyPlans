# Email Relay with Azure Functions and Key Vault

This document explains how to set up and use the email relay functionality using Azure Functions with Azure Key Vault integration for SchedulEd (AIStudyPlans).

## Architecture Overview

The email relay system consists of:

1. **Azure Function App**: Hosts serverless functions that send emails using the Resend API
2. **Azure Key Vault**: Securely stores sensitive credentials like the Resend API key
3. **Azure Static Web App**: The main web application that redirects API requests to the Function App
4. **Resend**: The email delivery service used to send transactional emails

## Setup Instructions

Follow these steps to deploy the email relay functionality to production:

### 1. Prerequisites

- Azure CLI installed and authenticated
- Node.js and npm installed
- Resend API key (obtain from [Resend Dashboard](https://resend.com))
- Azure subscription with permissions to create resources

### 2. Deploy the Azure Function with Key Vault Integration

Run the deployment script from the project root:

```bash
./scripts/deploy-azure-functions.sh
```

This script will:
- Create an Azure Resource Group (if it doesn't exist)
- Create an Azure Storage Account (if it doesn't exist)
- Create an Azure Key Vault (if it doesn't exist)
- Create an Azure Function App (if it doesn't exist)
- Enable Managed Identity for the Function App
- Set Key Vault access policies to allow the Function App to access secrets
- Store the Resend API key in Key Vault (if it's not already there)
- Configure non-sensitive application settings directly on the Function App
- Deploy the function code
- Update `staticwebapp.config.json` to route API requests to the Function App

During deployment, you will be prompted to enter:
- **Resend API Key** (if not already in Key Vault)
- **Email From**: The sender email address (default: 'Lindsey <lindsey@aistudyplans.com>')
- **Email Reply To**: The reply-to email address (default: 'support@aistudyplans.com')
- **Admin Email**: The email address to receive admin notifications (default: 'waitlist@aistudyplans.com')
- **App URL**: The URL of your web application (default: 'https://aistudyplans.com')

### 3. Deploy the Static Web App

After running the deployment script, the `staticwebapp.config.json` file will be updated with the appropriate API routes. Commit and push this file, then deploy your Static Web App:

```bash
# Commit the updated configuration
git add staticwebapp.config.json
git commit -m "Update API routes for email relay with Key Vault integration"
git push

# Deploy to Azure Static Web Apps
npm run build
```

The Static Web App will use the updated configuration to route API requests to the Function App.

## How Key Vault Integration Works

1. The Function App uses a Managed Identity to authenticate with Azure Key Vault
2. When the Function App starts, it retrieves the Resend API key from Key Vault
3. The API key is kept in memory (not stored in environment variables) for added security
4. If the Key Vault becomes unavailable, the Function App will gracefully handle the error

### Security Benefits

- Sensitive credentials are not stored in code or environment variables
- Access to secrets is controlled through Azure RBAC or Key Vault access policies
- Secrets can be rotated without redeploying the Function App
- All secret accesses are logged and can be audited

## Testing the Email Relay

To test the email relay functionality, submit a form on your website that uses the API endpoint, for example, the waitlist form.

You can also test the API directly using curl:

```bash
curl -X POST \
  https://aistudyplans-api.azurewebsites.net/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "delivered@resend.dev",
    "source": "test"
  }'
```

Using `delivered@resend.dev` ensures the email will be delivered in test mode without actually sending to a real address.

## Troubleshooting

### Key Vault Access Issues

If you encounter issues with Key Vault access:

1. Verify that the Managed Identity is properly enabled for the Function App
2. Check that the Key Vault access policies are correctly configured
3. Ensure the required secrets exist in the Key Vault with the correct names
4. Check the Function App logs for detailed error messages

### CORS Issues

If you encounter CORS issues, check the following:

1. Verify that your website's domain is included in the `allowedOrigins` array in `host.json`
2. Check that the Function App is properly deployed and configured
3. Ensure the `staticwebapp.config.json` file has the correct API routes

### Email Delivery Issues

If emails are not being delivered:

1. Check the Function App logs in the Azure Portal
2. Verify that the Resend API key is correctly stored in Key Vault
3. Test with the `delivered@resend.dev` email address to verify the API is working

## Maintenance

### Updating Secrets in Key Vault

To update a secret in Key Vault:

```bash
# Log into Azure
az login

# Update a secret
az keyvault secret set --vault-name aistudyplans-kv --name "resend-api-key" --value "new-api-key-value"
```

### Updating Email Templates

Email templates are defined in the function code. To update them:

1. Edit the template functions in `azure-functions/waitlist/index.js`
2. Redeploy the Function App using the deployment script

### Adding New Email Functionality

To add new email functionality:

1. Create a new function in the Azure Function App
2. Configure it to use the Resend API client and Key Vault access
3. Update the `staticwebapp.config.json` file to route requests to the new function

## Security Considerations

- Sensitive credentials are stored in Azure Key Vault, not in code or environment variables
- The Function App uses Managed Identity for secure, certificate-based authentication to Key Vault
- All secret accesses are logged in Key Vault audit logs
- The Function App uses HTTPS for all communication
- API endpoints validate input data before sending emails
- Rate limiting should be implemented for production use to prevent abuse

## References

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Resend API Documentation](https://resend.com/docs/api-reference/introduction) 