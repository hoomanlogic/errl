using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace Errl.Server.Controllers.Api
{
    [Authorize]
    public class StatusController : ApiController
    {
        #region Public API
        [Route("api/errorsummary")]
        public dynamic GetErrorSummary(string product, string environment, string version, DateTime? date, string hour, string objectName)
        {
            return ErrorSummary(product, environment, version, date, hour, objectName);
        }

        [Route("api/hourlysummary")]
        public dynamic GetHourlySummary(string product, string environment, string version, DateTime? date)
        {
            return HourlySummary(product, environment, version, date);
        }

        [Route("api/needsrefresh")]
        public bool GetNeedsRefresh(string product, string environment, string version, DateTime? date)
        {
            return NeedsRefresh(product, environment, version, date);
        }
        #endregion

        #region Private API
        private dynamic ErrorSummary(string product, string environment, string version, DateTime? date, string hour, string objectName)
        {
            string userId = User.Identity.GetUserId();

            List<KeyValuePair<string, int>> timesOccurred = new List<KeyValuePair<string, int>>();
            List<object> details = new List<object>();
            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                try
                {
                    // open connection
                    connection.Open();

                    if (objectName == "null")
                    {
                        objectName = null;
                    }

                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandType = System.Data.CommandType.Text;
                        command.CommandText =
                            "SELECT ObjectName, COUNT(*) AS TimesOccurred " +
                            "FROM [errl].[Errors] e WITH (NOLOCK) INNER JOIN [errl].[UsersDevelopers] ud WITH (NOLOCK) ON e.[DeveloperId] = ud.[DeveloperId] " +
                            "WHERE ud.[UserId] = @UserId AND [ProductName] = @ProductName AND [Environment] = @Environment AND [Version] = @Version " +
                                "AND (@Date IS NULL OR @Date = DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred))) " +
                                "AND (@Hour IS NULL OR @Hour = REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2))) " +
                                "AND (@ObjectName IS NULL OR @ObjectName = ObjectName) " +
                            "GROUP BY ObjectName " +
                            "ORDER BY COUNT(*) DESC";

                        command.Parameters.Add(new SqlParameter("@UserId", userId));
                        command.Parameters.Add(new SqlParameter("@ProductName", product));
                        command.Parameters.Add(new SqlParameter("@Environment", environment));
                        command.Parameters.Add(new SqlParameter("@Version", version));
                        command.Parameters.Add(new SqlParameter("@Date", date == null ? System.Data.SqlTypes.SqlDateTime.Null : new System.Data.SqlTypes.SqlDateTime(date.Value)));
                        command.Parameters.Add(new SqlParameter("@Hour", hour == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(hour)));
                        command.Parameters.Add(new SqlParameter("@ObjectName", objectName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(objectName)));

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                timesOccurred.Add(new KeyValuePair<string, int>(reader.GetString(0), reader.GetInt32(1)));
                            }

                            reader.Close();
                        }

                    }

                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandText =
                            "SELECT ErrorType, LEFT(ErrorDescription, 255), ObjectName, SubName, MAX(Occurred) AS LatestOccurrence, COUNT(*) AS TimesOccurred, COUNT(DISTINCT e.UserId) AS UsersAffected " +
                            "FROM [errl].[Errors] e WITH (NOLOCK) INNER JOIN [errl].[UsersDevelopers] ud WITH (NOLOCK) ON e.[DeveloperId] = ud.[DeveloperId] " +
                            "WHERE ud.[UserId] = @UserId AND [ProductName] = @ProductName AND [Environment] = @Environment AND [Version] = @Version " +
                                "AND (@Date IS NULL OR @Date = DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred))) " +
                                "AND (@Hour IS NULL OR @Hour = REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2))) " +
                                "AND (@ObjectName IS NULL OR @ObjectName = ObjectName) " +
                            "GROUP BY ErrorType, LEFT(ErrorDescription, 255), ObjectName, SubName " +
                            "ORDER BY COUNT(*) DESC, MAX(Occurred) DESC, ErrorType";

                        command.Parameters.Add(new SqlParameter("@UserId", userId));
                        command.Parameters.Add(new SqlParameter("@ProductName", product));
                        command.Parameters.Add(new SqlParameter("@Environment", environment));
                        command.Parameters.Add(new SqlParameter("@Version", version));
                        command.Parameters.Add(new SqlParameter("@Date", date == null ? System.Data.SqlTypes.SqlDateTime.Null : new System.Data.SqlTypes.SqlDateTime(date.Value)));
                        command.Parameters.Add(new SqlParameter("@Hour", hour == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(hour)));
                        command.Parameters.Add(new SqlParameter("@ObjectName", objectName == null ? System.Data.SqlTypes.SqlString.Null : new System.Data.SqlTypes.SqlString(objectName)));

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                details.Add(new
                                {
                                    ErrorType = reader.GetString(0),
                                    ErrorDescription = reader.GetString(1),
                                    ObjectName = reader.GetString(2),
                                    SubName = reader.GetString(3),
                                    LatestOccurrence = reader.GetDateTime(4),
                                    TimesOccurred = reader.GetInt32(5),
                                    UsersAffected = reader.GetInt32(6)
                                });
                            }

                            reader.Close();
                        }

                    }

                }
                catch (Exception ex)
                {
                    return new { Data = "", Error = ex.Message };
                }
            }
            return new { TimesOccurred = timesOccurred, Details = details };
        }

        private dynamic HourlySummary(string product, string environment, string version, DateTime? date)
        {
            string userId = User.Identity.GetUserId();

            List<KeyValuePair<string, int>> timesOccurred = new List<KeyValuePair<string, int>>();
            List<KeyValuePair<string, int>> procsAffected = new List<KeyValuePair<string, int>>();
            List<KeyValuePair<string, int>> usersAffected = new List<KeyValuePair<string, int>>();

            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                // open connection
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText =
                        "SELECT DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred)), COUNT(*) AS TimesOccurred, COUNT(DISTINCT ObjectName + '|' + SubName) AS ProcsAffected, COUNT(DISTINCT e.UserId) AS UsersAffected, REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour]  " +
                        "FROM [errl].[Errors] e WITH (NOLOCK) INNER JOIN [errl].[UsersDevelopers] ud WITH (NOLOCK) ON e.[DeveloperId] = ud.[DeveloperId] " +
                        "WHERE (@Date IS NULL OR @Date = DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred))) AND ud.[UserId] = @UserId AND [ProductName] = @ProductName AND [Environment] = @Environment AND [Version] = @Version " +
                        "GROUP BY DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred)), REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                        "ORDER BY DATEADD(dd, 0, DATEDIFF(dd, 0, Occurred)), REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2))";

                    command.Parameters.Add(new SqlParameter("@UserId", userId));
                    command.Parameters.Add(new SqlParameter("@ProductName", product));
                    command.Parameters.Add(new SqlParameter("@Environment", environment));
                    command.Parameters.Add(new SqlParameter("@Version", version));
                    command.Parameters.Add(new SqlParameter("@Date", date == null ? System.Data.SqlTypes.SqlDateTime.Null : new System.Data.SqlTypes.SqlDateTime(date.Value)));

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            timesOccurred.Add(new KeyValuePair<string, int>(string.Format("{0} {1}", reader.GetDateTime(0).ToShortDateString(), reader.GetString(4)), reader.GetInt32(1)));
                            procsAffected.Add(new KeyValuePair<string, int>(string.Format("{0} {1}", reader.GetDateTime(0).ToShortDateString(), reader.GetString(4)), reader.GetInt32(2)));
                            usersAffected.Add(new KeyValuePair<string, int>(string.Format("{0} {1}", reader.GetDateTime(0).ToShortDateString(), reader.GetString(4)), reader.GetInt32(3)));
                        }
                        reader.Close();
                    }
                }
                
            }
            return new { TimesOccurred = timesOccurred, ProcsAffected = procsAffected, UsersAffected = usersAffected, LatestPoll = DateTime.UtcNow };
        }

        private bool NeedsRefresh(string product, string environment, string version, DateTime? date)
        {
            string userId = User.Identity.GetUserId();

            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                try
                {
                    // open connection
                    connection.Open();

                    // use authentication to find developerId
                    string developerId = "54263eb4-6ced-49bf-9bd7-14f0106c2a02";

                    using (SqlCommand command = connection.CreateCommand())
                    {
                        command.CommandType = System.Data.CommandType.Text;
                        command.CommandText =
                            "SELECT MAX(Occurred)  " +
                            "FROM [errl].[Errors] e WITH (NOLOCK) INNER JOIN [errl].[UsersDevelopers] ud WITH (NOLOCK) ON e.[DeveloperId] = ud.[DeveloperId] " +
                            "WHERE ud.[UserId] = @UserId AND [ProductName] = @ProductName AND [Environment] = @Environment AND [Version] = @Version ";

                        command.Parameters.Add(new SqlParameter("@UserId", userId));
                        command.Parameters.Add(new SqlParameter("@ProductName", product));
                        command.Parameters.Add(new SqlParameter("@Environment", environment));
                        command.Parameters.Add(new SqlParameter("@Version", version));

                        object result = command.ExecuteScalar();

                        DateTime latestError = (DateTime)result;

                        return latestError > date.Value.ToUniversalTime();
                    }
                }
                catch
                {
                    return false;
                }
            }
        }
        #endregion
    }
}
