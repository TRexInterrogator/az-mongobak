using AZMongoBak.BackgroundServices;
using AZMongoBak.SharedServices;
using Azure.Storage.Blobs;
using MongoDB.Driver;

namespace AZMongoBak.BackupEngine {
    public class BackupProvider {
        private readonly DbService _db;
        private readonly AppConfigService _config_service;
        private readonly ILogger _logger;
        private readonly IBackgroundTaskQueue _queue;
        private readonly string _blob_connection;
        private readonly string _blob_container;

        public BackupProvider(
            DbService db, 
            AppConfigService config_service, 
            ILogger logger, 
            IBackgroundTaskQueue queue) {
            
            this._db = db;
            this._config_service = config_service;
            this._logger = logger;
            this._queue = queue;
            this._blob_connection = config_service.settings.AzBlobConnection;
            this._blob_container = config_service.settings.AzBlobContainer;
        }


        /// <summary>
        /// Init new backup job for background queue
        /// </summary>
        /// <param name="bak_info_oid">Backup profile oid</param>
        public async Task QueueBackupAsync(string bak_info_oid) {

            try {
                if (this._db.BackupInfos is not null) {
                    var bak_info = await this._db.BackupInfos
                        .Find(e => e.oid == bak_info_oid)
                        .FirstOrDefaultAsync();

                    if (bak_info is not null) {
                        var backup_service = new BackupService(this._db, this._config_service, bak_info, this._logger);

                        // Enqueue for backup
                        await this._queue.QueueBackgroundWorkItemAsync(ct => this.RunBackupAsync(backup_service, ct));
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to queue backup: {bak_info_oid}");
            }
        }

        /// <summary>
        /// Value task to be run in background queue
        /// </summary>
        /// <param name="backup_service">BackupService</param>
        /// <param name="ct">Needed for queue processor</param>
        private async ValueTask RunBackupAsync(BackupService backup_service, CancellationToken ct) {
            await backup_service.RunBackupAsync();
        }


        /// <summary>
        /// Deletes single backup from backup profile
        /// </summary>
        /// <param name="bak_info_oid">backup profile oid</param>
        /// <param name="bak_oid">backup oid</param>
        /// <returns>boolean - success state</returns>
        public async Task<bool> DeleteBackupAsync(string bak_info_oid, string bak_oid) {

            var deleted = false;

            try {
                if (!string.IsNullOrEmpty(bak_oid) && !string.IsNullOrEmpty(bak_info_oid)) {
                    if (this._db.BackupInfos is not null) {
                        var bak_info = await this._db.BackupInfos
                            .Find(e => e.oid == bak_info_oid)
                            .FirstOrDefaultAsync();

                        if (bak_info is not null) {
                            var bak = bak_info.backups.FirstOrDefault(e => e.oid == bak_oid);

                            if (bak is not null) {
                                if (await this.DeleteBlobAsync(bak.blob_path)) {
                                    // Remove backup record from db
                                    bak_info.backups.Remove(bak);
                                    await this._db.BackupInfos.ReplaceOneAsync(e => e.oid == bak_info.oid, bak_info);
                                    deleted = true;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to delete backup: {bak_info_oid} - {bak_oid}");
            }

            return deleted;
        }


        /// <summary>
        /// Deletes remote blob from storage
        /// </summary>
        /// <param name="blob_name">blob-name</param>
        /// <returns>boolean - success state</returns>
        private async Task<bool> DeleteBlobAsync(string blob_name) {

            var deleted = false;

            try {
                if (!string.IsNullOrEmpty(blob_name)) {
                    var blob_service_client = new BlobServiceClient(this._blob_connection);
                    var blob_container = blob_service_client.GetBlobContainerClient(this._blob_container);
                    var blob_client = blob_container.GetBlobClient(blob_name);
                    var result = await blob_client.DeleteAsync();

                    if (result is not null) {
                        deleted = true;
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to delete remote blob: {blob_name}");
            }

            return deleted;
        }
    }
}