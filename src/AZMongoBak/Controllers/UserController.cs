using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AZMongoBak.Controllers {
    
    [Authorize]
    [ApiController]
    [Route("api/user")]
    [Produces("application/json")]
    public class UserController : ControllerBase {
        private readonly ILogger _logger;
        private readonly GraphService _graph;

        public UserController(ILogger<UserController> logger, GraphService graph) {
            this._logger = logger;
            this._graph = graph;
        }


        [HttpGet("photo")]
        public async Task<IActionResult> GetProfilePictureAsync([FromQuery(Name = "oid")] string oid) {
            var photo = await this._graph.FetchProfileImageAsync(oid, this._logger);
            return !string.IsNullOrEmpty(photo) ? this.Ok(photo) : this.NotFound();
        }
    }
}