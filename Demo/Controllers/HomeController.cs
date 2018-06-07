using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Demo.Controllers
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

        public ActionResult MyReport()
        {
            var name = "hello";
            return MvcRdlcViewer.RdlcReport.Build("~/ReportFiles/Report1.rdlc", (report, setting) =>
            {
                List<ABC> ds = new List<ABC>();
                for (int i = 0; i < 150; i++)
                {
                    ds.Add(new ABC(i)
                    {
                        Index = i,
                        Name = name + "-" + i
                    });
                }
                report.DataSources.Add(new ReportDataSource("DataSet1", ds));
                report.SetParameters(new ReportParameter("ReportParameter1", "asdasdasd"));
                setting.DownLoadFileName = "牛";
            });
        }
    }

    public class ABC
    {
        public ABC(int index)
        {
            Age = new Random().Next(0, 10 * (index + 1)).ToString();
        }
        public string Name { get; set; }
        public string Age { get; set; }
        public int Index { get; set; }
    }
}