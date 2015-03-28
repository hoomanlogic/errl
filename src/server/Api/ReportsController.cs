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
        public dynamic Get(string report, string product, string environment)
        {
            switch (report) {
                case ("Recent Versions Comparison"):
                    return Report_RecentVersionsComparison(product, environment);
            }

            return false;
        }

        private dynamic Report_RecentVersionsComparison(string product, string environment)
        {
            string query1 = 
                "SELECT TOP 3 Sub.[Version], Ver.EarliestError AS RolledOutOn, DATEDIFF(d, Ver.EarliestError, Ver.LatestError) AS DaysRunning, AVG(Sub.TimesOccurred) AS AverageErrorsPerHour, AVG(Sub.UsersAffected) AS AverageUsersAffectedPerHour " +
                "FROM ( " +
                "    SELECT [Version], " +
                "        CAST(DATEPART(yyyy, Occurred) AS VARCHAR(4)) AS [Year], " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)) AS [Month],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)) AS [Day],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour],  " +
                "        COUNT(*) AS TimesOccurred, COUNT(DISTINCT UserId) AS UsersAffected " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version],  " +
                "        CAST(DATEPART(yyyy, Occurred) AS VARCHAR(4)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)),  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub INNER JOIN ( " +
                "    SELECT [Version],  " +
                "           MIN(Occurred) AS EarliestError,  " +
                "           MAX(Occurred) AS LatestError,  " +
                "           COUNT(DISTINCT ErrorType + '|' + ObjectName + '|' + SubName) AS NumOfIssues " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version]  " +
                ") AS Ver ON Sub.[Version] = Ver.[Version] " +
                "GROUP BY Sub.[Version], Ver.EarliestError, Ver.LatestError " +
                "ORDER BY Sub.[Version] DESC";

            string query2 =
                "SELECT TOP 3 [Version], COALESCE([00],0) AS [00], COALESCE([01],0) AS [01], COALESCE([02],0) AS [02], COALESCE([03],0) AS [03], COALESCE([04],0) AS [04], COALESCE([05],0) AS [05], COALESCE([06],0) AS [06], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19], COALESCE([20],0) AS [20], COALESCE([21],0) AS [21], COALESCE([22],0) AS [22], COALESCE([23],0) AS [23], COALESCE([24],0) AS [24] " +
                "FROM ( " +
                "    SELECT [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(*) AS TimesOccurred " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(TimesOccurred) " +
                "    FOR [Hour] IN ([00],[01],[02],[03],[04],[05],[06],[07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query3 =
                "SELECT TOP 3 [Version],  COALESCE([00],0) AS [00], COALESCE([01],0) AS [01], COALESCE([02],0) AS [02], COALESCE([03],0) AS [03], COALESCE([04],0) AS [04], COALESCE([05],0) AS [05], COALESCE([06],0) AS [06], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19], COALESCE([20],0) AS [20], COALESCE([21],0) AS [21], COALESCE([22],0) AS [22], COALESCE([23],0) AS [23], COALESCE([24],0) AS [24] " +
                "FROM ( " +
                "    SELECT [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT UserId) AS UsersAffected " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT " + 
                "( " +
                "    AVG(UsersAffected) " +
                "    FOR [Hour] IN ([00],[01],[02],[03],[04],[05],[06],[07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query4 =
                "SELECT TOP 3 [Version],  COALESCE([00],0) AS [00], COALESCE([01],0) AS [01], COALESCE([02],0) AS [02], COALESCE([03],0) AS [03], COALESCE([04],0) AS [04], COALESCE([05],0) AS [05], COALESCE([06],0) AS [06], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19], COALESCE([20],0) AS [20], COALESCE([21],0) AS [21], COALESCE([22],0) AS [22], COALESCE([23],0) AS [23], COALESCE([24],0) AS [24] " +
                "FROM ( " +
                "    SELECT [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT ErrorType + '|' + ObjectName + '|' + SubName) AS NumOfIssues " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(NumOfIssues) " +
                "    FOR [Hour] IN ([00],[01],[02],[03],[04],[05],[06],[07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24]) " +
                ") AS pvt " +
                "ORDER BY pvt.[Version] DESC";

            string query5 =
                "SELECT TOP 3 [Version], COALESCE([00],0) AS [00], COALESCE([01],0) AS [01], COALESCE([02],0) AS [02], COALESCE([03],0) AS [03], COALESCE([04],0) AS [04], COALESCE([05],0) AS [05], COALESCE([06],0) AS [06], COALESCE([07],0) AS [07], COALESCE([08],0) AS [08], COALESCE([09],0) AS [09], COALESCE([10],0) AS [10], COALESCE([11],0) AS [11], COALESCE([12],0) AS [12], COALESCE([13],0) AS [13], COALESCE([14],0) AS [14], COALESCE([15],0) AS [15], COALESCE([16],0) AS [16], COALESCE([17],0) AS [17], COALESCE([18],0) AS [18], COALESCE([19],0) AS [19], COALESCE([20],0) AS [20], COALESCE([21],0) AS [21], COALESCE([22],0) AS [22], COALESCE([23],0) AS [23], COALESCE([24],0) AS [24] " +
                "FROM ( " +
                "    SELECT [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) AS [Hour], " +
                "        COUNT(DISTINCT REPLICATE('0', 2 - LEN(CAST(DATEPART(dd, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(dd, Occurred) AS VARCHAR(2)) + REPLICATE('0', 2 - LEN(CAST(DATEPART(mm, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(mm, Occurred) AS VARCHAR(2)) ) AS NumOfDays " +
                "    FROM [errl].[Errors] WITH (NOLOCK) " +
                "    WHERE [ProductName] = '" + product + "' AND [Environment] = '" + environment + "' " +
                "    GROUP BY [Version],  " +
                "        REPLICATE('0', 2 - LEN(CAST(DATEPART(hh, Occurred) AS VARCHAR(2)))) + CAST(DATEPART(hh, Occurred) AS VARCHAR(2)) " +
                ") AS Sub  " +
                "PIVOT  " +
                "( " +
                "    AVG(NumOfDays) " +
                "    FOR [Hour] IN ([00],[01],[02],[03],[04],[05],[06],[07],[08],[09],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24]) " +
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
                            list2.Add(new
                            {
                                Version = reader.GetString(0),
                                Hour00 = reader.GetInt32(1),
                                Hour01 = reader.GetInt32(2),
                                Hour02 = reader.GetInt32(3),
                                Hour03 = reader.GetInt32(4),
                                Hour04 = reader.GetInt32(5),
                                Hour05 = reader.GetInt32(6),
                                Hour06 = reader.GetInt32(7),
                                Hour07 = reader.GetInt32(8),
                                Hour08 = reader.GetInt32(9),
                                Hour09 = reader.GetInt32(10),
                                Hour10 = reader.GetInt32(11),
                                Hour11 = reader.GetInt32(12),
                                Hour12 = reader.GetInt32(13),
                                Hour13 = reader.GetInt32(14),
                                Hour14 = reader.GetInt32(15),
                                Hour15 = reader.GetInt32(16),
                                Hour16 = reader.GetInt32(17),
                                Hour17 = reader.GetInt32(18),
                                Hour18 = reader.GetInt32(19),
                                Hour19 = reader.GetInt32(20),
                                Hour20 = reader.GetInt32(21),
                                Hour21 = reader.GetInt32(22),
                                Hour22 = reader.GetInt32(23),
                                Hour23 = reader.GetInt32(24),
                                Hour24 = reader.GetInt32(25)
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
                                Hour00 = reader.GetInt32(1),
                                Hour01 = reader.GetInt32(2),
                                Hour02 = reader.GetInt32(3),
                                Hour03 = reader.GetInt32(4),
                                Hour04 = reader.GetInt32(5),
                                Hour05 = reader.GetInt32(6),
                                Hour06 = reader.GetInt32(7),
                                Hour07 = reader.GetInt32(8),
                                Hour08 = reader.GetInt32(9),
                                Hour09 = reader.GetInt32(10),
                                Hour10 = reader.GetInt32(11),
                                Hour11 = reader.GetInt32(12),
                                Hour12 = reader.GetInt32(13),
                                Hour13 = reader.GetInt32(14),
                                Hour14 = reader.GetInt32(15),
                                Hour15 = reader.GetInt32(16),
                                Hour16 = reader.GetInt32(17),
                                Hour17 = reader.GetInt32(18),
                                Hour18 = reader.GetInt32(19),
                                Hour19 = reader.GetInt32(20),
                                Hour20 = reader.GetInt32(21),
                                Hour21 = reader.GetInt32(22),
                                Hour22 = reader.GetInt32(23),
                                Hour23 = reader.GetInt32(24),
                                Hour24 = reader.GetInt32(25)
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
                                Hour00 = reader.GetInt32(1),
                                Hour01 = reader.GetInt32(2),
                                Hour02 = reader.GetInt32(3),
                                Hour03 = reader.GetInt32(4),
                                Hour04 = reader.GetInt32(5),
                                Hour05 = reader.GetInt32(6),
                                Hour06 = reader.GetInt32(7),
                                Hour07 = reader.GetInt32(8),
                                Hour08 = reader.GetInt32(9),
                                Hour09 = reader.GetInt32(10),
                                Hour10 = reader.GetInt32(11),
                                Hour11 = reader.GetInt32(12),
                                Hour12 = reader.GetInt32(13),
                                Hour13 = reader.GetInt32(14),
                                Hour14 = reader.GetInt32(15),
                                Hour15 = reader.GetInt32(16),
                                Hour16 = reader.GetInt32(17),
                                Hour17 = reader.GetInt32(18),
                                Hour18 = reader.GetInt32(19),
                                Hour19 = reader.GetInt32(20),
                                Hour20 = reader.GetInt32(21),
                                Hour21 = reader.GetInt32(22),
                                Hour22 = reader.GetInt32(23),
                                Hour23 = reader.GetInt32(24),
                                Hour24 = reader.GetInt32(25)
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
                                Hour00 = reader.GetInt32(1),
                                Hour01 = reader.GetInt32(2),
                                Hour02 = reader.GetInt32(3),
                                Hour03 = reader.GetInt32(4),
                                Hour04 = reader.GetInt32(5),
                                Hour05 = reader.GetInt32(6),
                                Hour06 = reader.GetInt32(7),
                                Hour07 = reader.GetInt32(8),
                                Hour08 = reader.GetInt32(9),
                                Hour09 = reader.GetInt32(10),
                                Hour10 = reader.GetInt32(11),
                                Hour11 = reader.GetInt32(12),
                                Hour12 = reader.GetInt32(13),
                                Hour13 = reader.GetInt32(14),
                                Hour14 = reader.GetInt32(15),
                                Hour15 = reader.GetInt32(16),
                                Hour16 = reader.GetInt32(17),
                                Hour17 = reader.GetInt32(18),
                                Hour18 = reader.GetInt32(19),
                                Hour19 = reader.GetInt32(20),
                                Hour20 = reader.GetInt32(21),
                                Hour21 = reader.GetInt32(22),
                                Hour22 = reader.GetInt32(23),
                                Hour23 = reader.GetInt32(24),
                                Hour24 = reader.GetInt32(25)
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