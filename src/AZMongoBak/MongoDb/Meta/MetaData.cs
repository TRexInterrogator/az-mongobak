using MongoDB.Bson.Serialization.Attributes;

namespace AZMongoBak.MongoDb.Meta {
    public class MetaData {

        [BsonElement("event_title")]
        public string event_title { get; set; } = "";

        [BsonElement("date_created")]
        public DateTime date_created { get; set; } = DateTime.UtcNow;

        [BsonElement("user_oid")]
        public string? user_oid { get; set; }

        [BsonElement("user_name")]
        public string? user_name { get; set; }

        [BsonElement("user_email")]
        public string? user_email { get; set; }


        public MetaData() { }
    }
}