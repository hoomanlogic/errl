using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Linq;
using System;

namespace Errl.Server
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Application_BeginRequest()
        {
            // why the fuck was i doing this? zombie coding?
            //if (Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
            //{
            //    Response.Flush();
            //}

            // found this online, keeping in case i run into another Cors issue
            //if (Context.Request.Path.Contains("api/") && Context.Request.HttpMethod == "OPTIONS")
            //{
            //    Context.Response.AddHeader("Access-Control-Allow-Origin", Context.Request.Headers["Origin"]);
            //    Context.Response.AddHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            //    Context.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST PUT, DELETE, OPTIONS");
            //    // This line is added because whatever is coming from the Register " { SupportsCredentials = true };" is ignored.
            //    Context.Response.AddHeader("Access-Control-Allow-Credentials", "true");
            //    Context.Response.End();
            //}
        }
    }
}
