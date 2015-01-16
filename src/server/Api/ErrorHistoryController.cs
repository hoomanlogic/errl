using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Errl.Server.Controllers
{
    [Authorize]
    public class ErrorHistoryController : ApiController
    {
        public dynamic Get(string environment, string version, string errorType, string objectName, string subName, string userId)
        {
            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                List<string> infoItems = new List<string>();
                List<object> errorDetail = new List<object>();

                if (version == "null")
                {
                    version = null;
                }

                if (errorType == "null")
                {
                    errorType = null;
                }

                if (objectName == "null")
                {
                    objectName = null;
                }

                if (subName == "null")
                {
                    subName = null;
                }

                if (userId == "null")
                {
                    userId = null;
                }

                // open connection
                connection.Open();

                // use authentication to find developerId
                string developerId = "54263eb4-6ced-49bf-9bd7-14f0106c2a02";

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.CommandText = "[errl].[GetErrorHistory]";

                    command.Parameters.Add(new SqlParameter("@DeveloperId", developerId));
                    command.Parameters.Add(new SqlParameter("@Version", version == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(version)));
                    command.Parameters.Add(new SqlParameter("@ErrorType", errorType == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(errorType)));
                    command.Parameters.Add(new SqlParameter("@ObjectName", objectName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(objectName)));
                    command.Parameters.Add(new SqlParameter("@SubName", subName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(subName)));
                    command.Parameters.Add(new SqlParameter("@UserId", userId == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(userId)));

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            infoItems.Add(reader.GetString(0));
                        }

                        reader.NextResult();

                        while (reader.Read())
                        {
                            errorDetail.Add( new { 
                                Id = reader.GetString(0),
                                Environment = reader.GetString(1),
                                Version = reader.GetString(2),
                                ErrorType = reader.GetString(3),
                                ErrorDescription = reader.GetString(4),
                                ProductName = reader.GetString(5),
                                ObjectName = reader.GetString(6),
                                SubName = reader.GetString(7),
                                Details = reader.GetString(8),
                                StackTrace = reader.GetString(9),
                                State = reader.GetString(10),
                                UserId = reader.GetString(11),
                                Occurred = reader.GetDateTime(12)
                            });
                        }
                        reader.Close();
                    }
                }

                return new { Info = infoItems, Details = errorDetail};

                
            }
        }
    }
}
