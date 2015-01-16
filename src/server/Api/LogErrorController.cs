using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Errl.Server.Controllers
{
    [AllowAnonymous]
    public class LogErrorController : ApiController
    {
        
        public class ErrorModel
        {
            public string Key { get; set; }
            public string Environment { get; set; }
            public string Version { get; set; }
            public string ErrorType { get; set; }
            public string ErrorDescription { get; set; }
            public string ProductName { get; set; }
            public string ObjectName { get; set; }
            public string SubName { get; set; }
            public string Details { get; set; }
            public string StackTrace { get; set; }
            public string State { get; set; }
            public string UserId { get; set; }
        }

        //[EnableCors("*", "*", "*")]
        public string Post([FromBody] ErrorModel err)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
                {
                    // open connection
                    connection.Open();

                    // get developer id from key
                    string developerId = Helpers.GetDeveloperId(err.Key);

                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandType = System.Data.CommandType.Text;
                        command.CommandText =
                            "INSERT INTO [errl].[Errors]  " +
                            "VALUES (@DeveloperId, @Id, @Environment, @Version, @ErrorType, @ErrorDescription, @ProductName, @ObjectName, @SubName, @Details, @StackTrace, @State, @UserId, @Occurred)";

                        var id = Guid.NewGuid().ToString().ToLower();
                        command.Parameters.Add(new SqlParameter("@DeveloperId", developerId));
                        command.Parameters.Add(new SqlParameter("@Id", id));
                        command.Parameters.Add(new SqlParameter("@Environment", err.Environment == null ? "(n/a)" : new System.Data.SqlTypes.SqlString(err.Environment)));
                        command.Parameters.Add(new SqlParameter("@Version", err.Version));
                        command.Parameters.Add(new SqlParameter("@ErrorType", err.ErrorType));
                        command.Parameters.Add(new SqlParameter("@ErrorDescription", err.ErrorDescription == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.ErrorDescription)));
                        command.Parameters.Add(new SqlParameter("@ProductName", err.ProductName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.ProductName)));
                        command.Parameters.Add(new SqlParameter("@ObjectName", err.ObjectName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.ObjectName)));
                        command.Parameters.Add(new SqlParameter("@SubName", err.SubName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.SubName)));
                        command.Parameters.Add(new SqlParameter("@Details", err.Details == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.Details)));
                        command.Parameters.Add(new SqlParameter("@StackTrace", err.StackTrace == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.StackTrace)));
                        command.Parameters.Add(new SqlParameter("@State", err.State == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.State)));
                        command.Parameters.Add(new SqlParameter("@UserId", err.UserId == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(err.UserId)));
                        command.Parameters.Add(new SqlParameter("@Occurred", DateTime.UtcNow));

                        command.ExecuteNonQuery();

                        return id;
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
