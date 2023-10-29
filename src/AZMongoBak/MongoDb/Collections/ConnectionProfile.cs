using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace AZMongoBak.MongoDb.Collections {
    public class ConnectionProfile {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string oid { get; set; } = null!;

        [BsonElement("displayname")]
        public string displayname { get; set; } = "";

        [BsonElement("mongo_connection")]
        public string mongo_connection { get; set; } = "";

        [BsonElement("date_created")]
        public DateTime date_created { get; set; } = DateTime.UtcNow;


        public ConnectionProfile() { }


        public bool IsValid() {
            return !string.IsNullOrEmpty(this.displayname)
                && !string.IsNullOrEmpty(this.mongo_connection)
                ? true : false;
        }
    }
}