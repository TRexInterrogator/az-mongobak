using AZMongoBak.ControllerAuth;
using AZMongoBak.MongoDb.Collections;
using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDbBackup.MongoDb.Providers;

namespace AZMongoBak.Controllers {
    
    [Authorize]
    [AdminAuth]
    [ApiController]
    [Route("api/connectionProfiles")]
    [Produces("application/json")]
    public class ConnectionProfileController : ControllerBase {
        private readonly ConnectionProfileProvider _conprof_prov;

        public ConnectionProfileController(ILogger<ConnectionProfileController> logger, DbService db_service) {
            this._conprof_prov = new ConnectionProfileProvider(db_service, logger);
        }


        /// <summary>
        /// Creates a new database connection profile
        /// </summary>
        /// <param name="profile">DBConnectionProfile datamodel</param>
        /// <returns>201 | 400</returns>
        [HttpPost("new")]
        public async Task<IActionResult> PostNewConnectionAsync(ConnectionProfile profile) {
            var created = await this._conprof_prov.CreateNewProfileAsync(profile);
            return created ? this.Created() : this.BadRequest();
        }


        /// <summary>
        /// Lists all current connection profiles
        /// </summary>
        /// <returns>DBConnectionProfile[]</returns>
        [HttpGet("list")]
        public async Task<IActionResult> GetAllConnectionProfilesAsync() {
            var all_profiles = await this._conprof_prov.ListAllProfilesAsync();
            return this.Ok(all_profiles);
        }


        /// <summary>
        /// Returns connection profile by oid
        /// </summary>
        /// <param name="oid">Profile oid</param>
        /// <returns>DBConnectionProfile | 404</returns>
        [HttpGet("byoid")]
        public async Task<IActionResult> GetProfileByOidAsync([FromQuery(Name = "oid")] string oid) {
            var profile = await this._conprof_prov.GetProfileAsync(oid);
            return profile is not null ? this.Ok(profile) : this.NotFound();
        }


        /// <summary>
        /// Deletes connection profile (in-use check)
        /// </summary>
        /// <param name="oid">Profile oid</param>
        /// <returns>204 - 400</returns>
        [HttpDelete("profile")] 
        public async Task<IActionResult> DeleteProfileAsync([FromQuery(Name = "oid")] string oid) {
            var deleted = await this._conprof_prov.DeleteProfileAsync(oid);
            return deleted ? this.NoContent() : this.BadRequest();
        }


        /// <summary>
        /// Updates an existing connection profile
        /// </summary>
        /// <param name="profile">Update data</param>
        /// <returns>DBConnectionProfile | 400</returns>
        [HttpPatch("profile")]
        public async Task<IActionResult> UpdateProfileAsync(ConnectionProfile profile) {
            var updated = await this._conprof_prov.UpdateProfileAsync(profile);
            return updated is not null ? this.Ok(updated) : this.BadRequest();
        }
    }
}