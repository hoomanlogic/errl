using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Errl.Server.Controllers
{
    public class ReportOptionsController : ApiController
    {
        public dynamic Get()
        {

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
                            "SELECT DISTINCT ProductName, Environment " +
                            "FROM [dbo].[Errors] e WITH (NOLOCK) " +
                            "ORDER BY ProductName, Environment";

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Distributions.Add(new
                                {
                                    Product = reader.GetString(0),
                                    Environment = reader.GetString(1)
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
