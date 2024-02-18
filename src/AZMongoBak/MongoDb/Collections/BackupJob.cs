using MongoDB.Bson.Serialization.Attributes;

namespace AZMongoBak.MongoDb.Collections {
    public class BackupJob {
        
        [BsonElement("job_oid")]
        public string job_oid { get; set; } = Guid.NewGuid().ToString();

        [BsonElement("date_start")]
        public DateTime date_start { get; set; } = DateTime.UtcNow;

        [BsonElement("date_end")]
        public DateTime? date_end { get; set; }

        [BsonElement("done")]
        public bool done { get; set; } = false;
        
        [BsonElement("output")]
        public string output { get; set; } = "";

        public BackupJob() {}
    }
}