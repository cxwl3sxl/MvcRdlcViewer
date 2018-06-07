using Microsoft.Reporting.WebForms;
using System;

namespace MvcRdlcViewer
{
    /// <summary>
    /// RdlcReport报表工具
    /// </summary>
    public static class RdlcReport
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
