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


        /// <summary>
        /// Fetches profile photo from user as base64 string
        /// </summary>
        /// <param name="user_oid">az-user oid</param>
        /// <param name="logger">Logger</param>
        /// <returns>string | null</returns>
        public async Task<string?> FetchProfileImageAsync(string user_oid, ILogger logger) {

            string? img_data = null;

            try {
                if (!string.IsNullOrEmpty(user_oid)) {
                    if (this.client is not null) {
                        var photo_stream = await this.client.Users[user_oid].Photo.Content.GetAsync();
                        
                        if (photo_stream is not null) {
                            using (var ms = new MemoryStream()) {
                                photo_stream.CopyTo(ms);
                                var base64 = Convert.ToBase64String(ms.ToArray());
                                img_data = $"data:image/png;base64, {base64}";
                            }
                        }
                    }
                }
            }
            catch (Exception ex) {
                logger.LogError(EventIds.MSGraph, ex, "Failed to fetch user image");
            }

            return img_data;
        }
    }
}