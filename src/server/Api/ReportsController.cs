using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Errl.Server.Controllers.Api
{
    [Authorize]
    public class ReportsController : ApiController
    {
        public dynamic GetReport_RecentVersionsComparison(string report, string product, string environment)
        {
            string query1 = 
                "SELECT TOP 3 Sub.[Version], Ver.EarliestError AS RolledOutOn, DATEDIFF(d, Ver.EarliestError, Ver.LatestError) AS DaysRunning, AVG(Sub.TimesOccurred) AS AverageErrorsPerHour, AVG(Sub.UsersAffected) AS AverageUsersAffectedPerHour " +
                "FROM ( " +
                "    SELECT LEFT([Version], 5) AS [Version], " +
                "        CAST(DATEPART(yyyy, Occurred) AS VARCHAR(4)) AS [Year], " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)) AS [Month],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)) AS [Day],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour],  " +
                "        COUNT(*) AS TimesOccurred, COUNT(DISTINCT UserId) AS UsersAffected " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5),  " +
                "        CAST(DATEPART(yyyy, Occurred) AS VARCHAR(4)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub INNER JOIN ( " +
                "    SELECT LEFT([Version], 5) AS [Version],  " +
                "           MIN(Occurred) AS EarliestError,  " +
                "           MAX(Occurred) AS LatestError,  " +
                "           COUNT(DISTINCT ErrorType + '|' + ObjectName + '|' + SubName) AS NumOfIssues " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5)  " +
                ") AS Ver ON Sub.[Version] = Ver.[Version] " +
                "GROUP BY Sub.[Version], Ver.EarliestError, Ver.LatestError " +
                "ORDER BY Sub.[Version] DESC";

            string query2 = 
                "SELECT TOP 3 [Version], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19] " +
                "FROM ( " +
                "    SELECT LEFT([Version], 5) AS [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(*) AS TimesOccurred " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(TimesOccurred) " +
                "    FOR [Hour] IN ([07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query3 =
                "SELECT TOP 3 [Version], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19] " +
                "FROM ( " +
                "    SELECT LEFT([Version], 5) AS [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT UserId) AS UsersAffected " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT " + 
                "( " +
                "    AVG(UsersAffected) " +
                "    FOR [Hour] IN ([07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query4 =
                "SELECT TOP 3 [Version], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19] " +
                "FROM ( " +
                "    SELECT LEFT([Version], 5) AS [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT ErrorType + '|' + ObjectName + '|' + SubName) AS NumOfIssues " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(NumOfIssues) " +
                "    FOR [Hour] IN ([07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query5 =
                "SELECT TOP 3 [Version], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19] " +
                "FROM ( " +
                "    SELECT LEFT([Version], 5) AS [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)) + REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)) ) AS NumOfDays " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [Version] NOT LIKE 'SL%' AND [Version] NOT LIKE '0.%'  " +
                "    GROUP BY LEFT([Version], 5),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(NumOfDays) " +
                "    FOR [Hour] IN ([07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            using (SqlConnection connection = new SqlConnection(Helpers.GetConnectionString()))
            {
                List<object> list1 = new List<object>();
                List<object> list2 = new List<object>();
                List<object> list3 = new List<object>();
                List<object> list4 = new List<object>();
                List<object> list5 = new List<object>();

                // open connection
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query2;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list2.Add( new { 
                                Version = reader.GetString(0), 
                                Hour07 = reader.GetInt32(1),
                                Hour08 = reader.GetInt32(2),
                                Hour09 = reader.GetInt32(3),
                                Hour10 = reader.GetInt32(4),
                                Hour11 = reader.GetInt32(5),
                                Hour12 = reader.GetInt32(6),
                                Hour13 = reader.GetInt32(7),
                                Hour14 = reader.GetInt32(8),
                                Hour15 = reader.GetInt32(9),
                                Hour16 = reader.GetInt32(10),
                                Hour17 = reader.GetInt32(11),
                                Hour18 = reader.GetInt32(12),
                                Hour19 = reader.GetInt32(13)
                            });
                        }

                        reader.Close();
                    }
                }

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query3;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list3.Add(new
                            {
                                Version = reader.GetString(0),
                                Hour07 = reader.GetInt32(1),
                                Hour08 = reader.GetInt32(2),
                                Hour09 = reader.GetInt32(3),
                                Hour10 = reader.GetInt32(4),
                                Hour11 = reader.GetInt32(5),
                                Hour12 = reader.GetInt32(6),
                                Hour13 = reader.GetInt32(7),
                                Hour14 = reader.GetInt32(8),
                                Hour15 = reader.GetInt32(9),
                                Hour16 = reader.GetInt32(10),
                                Hour17 = reader.GetInt32(11),
                                Hour18 = reader.GetInt32(12),
                                Hour19 = reader.GetInt32(13)
                            });
                        }

                        reader.Close();
                    }
                }

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query4;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list4.Add(new
                            {
                                Version = reader.GetString(0),
                                Hour07 = reader.GetInt32(1),
                                Hour08 = reader.GetInt32(2),
                                Hour09 = reader.GetInt32(3),
                                Hour10 = reader.GetInt32(4),
                                Hour11 = reader.GetInt32(5),
                                Hour12 = reader.GetInt32(6),
                                Hour13 = reader.GetInt32(7),
                                Hour14 = reader.GetInt32(8),
                                Hour15 = reader.GetInt32(9),
                                Hour16 = reader.GetInt32(10),
                                Hour17 = reader.GetInt32(11),
                                Hour18 = reader.GetInt32(12),
                                Hour19 = reader.GetInt32(13)
                            });
                        }

                        reader.Close();
                    }
                }

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query5;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            list5.Add(new
                            {
                                Version = reader.GetString(0),
                                Hour07 = reader.GetInt32(1),
                                Hour08 = reader.GetInt32(2),
                                Hour09 = reader.GetInt32(3),
                                Hour10 = reader.GetInt32(4),
                                Hour11 = reader.GetInt32(5),
                                Hour12 = reader.GetInt32(6),
                                Hour13 = reader.GetInt32(7),
                                Hour14 = reader.GetInt32(8),
                                Hour15 = reader.GetInt32(9),
                                Hour16 = reader.GetInt32(10),
                                Hour17 = reader.GetInt32(11),
                                Hour18 = reader.GetInt32(12),
                                Hour19 = reader.GetInt32(13)
                            });
                        }

                        reader.Close();
                    }
                }
                return new { Query2 = list2, Query3 = list3, Query4 = list4, Query5 = list5 };

            }
        }
    }
}
