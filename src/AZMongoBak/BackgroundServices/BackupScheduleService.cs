using AZMongoBak.BackupEngine;
using AZMongoBak.SharedServices;
using MongoDB.Driver;

namespace AZMongoBak.BackgroundServices {
    public class BackupScheduleService : BackgroundService {
        private readonly DbService _db_service;
        private readonly ILogger<BackupScheduleService> _logger;
        private readonly AppConfigService _config_service;
        private DateTime _next_execution;

        public BackupScheduleService(
            ILogger<BackupScheduleService> logger,
            DbService db_service, 
            AppConfigService config_service) {
            
            this._logger = logger;
            this._db_service = db_service;
            this._config_service = config_service;

            // Init schedule (run every day at 01:00)
            var now = DateTime.Now;
            var target = new DateTime(now.Year, now.Month, now.Day, 1, 0, 0);
            this._next_execution = now < target ? target : target.AddDays(1);
        }

        /// <summary>
        /// Timer logic - trys to run backup job every 30mins
        /// </summary>
        protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
            this._logger.LogInformation("Timed backup service started");

            // Initial Run
            await this.RunBackupsAsync();

            // Try to run backup job ever 30mins (will only run if next execution matches)
            using PeriodicTimer timer = new(TimeSpan.FromMinutes(30));

            try {
                while (await timer.WaitForNextTickAsync(stoppingToken)) {
                    await this.RunBackupsAsync();
                }
            }
            catch (OperationCanceledException) {
                this._logger.LogInformation("Timed backup service stopping");
            }
        }

        /// <summary>
        /// Background Task running all backups in sequence
        /// </summary>
        private async Task RunBackupsAsync() {
            var now = DateTime.Now;
            
            if (now.Date == this._next_execution.Date && now.Hour == this._next_execution.Hour) {
                if (this._db_service.BackupInfos is not null) {
                    var profiles = await this._db_service.BackupInfos
                        .Find(_ => true)
                        .ToListAsync();

                    foreach (var profile in profiles) {
                        var backup_service = new BackupService(this._db_service, this._config_service, profile, this._logger);
                        
                        // Clean up expired backups (surpassed retention time)
                        await backup_service.RemoveExpiredBackupsAsync();
                        
                        // Start daily backup for all configured dbs
                        await backup_service.RunBackupAsync();
                    }
                }

                // Update next schedule
                this._next_execution = this._next_execution.AddDays(1);
            }
        }
    }
}