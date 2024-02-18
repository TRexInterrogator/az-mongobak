namespace AZMongoBak.BackgroundServices {
    public class QueueMonitorHostedService : BackgroundService {
        public IBackgroundTaskQueue _task_queue { get; }

        public QueueMonitorHostedService(IBackgroundTaskQueue task_queue) {
            this._task_queue = task_queue;
        }

        protected override async Task ExecuteAsync(CancellationToken stopping_token) {
            await BackgroundProcessing(stopping_token);
        }

        /// <summary>
        /// Monitors task queue for new items
        /// </summary>
        private async Task BackgroundProcessing(CancellationToken stopping_token) {
            while (!stopping_token.IsCancellationRequested) {
                var work_item = await this._task_queue.DequeueAsync(stopping_token);

                try {
                    await work_item(stopping_token);
                }
                catch (Exception ex) {
                    var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
                    Console.WriteLine($"{timestamp} Queue service error: {ex.Message}");
                }
            }
        }
    }
}