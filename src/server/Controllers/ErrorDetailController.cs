using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Errl.Server.Controllers
{
    [Authorize]
    public class ErrorDetailController : Controller
    {
        // GET: ErrorDetail
        [AllowAnonymous]
        public ActionResult Index(string developer, string product, string user, string error)
        {
            if (string.IsNullOrWhiteSpace(developer) || string.IsNullOrWhiteSpace(product) || string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(error))
            {
                return new HttpNotFoundResult();
            }

            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                // open connection
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText =
                        "SELECT e.ErrorType, e.ErrorDescription, e.Details, e.[State], e.StackTrace " +
                        "FROM [errl].[Errors] e INNER JOIN [errl].[Developers] d on e.DeveloperId = d.Id " +
                        "WHERE d.Handle = @DeveloperHandle AND e.ProductName = @ProductName AND e.UserId = @UserId AND e.Id = @Id";

                    command.Parameters.Add(new SqlParameter("@DeveloperHandle", developer));
                    command.Parameters.Add(new SqlParameter("@ProductName", product));
                    command.Parameters.Add(new SqlParameter("@UserId", user));
                    command.Parameters.Add(new SqlParameter("@Id", error));

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ViewBag.ErrorType = reader.GetString(0);
                            ViewBag.ErrorMessage = reader.GetString(1);
                            ViewBag.Details = reader.GetString(2);
                            ViewBag.State = reader.GetString(3);
                            ViewBag.StackTrace = reader.GetString(4);
                        }
                        reader.Close(); 
                    }
                }

               
            }

            ViewBag.AccountName = developer;
            ViewBag.ProductName = product;

            return View();
        }
    }
}