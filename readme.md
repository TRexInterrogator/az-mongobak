# AZ-MongoBak
Azure cloud backup solution for mongodb databases with web-gui.

[Demo / Showcase](./demo/showcase.md)

## Resource requirements
1. Microsoft Azure subscription
2. Storage account
3. MongoDb database
4. Azure Entra ID app registration (for authentication and user management)

## Hosting
This application can be hosted using Docker or Azure App Service (Linux)

## Configuration
Here is a sample configuration, replace fields with your env. values
```appsettings.json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "ClientId": "YOUR CLIENT ID",
    "TenantId": "YOUR TENNANT ID",
    "Audience": "api://az-mongobak/XXXXXXX"
  },
  "AzMongoBak": {
    "UserGroupOid": "AZURE SEC GROUP OID WITH USERS FOR THIS APP",
    "CorsAllowedOrigins": "https://YOUR_APP_DNS_NAME.com",
    "AzBlobConnection": "STORAGE ACCOUNT CONNECTION STR (BLOB)",
    "AzBlobContainer": "CONTAINER NAME",
    "MongoDbConnection": "mongodb://YOUR MONGO SERVER:27017",
    "MongoDbDatabase": "AZMongoBak",
    "AppClientId": "YOUR CLIENT ID (needed for Graph API)",
    "AppSecret": "YOUR CLIENT ID (needed for Graph API)",
    "AzTenantId": "YOUR TENNANT ID"
  }
}
```

## Azure App registration
This application requires the following permissions to be set (**API Permissions**):
- Microsft Graph
  - Contacts.Read (Appl.)
  - Group.Read.All (Appl.)
  - GroupMember.Read.All (Appl.)
  - User.Read (Del.)
  - User.Read.All (Appl.)

### Configure `Authentication` section:

**Single Page Application (Redirect URLs)**
```auth.txt
Uri: 'https://youappname.com'
Uri: 'http://localhost:3000 (only needed for local debugging)'
```

### Configure `Expose an API` section:

**Scope**
```scope.txt
Scope name: 'access_as_user'
Who can conset: (up to you, choose)
Admin consent display name: 'Read user profile'
Admin consent description: 'Allow AZ MongoBak to read your profile information'
User consent display name: 'Read your profile'
User consent description: 'Allow AZ MongoBak to read your profile information'
```

**Authorized client applications**
```clientApps.txt
Client ID: 'Copy the ID of the current app-registration'
Scope: 'Select the scope you just created'
```

### Configure `Certificates & Secrets` section:

Create a new `Client Secret`, provide a fitting name + expiration date.
Remember to copy the secret value before closing the window. 
The secret value needs to be added to the `appsettings.json` under: `AppSecret`