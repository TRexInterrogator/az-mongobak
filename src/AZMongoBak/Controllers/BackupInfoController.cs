using AZMongoBak.ControllerAuth;
using AZMongoBak.MongoDb.Collections;
using AZMongoBak.MongoDb.Providers;
using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AZMongoBak.Controllers {

    [Authorize]
    [AdminAuth]
    [ApiController]
    [Route("api/backupInfo")]
    [Produces("application/json")]
    public class BackupInfoController : ControllerBase {
        private readonly BackupInfoProvider _info_provider;

        public BackupInfoController(
            DbService db_service, 
            ILogger<BackupInfoController> logger,
            AppConfigService config_service) {

            this._info_provider = new BackupInfoProvider(db_service, logger, config_service);
        }


        /// <summary>
        /// Returns backup info by given oid
        /// </summary>
        /// <param name="oid">Info oid</param>
        /// <returns>BackupInfo(200) | 404</returns>
        [HttpGet("byOid")]
        public async Task<IActionResult> GetByOidAsync([FromQuery (Name = "oid")] string oid) {
            var backup_info = await this._info_provider.GetByOidAsync(oid);
            return backup_info != null ? this.Ok(backup_info) : this.NotFound();
        }


        /// <summary>
        /// Saves (changes) to database (just info props)
        /// </summary>
        /// <param name="data">BackupInfo</param>
        /// <returns>BackupInfo(200) | 400</returns>
        [HttpPost("save")]
        public async Task<IActionResult> PostBackupInfoAsync(BackupInfo data) {
            var saved = await this._info_provider.SaveInfoAsync(data);
            return saved != null ? this.Ok(saved) : this.BadRequest();
        }


        /// <summary>
        /// Deletes existing backup info with all remote backups
        /// </summary>
        /// <param name="oid">backup info oid</param>
        /// <returns>200 | 400</returns>
        [HttpDelete("remove")]
        public async Task<IActionResult> DeleteBackupInfoAsync([FromQuery(Name = "oid")] string oid) {
            var success = await this._info_provider.DeleteAsync(oid);
            return success ? this.NoContent() : this.BadRequest();
        }

        
        /// <summary>
        /// Returns minimal db backup info data for links on side pane
        /// </summary>
        /// <returns></returns>
        [HttpGet("list-mini")]
        public async Task<IActionResult> GetMiniDbInfosAsync() {
            var infos = await this._info_provider.ListMiniInfoAsync();
            return this.Ok(infos);
        }
    }
}