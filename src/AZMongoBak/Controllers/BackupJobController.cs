using AZMongoBak.BackgroundServices;
using AZMongoBak.BackupEngine;
using AZMongoBak.ControllerAuth;
using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AZMongoBak.Controllers {
    
    [Authorize]
    [AdminAuth]
    [ApiController]
    [Route("api/backupJobs")]
    [Produces("application/json")]
    public class BackupJobController : ControllerBase {
        private readonly BackupProvider _backup_provider;

        public BackupJobController(
            DbService db, 
            AppConfigService config_service, 
            ILogger<BackupJobController> logger, 
            IBackgroundTaskQueue queue) {
            
            this._backup_provider = new BackupProvider(db, config_service, logger, queue);
        }


        /// <summary>
        /// Manually starty a new backup
        /// </summary>
        /// <param name="oid">Backup profile oid</param>
        /// <returns>202</returns>
        [HttpGet("startJob")]
        public async Task<IActionResult> StartJobAsync([FromQuery(Name = "oid")] string oid) {
            await this._backup_provider.QueueBackupAsync(oid);
            return this.Accepted();
        }
    }
}