using AZMongoBak.ControllerAuth;
using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AZMongoBak.Controllers {
    
    [Authorize]
    [AdminAuth]
    [ApiController]
    [Route("api/user")]
    [Produces("application/json")]
    public class UserController : ControllerBase {
        private readonly ILogger _logger;
        private readonly GraphService _graph;
        private readonly AdminService _admin_serv;

        public UserController(ILogger<UserController> logger, GraphService graph, AdminService admin_serv) {
            this._logger = logger;
            this._graph = graph;
            this._admin_serv = admin_serv;
        }


        /// <summary>
        /// Checks if current user is allowed to use this app
        /// </summary>
        /// <returns>true | 401</returns>
        [HttpGet("verfiyAccess")]
        public IActionResult VerifyAccess() {
            var is_admin = this._admin_serv.IsMember(this.Request, this._logger);
            return is_admin ? this.Ok(true) : this.Unauthorized("User is not listed as admin");
        }
 

        /// <summary>
        /// Returns profile picture for given user account oid
        /// </summary>
        /// <param name="oid">Azure user oid</param>
        /// <returns>Base64 | 404</returns>
        [HttpGet("photo")]
        public async Task<IActionResult> GetProfilePictureAsync([FromQuery(Name = "oid")] string oid) {
            var photo = await this._graph.FetchProfileImageAsync(oid, this._logger);
            return !string.IsNullOrEmpty(photo) ? this.Ok(photo) : this.NotFound();
        }
    }
}