using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AZMongoBak.MongoDb.Collections {
    public class Backup {

        [BsonElement("oid")]
        public string oid { get; set; } = Guid.NewGuid().ToString();

        [BsonElement("date_created")]
        public DateTime date_created { get; set; } = DateTime.UtcNow;

        [BsonElement("blob_path")]
        public string blob_path { get; set; } = "";

        [BsonElement("stored")]
        public bool stored { get; set; } = false;

        [BsonElement("job")]
        public BackupJob job { get; set; } = new BackupJob();



        public Backup() { }

        public bool HasExpired(int retention_days) {
            var expires = this.date_created.AddDays(retention_days);
            return DateTime.UtcNow.Date > expires.Date ? true : false;
        }
    }
}