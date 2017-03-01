using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KnCodeUsWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult KnSampleNodeApp()
        {
            ViewBag.Message = "KnSampleNodeApp application.";

            return View();
        }

        public ActionResult RecursiveFunctionVB6()
        {
            ViewBag.Message = "RecursiveFunctionVB6 application.";

            return View();
        }

        public ActionResult mpoWebSite()
        {
            ViewBag.Message = "mpoWebSite application.";

            return View();
        }
    }
}