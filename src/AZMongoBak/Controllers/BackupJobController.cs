using AZMongoBak.BackgroundServices;
using AZMongoBak.ControllerAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AZMongoBak.Controllers {
    
    //[Authorize]
    //[AdminAuth]
    [ApiController]
    [Route("api/backupJobs")]
    [Produces("application/json")]
    public class BackupJobController : ControllerBase {
        private readonly IBackgroundTaskQueue _queue;

        public BackupJobController(IBackgroundTaskQueue queue) {
            this._queue = queue;
        }


        [HttpGet("test")]
        public async Task<IActionResult> RunTestAsync() {
            await this._queue.QueueBackgroundWorkItemAsync(this.RunTestAsync);
            return this.Ok(true);
        }


        private async ValueTask RunTestAsync(CancellationToken token) {
            var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            Console.WriteLine($"{timestamp} Starting background job");

            await Task.Delay(5000);

            timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            Console.WriteLine($"{timestamp} Job done");
        }
    }
}