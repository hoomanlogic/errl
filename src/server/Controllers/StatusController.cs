using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using System.Data.SqlClient;

namespace Errl.Server.Controllers
{
    [Authorize]
    public class StatusController : Controller
    {
        public ActionResult Index()
        {
            string userId = User.Identity.GetUserId();

            if (!Helpers.IsDeveloperReady(userId))
            {
                return RedirectToAction("Index", "Developer");
            }
            ViewBag.Version = System.Configuration.ConfigurationManager.AppSettings["ErrlVersion"];
            return View();
        }
    }
}
