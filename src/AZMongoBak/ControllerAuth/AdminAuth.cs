using AZMongoBak.SharedServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AZMongoBak.ControllerAuth {

    [AttributeUsage(AttributeTargets.Class)]
    public sealed class AdminAuth : Attribute, IAuthorizationFilter {

        public void OnAuthorization(AuthorizationFilterContext filter) {

            try {
                var is_admin = false;
                var admin_serv = filter.HttpContext.RequestServices.GetService<AdminService>();

                if (admin_serv is not null) {
                    is_admin = admin_serv.IsMember(filter.HttpContext.Request);
                }

                // Handle invalid auth requests
                if (!is_admin) {
                    filter.Result = new JsonResult("Authentication failed!") { StatusCode = StatusCodes.Status401Unauthorized };
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                
                if (filter is not null) {
                    filter.Result = new JsonResult("Authentication failed!") { StatusCode = StatusCodes.Status500InternalServerError };
                }
            }
        }
    }
}