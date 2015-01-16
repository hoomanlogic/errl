using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace Errl.Server
{
    public static class Helpers
    {

        public static string GetConnectionString()
        {
            string server = "basil.arvixe.com";
            return string.Format("data source={0};initial catalog=hoomanlogic;persist security info=True;user id=gmanning;password=H00manL0g1c@;", server);
        }

        public static bool IsDeveloperReady(string userId)
        {
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
                            "SELECT TOP 1 UserId " +
                            "FROM [errl].[UsersDevelopers] WITH (NOLOCK) " +
                            "WHERE [UserId] = @UserId ";

                        command.Parameters.Add(new SqlParameter("@UserId", userId));

                        object result = command.ExecuteScalar();

                        return result != null && ((string)result) == userId;
                    }
                }
                catch
                {
                    return false;
                }
            }
        }


        public static string GetDeveloperId(string developerAlias)
        {
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
                            "SELECT TOP 1 Id " +
                            "FROM [errl].[Developers] WITH (NOLOCK) " +
                            "WHERE [Handle] = @DeveloperAlias OR [Key] = @DeveloperAlias ";

                        command.Parameters.Add(new SqlParameter("@DeveloperAlias", developerAlias));

                        object result = command.ExecuteScalar();

                        return result == null ? null : (string)result;
                    }
                }
                catch
                {
                    return null;
                }
            }
        }

        public static int GetLoggedInUserCount()
        {                
            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                try
                {
                    // open connection
                    connection.Open();

                    SqlCommand command = connection.CreateCommand();
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText =
                        "SELECT COUNT(*) FROM ValidUsers WHERE LoggedIn = 1";

                    command.Parameters.Add(new SqlParameter("@Version", "7.1.0.%"));

                    return (int)command.ExecuteScalar();
                }
                catch
                {
                    return 0;
                }
            }
        } 
    }
}