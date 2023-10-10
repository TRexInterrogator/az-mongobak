# AZ-MongoBak
Azure cloud backup solution for mongodb databases with web-gui.

## Resource requirements
1. Microsoft Azure subscription
2. Storage account
3. MongoDb database
4. Azure Entra ID app registration (for authentication and user management)

## Hosting
This application can be hosted using Docker or Azure App Service (Linux)

## Configuration
Here is a sample configuration for local debugging
```appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.AspNetCore.SpaProxy": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5001"
      }
    }
  },
  "AzureAd": {
    "Instance": "",
    "ClientId": "",
    "TenantId": "",
    "Audience": ""
  }
}
```