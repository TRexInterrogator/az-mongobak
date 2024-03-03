using System.Diagnostics;
using System.IO.Compression;
using AZMongoBak.MongoDb.Collections;
using AZMongoBak.SharedServices;
using Azure.Storage.Blobs;
using MongoDB.Driver;

namespace AZMongoBak.BackupEngine {
    public class BackupService {
        private readonly string _blob_connection;
        private readonly string _blob_container;
        private readonly DbService _db;
        private readonly BackupInfo _bak_info;
        private readonly ILogger _logger;
        private readonly string _out_dir;

        public BackupService(
            DbService db_service, 
            AppConfigService config_service, 
            BackupInfo bak_info, 
            ILogger logger) {
            
            this._db = db_service;
            this._bak_info = bak_info;
            this._logger = logger;
            this._blob_connection = config_service.settings.AzBlobConnection;
            this._blob_container = config_service.settings.AzBlobContainer;
            this._out_dir = $"./Backups/{bak_info.database}-{DateTime.Now:yyyy-MM-dd-HH:mm}-{Guid.NewGuid()}";
        }


        public async Task RunBackupAsync() {

            // Create new job
            var bak = new Backup();
            this._bak_info.backups.Add(bak);
            this._logger.LogInformation($"Start backup for: {this._bak_info.oid} {this._bak_info.display_name}");

            try {
                if (this._db.BackupInfos is not null && this._db.ConnectionProfiles is not null) {
                    // Save job to db
                    await this._db.BackupInfos.ReplaceOneAsync(e => e.oid == this._bak_info.oid, this._bak_info);

                    // Get connection profile
                    var connection = await this._db.ConnectionProfiles
                        .Find(e => e.oid == this._bak_info.connection_profile)
                        .FirstOrDefaultAsync();

                    if (connection is not null) {
                        bak.job.AppendOut($"Loaded connection profile: {connection.oid} {connection.displayname}");

                        // Create our directory
                        Directory.CreateDirectory(this._out_dir);
                        bak.job.AppendOut($"Created local directory {this._out_dir}");
                        bak.job.AppendOut("Running mongodump..");

                        // Run mongodump
                        var process = new Process();
                        var start_info = new ProcessStartInfo {
                            FileName = "mongodump",
                            Arguments = $"--uri=\"{connection.mongo_connection}\" --db {this._bak_info.database} -o {this._out_dir}",
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            WorkingDirectory = "./"
                        };

                        process.StartInfo = start_info;
                        process.Start();

                        bak.job.AppendOut(process.StandardError.ReadToEnd());
                        bak.job.AppendOut(process.StandardOutput.ReadToEnd());
                        bak.job.AppendOut("Creating zip from dump..");

                        // Zip out directory
                        var zip_file = $"{this._out_dir}.zip";
                        ZipFile.CreateFromDirectory(this._out_dir, zip_file);
                        bak.job.AppendOut($"Compressed dump: {zip_file}");

                        // Delete local dump
                        Directory.Delete(this._out_dir, true);
                        bak.job.AppendOut("Deleted local dump files");

                        // Upload to blob-storage
                        bak.job.AppendOut("Starting blob storage upload..");
                        var blob_name = await this.UploadBlobAsync(zip_file);

                        if (!string.IsNullOrEmpty(blob_name)) {
                            // Create backup db record
                            bak.job.AppendOut("Successfully uploaded to blob storage");
                            bak.stored = true;
                            bak.blob_path = blob_name;
                        }
                        else {
                            // Job will be ended and saved in finally
                            bak.job.AppendOut("Blob upload failed");
                        }
                    }
                }
            }
            catch (Exception ex) {
                this._logger.LogError(EventIds.BackupService, ex, $"Failed to create backup for db profile: {this._bak_info.oid}");
                bak.job.AppendOut($"Backup engine error: {ex.Message}");
            }
            finally {
                // End job and update job details
                if (this._db.BackupInfos is not null) {
                    bak.job.EndJob();
                    var bak_index = this._bak_info.backups.FindIndex(e => e.oid == bak.oid);

                    if (bak_index >= 0) {
                        this._bak_info.backups[bak_index] = bak;
                        await this._db.BackupInfos.ReplaceOneAsync(e => e.oid == this._bak_info.oid, this._bak_info);
                    }
                }

                this._logger.LogInformation($"Backup job finished: {this._bak_info.oid} {this._bak_info.display_name}");
            }
        } 


        /// <summary>
        /// Uploads local zip backup file to remote storage
        /// </summary>
        /// <param name="zip_file">Path to local zip file</param>
        /// <returns>blob name | null</returns>
        public async Task<string?> UploadBlobAsync(string zip_file) {

            string? blob_name = null;

            if (File.Exists(zip_file)) {
                var blob_service_client = new BlobServiceClient(this._blob_connection);
                var blob_container = blob_service_client.GetBlobContainerClient(this._blob_container);
                var filename = Path.GetFileName(zip_file);
                var blob_client = blob_container.GetBlobClient(filename);

                await blob_client.UploadAsync(zip_file, true);
                blob_name = filename;

                // Delete local zip file
                File.Delete(zip_file);
            }

            return blob_name;
        }
    }
}