namespace AZMongoBak.SharedServices.Settings {
    public class AppConfig {
        public string SyncToken { get; set; } = "";
        public string UserGroupOid { get; set; } = "";
        public string CorsAllowedOrigins { get; set; } = "";
        public string AzBlobConnection { get; set; } = "";
        public string AzBlobContainer { get; set; } = "";
        public string MongoDbConnection { get; set; } = "";
        public string MongoDbDatabase { get; set; } = "";
        public string AppClientId { get; set; } = "";
        public string AppSecret { get; set; } = "";
        public string AzTenantId { get; set; } = "";


        public bool IsValid() {
            return !string.IsNullOrEmpty(this.SyncToken)
                && !string.IsNullOrEmpty(this.UserGroupOid)
                && !string.IsNullOrEmpty(this.AzBlobConnection)
                && !string.IsNullOrEmpty(this.AzBlobContainer)
                && !string.IsNullOrEmpty(this.MongoDbConnection)
                && !string.IsNullOrEmpty(this.MongoDbDatabase)
                && !string.IsNullOrEmpty(this.AppClientId)
                && !string.IsNullOrEmpty(this.AppSecret)
                && !string.IsNullOrEmpty(this.AzTenantId)
                ? true : false;
        }
    }
}