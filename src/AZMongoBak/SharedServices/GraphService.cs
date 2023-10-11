using Azure.Identity;
using Microsoft.Graph;

namespace AZMongoBak.SharedServices {
    public class GraphService {
        public readonly GraphServiceClient? client;

        public GraphService(AppConfigService config_serv) {
            if (config_serv.OK) {
                var client_creds = new ClientSecretCredential(
                    config_serv.settings.AzTenantId,
                    config_serv.settings.AppClientId,
                    config_serv.settings.AppSecret,
                    options: new TokenCredentialOptions() {
                        AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
                    }
                );

                this.client = new GraphServiceClient(client_creds, new[] { "https://graph.microsoft.com/.default" });
            }
        }
    }
}