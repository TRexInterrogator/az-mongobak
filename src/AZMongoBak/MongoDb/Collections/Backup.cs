using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using AZMongoBak.MongoDb.Meta;

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

        [BsonElement("meta_data")]
        public MetaData? meta_data { get; set; } = null;


        public Backup() { }

        public Backup(string new_blob_path, MetaData new_meta_data) {
            // Note: Local zip path == remote blob path
            this.blob_path = new_blob_path;
            this.meta_data = new_meta_data;
        }


        public bool HasExpired(int retention_days) {
            var expires = this.date_created.AddDays(retention_days);
            return DateTime.UtcNow.Date > expires.Date ? true : false;
        }
    }
}