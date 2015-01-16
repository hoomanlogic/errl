using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace Errl.Server.Controllers
{
    [Authorize]
    public class OptionsController : ApiController
    {
        public dynamic Get()
        {
            string userId = User.Identity.GetUserId();

            List<dynamic> Distributions = new List<dynamic>();

            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                try
                {
                    // open connection
                    connection.Open();

                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandType = System.Data.CommandType.Text;
                        command.CommandText =
                            "SELECT DISTINCT ProductName, Environment, Version " +
                            "FROM [errl].[Errors] e WITH (NOLOCK) INNER JOIN [errl].[UsersDevelopers] ud WITH (NOLOCK) ON e.[DeveloperId] = ud.[DeveloperId] " +
                            "WHERE ud.[UserId] = @UserId " +
                            "ORDER BY ProductName, Environment, Version";

                        command.Parameters.Add(new SqlParameter("@UserId", userId));

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Distributions.Add(new
                                {
                                    Product = reader.GetString(0),
                                    Environment = reader.GetString(1),
                                    Version = reader.GetString(2),
                                });
                            }
                        }
                    }
                }
                catch
                {
                    return false;
                }
            }

            return Distributions;
        }
    }
}
