using AZMongoBak.MongoDb.Collections;

namespace AZMongoBak.Models {
    public class MiniBackupInfo {
        public string oid { get; set; } = "";
        public string display_name { get; set; } = "";

        public MiniBackupInfo() {}
        public MiniBackupInfo(BackupInfo info) {
            this.oid = info.oid;
            this.display_name = info.display_name;
        }
    }
}