using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using AZMongoBak.MongoDb.Meta;

namespace AZMongoBak.MongoDb.Collections {
    public class BackupInfo {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? oid { get; set; }

        [BsonElement("display_name")]
        public string display_name { get; set; } = "";

        [BsonElement("database")]
        public string database { get; set; } = "";

        [BsonElement("connection_profile")]
        public string connection_profile { get; set; } = "";

        [BsonElement("backups")]
        public List<Backup> backups { get; set; } = new List<Backup>();

        [BsonElement("retention_days")]
        public int retention_days { get; set; } = 14;

        [BsonElement("meta_data")]
        public MetaData? meta_data { get; set; } = null;


        public BackupInfo() { }

        public bool IsFormValid() {
            return !string.IsNullOrEmpty(this.connection_profile)
                && !string.IsNullOrEmpty(this.database)
                && !string.IsNullOrEmpty(this.display_name)
                && this.retention_days > 0
                ? true : false;
        }
    }
}