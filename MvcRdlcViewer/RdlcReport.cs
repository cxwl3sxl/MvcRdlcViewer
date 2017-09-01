using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MvcRdlcViewer
{
    public class RdlcReport
    {
        /// <summary>
        /// 在当前action中返回一个报表查看页面
        /// </summary>
        /// <param name="reportFile">rdlc报表文件路径</param>
        /// <param name="reportSetting">报表生成逻辑</param>
        /// <returns></returns>
        public static RdlcReportReasult Build(string reportFile, Action<LocalReport, ReportSettings> reportSetting)
        {
            return new RdlcReportReasult(reportFile, reportSetting);
        }
    }
}
