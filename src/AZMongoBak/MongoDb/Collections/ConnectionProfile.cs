using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using AZMongoBak.MongoDb.Meta;


namespace AZMongoBak.MongoDb.Collections {
    public class ConnectionProfile {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? oid { get; set; }

        [BsonElement("display_name")]
        public string display_name { get; set; } = "";

        [BsonElement("connection")]
        public string connection { get; set; } = "";

        [BsonElement("user_name")]
        public string? user_name { get; set; }

        [BsonElement("user_pwd")]
        public string? user_pwd { get; set; }

        [BsonElement("use_tls")]
        public bool use_tls { get; set; } = false;

        [BsonElement("auth_db")]
        public string? auth_db { get; set; }

        [BsonElement("meta_data")]
        public MetaData? meta_data { get; set; }


        public ConnectionProfile() { }


        public bool IsValid() {
            return !string.IsNullOrEmpty(this.display_name)
                && !string.IsNullOrEmpty(this.connection)
                ? true : false;
        }
    }
}