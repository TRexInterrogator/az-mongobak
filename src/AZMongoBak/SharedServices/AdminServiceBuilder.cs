namespace AZMongoBak.SharedServices {
    public class AdminServiceBuilder {
        private readonly string _aad_group;
        private readonly GraphService _graph_serv;

        public AdminServiceBuilder(AppConfigService config_serv) {
            this._graph_serv = new GraphService(config_serv);
            this._aad_group = config_serv.settings.UserGroupOid;
        }


        /// <summary>
        /// Syncs groups data from aad
        /// Creates admin-service
        /// </summary>
        /// <returns>AdminService</returns>
        public async Task<AdminService> BuildServiceAsync() {

            var service = new AdminService(new List<string>());

            try {
                if (this._graph_serv.client is not null) {
                    var aad_result = await this._graph_serv.client
                        .Groups[this._aad_group]
                        .Members
                        .GetAsync();

                    if (aad_result is not null) {
                        if (aad_result.Value is not null) {
                            var members = aad_result.Value
                                .Select(e => e.Id)
                                .OfType<string>()
                                .ToList();

                            service = new AdminService(members);
                        }
                    }
                }
            }
            catch (Exception ex) {
                Console.WriteLine($"{DateTime.Now} STARTUP ERROR: Sync with AAD failed! - Exception: {ex.Message}");
            }

            return service;
        }
    }
}