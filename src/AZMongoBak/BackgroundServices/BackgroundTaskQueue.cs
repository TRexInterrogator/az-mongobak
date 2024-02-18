using System.Threading.Channels;

// Main queue for any long running job
// Will be monitored by Hosted Service
namespace AZMongoBak.BackgroundServices {
    public interface IBackgroundTaskQueue {
        ValueTask QueueBackgroundWorkItemAsync(Func<CancellationToken, ValueTask> work_item);
        ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellation_token);
    }



    public class BackgroundTaskQueue : IBackgroundTaskQueue {

        private readonly Channel<Func<CancellationToken, ValueTask>> _queue;

        /// <summary>
        /// Creates new background task-queue
        /// </summary>
        /// <param name="capacity">Maximum amount of jobs in queue</param>
        public BackgroundTaskQueue(int capacity) {
            var options = new BoundedChannelOptions(capacity){ FullMode = BoundedChannelFullMode.Wait };
            this._queue = Channel.CreateBounded<Func<CancellationToken, ValueTask>>(options);
        }


        /// <summary>
        /// Consumes task from channel and executes in background
        /// </summary>
        public async ValueTask<Func<CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellation_token) {
            var work_item = await this._queue.Reader.ReadAsync(cancellation_token);
            return work_item;
        }


        /// <summary>
        /// Adds new task to channel (like ToDo list)
        /// </summary>
        public async ValueTask QueueBackgroundWorkItemAsync(Func<CancellationToken, ValueTask> work_item) {
            await this._queue.Writer.WriteAsync(work_item);
        }
    }
}