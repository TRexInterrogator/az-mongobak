using AZMongoBak;
using AZMongoBak.MongoDb.Collections;
using AZMongoBak.SharedServices;
using MongoDB.Driver;

namespace MongoDbBackup.MongoDb.Providers {
    public class ConnectionProfileProvider {
        private readonly DbService _db_service;
        private readonly ILogger _logger;

        public ConnectionProfileProvider(DbService db_service, ILogger logger) {
            this._db_service = db_service;
            this._logger = logger;
        }


        /// <summary>
        /// Creates a new connection profile
        /// </summary>
        /// <param name="profile">ConnectionProfile datamodel</param>
        /// <returns>boolean - success state</returns>
        public async Task<bool> CreateNewProfileAsync(ConnectionProfile profile) {

            var success = false;

            try {
                if (profile.IsValid()) {
                    profile.oid = Guid.NewGuid().ToString();
                    profile.date_created = DateTime.UtcNow;

                    if (this._db_service.ConnectionProfiles is not null) {
                        await this._db_service.ConnectionProfiles.InsertOneAsync(profile);
                        success = true;
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.Database, ex, "Failed to save new connection profile to db");
            }

            return success;
        }


        /// <summary>
        /// Lists all connetion profiles available
        /// </summary>
        /// <returns>DBConnectionProfile[]</returns>
        public async Task<List<ConnectionProfile>> ListAllProfilesAsync() {

            var profiles = new List<ConnectionProfile>();

            try {
                if (this._db_service.ConnectionProfiles is not null) {
                    profiles = await this._db_service.ConnectionProfiles
                        .Find(_ => true)
                        .SortBy(e => e.displayname)
                        .ToListAsync();
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.Database, ex, "Failed to list all connection profiles");
            }

            return profiles;
        }


        /// <summary>
        /// Returns connection profile by oid
        /// </summary>
        /// <param name="oid">profile oid</param>
        /// <returns>DBConnectionProfile | null</returns>
        public async Task<ConnectionProfile?> GetProfileAsync(string oid) {

            ConnectionProfile? profile = null;

            try {
                if (!string.IsNullOrEmpty(oid)) {
                    if (this._db_service.ConnectionProfiles is not null) {
                        profile = await this._db_service.ConnectionProfiles
                            .Find(x => x.oid == oid)
                            .FirstOrDefaultAsync();
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.Database, ex, "Failed to get connection profile by oid");
            }

            return profile;
        }


        /// <summary>
        /// Deletes a connection profile (checks for in-use)
        /// </summary>
        /// <param name="oid">Profile oid</param>
        /// <returns>boolean - success state</returns>
        public async Task<bool> DeleteProfileAsync(string oid) {

            var success = false;

            try {
                if (!string.IsNullOrEmpty(oid)) {
                    var exists = await this.GetProfileAsync(oid);

                    if (exists is not null) {
                        if (this._db_service.ConnectionProfiles is not null && this._db_service.BackupInfos is not null) {
                            var amnt_inuse = await this._db_service.BackupInfos.CountDocumentsAsync(x => x.connection_profile == exists.oid);

                            if (amnt_inuse == 0) {
                                await this._db_service.ConnectionProfiles.DeleteOneAsync(x => x.oid == exists.oid);
                                success = true;
                            }
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.Database, ex, "Failed to delete connection profile");
            } 

            return success;
        }


        /// <summary>
        /// Updates / replaces existing connection profile
        /// </summary>
        /// <param name="update">DBConnectionProfile update</param>
        /// <returns>DBConnectionProfile | null</returns>
        public async Task<ConnectionProfile?> UpdateProfileAsync(ConnectionProfile update) {

            ConnectionProfile? new_profile = null;

            try {
                if (update.IsValid()) {
                    var exists = await this.GetProfileAsync(update.oid);
                    
                    if (exists is not null) {
                        if (this._db_service.ConnectionProfiles is not null) {
                            await this._db_service.ConnectionProfiles.ReplaceOneAsync(x => x.oid == update.oid, update);
                            new_profile = update;
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.Database, ex, "Failed to update connection profile");
            }

            return new_profile;
        } 


        /// <summary>
        /// Lists all database names available for current connection
        /// </summary>
        /// <param name="connection">DB Connection profile</param>
        /// <returns>string[]</returns>
        /* public async Task<List<string>> ListDbsForConnection(string? profile_oid) {

            var db_names = new List<string>();

            try {
                if (!string.IsNullOrEmpty(profile_oid)) {
                    var profile = await this.GetProfileAsync(profile_oid);

                    if (profile is not null) {
                        var backup_provider = new BackupJobProvider(profile, null, null);
                        db_names = await backup_provider.ListDatabasesNamesAsync();
                    }
                }
            }
            catch (Exception ex) {
                DockerLogger.LogError(ex);
            }

            return db_names;
        } */
    }
}