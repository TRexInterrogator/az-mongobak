using AZMongoBak.MongoDb.Collections;
using MongoDB.Driver;

namespace AZMongoBak.BackupEngine {
    public class DbConnectionService {
        private readonly IMongoClient _db_client;
        private readonly ILogger _logger;

        public DbConnectionService(ConnectionProfile profile, ILogger logger) {
            this._logger = logger;
            this._db_client = new MongoClient(profile.mongo_connection);
        }


        /// <summary>
        /// Returns list of databases for current connection
        /// </summary>
        /// <returns>string[]</returns>
        public async Task<List<string>> ListDbsAsync() {

            var db_names = new List<string>();

            try {
                var mongo_dbs = await this._db_client.ListDatabaseNamesAsync();
                db_names = mongo_dbs.ToList().OrderBy(e => e).ToList();
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, "Failed to list dbs for current connection");
            }

            return db_names;
        }
    }
}