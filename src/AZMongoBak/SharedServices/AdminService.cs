using System.IdentityModel.Tokens.Jwt;

namespace AZMongoBak.SharedServices {
    public class AdminService {
        private readonly List<string> _admins;

        public AdminService(List<string> admins) {
            this._admins = admins;
        }


        /// <summary>
        /// Checks if current user is allowed to use this application
        /// </summary>
        /// <param name="http_request">HttpRequest</param>
        /// <param name="logger">ILogger</param>
        /// <returns>boolean</returns>
        public bool IsMember(HttpRequest http_request, ILogger logger) {

            var is_member = false;

            try {
                var token = http_request.Headers["Authorization"].ToString();

                if (!string.IsNullOrEmpty(token)) {
                    token = token.Replace("Bearer ", "");
                    var jwt_handler = new JwtSecurityTokenHandler();
                    var jwt_token = jwt_handler.ReadJwtToken(token);

                    if (jwt_token is not null) {
                        var oid_claim = jwt_token.Claims.FirstOrDefault(e => e.Type == "oid");

                        if (oid_claim is not null) {
                            var user_oid = oid_claim.Value;

                            if (!string.IsNullOrEmpty(user_oid)) {
                                is_member = this._admins.Any(e => e == user_oid);
                            }
                        }
                    }
                }
            }
            catch (Exception ex) {
                is_member = false;
                logger.LogError(EventIds.AdminService, ex, "Error while validating admin group access");
            }

            return is_member;
        }


        public bool IsMember(HttpRequest http_request) {

            var is_member = false;

            try {
                var token = http_request.Headers["Authorization"].ToString();

                if (!string.IsNullOrEmpty(token)) {
                    token = token.Replace("Bearer ", "");
                    var jwt_handler = new JwtSecurityTokenHandler();
                    var jwt_token = jwt_handler.ReadJwtToken(token);

                    if (jwt_token is not null) {
                        var oid_claim = jwt_token.Claims.FirstOrDefault(e => e.Type == "oid");

                        if (oid_claim is not null) {
                            var user_oid = oid_claim.Value;

                            if (!string.IsNullOrEmpty(user_oid)) {
                                is_member = this._admins.Any(e => e == user_oid);
                            }
                        }
                    }
                }
            }
            catch {
                is_member = false;
                throw;
            }

            return is_member;
        }
    }
}