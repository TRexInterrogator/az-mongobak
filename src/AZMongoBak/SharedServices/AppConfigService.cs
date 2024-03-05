using AZMongoBak.SharedServices.Settings;

namespace AZMongoBak.SharedServices {
    public class AppConfigService {
        public readonly AppConfig settings;
        public readonly bool OK;

        public AppConfigService(ConfigurationManager config_mngr) {
            var app_config = config_mngr.GetSection("AzMongoBak").Get<AppConfig>();
            
            if (app_config is not null) {
                this.settings = app_config;
                this.OK = app_config.IsValid();
            }
            else {
                this.settings = new AppConfig();
                this.OK = false;
                Console.WriteLine($"{DateTime.Now} STARTUP ERROR: Invalid app configuration");
            }
        }
    }
}