using AZMongoBak.MongoDb.Collections;
using MongoDB.Driver;

namespace AZMongoBak.SharedServices {
    public class DbService {
        public IMongoCollection<ConnectionProfile>? ConnectionProfiles { get; set; }
        public IMongoCollection<BackupInfo>? BackupInfos { get; set; }


        public DbService(AppConfigService config_serv) {
            if (config_serv.OK) {
                var client = new MongoClient(config_serv.settings.MongoDbConnection);
                var database = client.GetDatabase(config_serv.settings.MongoDbDatabase);

                this.ConnectionProfiles = database.GetCollection<ConnectionProfile>("ConnectionProfiles");
                this.BackupInfos = database.GetCollection<BackupInfo>("BackupInfos");
            }
        }
    }
}