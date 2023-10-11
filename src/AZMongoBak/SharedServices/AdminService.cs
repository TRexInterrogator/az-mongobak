namespace AZMongoBak.SharedServices {
    public class AdminService {
        private readonly List<string> _admins;

        public AdminService(List<string> admins) {
            this._admins = admins;
        }
    }
}