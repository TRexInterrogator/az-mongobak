using AZMongoBak.MongoDb.Collections;
using AZMongoBak.SharedServices;
using MongoDB.Bson;
using MongoDB.Driver;

namespace AZMongoBak.MongoDb.Providers {
    public class BackupInfoProvider {
        private readonly DbService _db_service;
        private readonly ILogger _logger;

        public BackupInfoProvider(DbService db_service, ILogger logger) {
            this._db_service = db_service;
            this._logger = logger;
        }


        /// <summary>
        /// Returns backup info data by given oid
        /// </summary>
        /// <param name="oid">backup info oid</param>
        /// <returns>BackupInfo?</returns>
        public async Task<BackupInfo?> GetByOidAsync(string oid) {

            BackupInfo? info = null;

            try {
                if (!string.IsNullOrEmpty(oid)) {
                    if (this._db_service.BackupInfos != null) {
                        info = await this._db_service.BackupInfos
                            .Find(e => e.oid == oid)
                            .FirstOrDefaultAsync();
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to get backup info with oid: {oid}");
            }

            return info;
        }


        /// <summary>
        /// Saves backup info data or will update info props of existing item
        /// </summary>
        /// <param name="data">BackupInfo</param>
        /// <returns>BackupInfo?</returns>
        public async Task<BackupInfo?> SaveInfoAsync(BackupInfo data) {

            BackupInfo? saved = null;

            try {
                if (data.IsFormValid()) {
                    if (this._db_service.BackupInfos != null) {
                        if (!string.IsNullOrEmpty(data.oid)) {
                            // Update existing record
                            var db_item = await this._db_service.BackupInfos
                                .Find(e => e.oid == data.oid)
                                .FirstOrDefaultAsync();

                            if (db_item != null) {
                                // Only update info props
                                db_item.display_name = data.display_name;
                                db_item.database = data.database;
                                db_item.connection_profile = data.connection_profile;
                                db_item.retention_days = data.retention_days;

                                var res = await this._db_service.BackupInfos.ReplaceOneAsync(e => e.oid == db_item.oid, db_item);

                                if (res.ModifiedCount > 0) {
                                    saved = db_item;
                                }
                            }
                        }
                        else {
                            // Save as new record
                            data.oid = ObjectId.GenerateNewId().ToString();
                            data.date_created = DateTime.UtcNow;
                            
                            await this._db_service.BackupInfos.InsertOneAsync(data);
                            saved = data;
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, "Failed to save backup profile");
            }

            return saved;
        }


        /// <summary>
        /// Deletes backup info and all remote backups
        /// </summary>
        /// <param name="oid">backup info oid</param>
        /// <returns>bool</returns>
        public async Task<bool> DeleteAsync(string oid) {

            var deleted = false;

            try {
                if (!string.IsNullOrEmpty(oid) && this._db_service.BackupInfos != null) {
                    var db_item = await this._db_service.BackupInfos
                        .Find(e => e.oid == oid)
                        .FirstOrDefaultAsync();

                    if (db_item != null) {
                        // TODO: Delete remote backup data

                        // Delete db record
                        var res = await this._db_service.BackupInfos.DeleteOneAsync(e => e.oid == oid);

                        if (res.DeletedCount > 0) {
                            deleted = true;
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to delete backup info with oid: {oid}");
            }

            return deleted;   
        }
    }
}