using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace MvcRdlcViewer
{
    /// <summary>
    /// 报表返回内容
    /// </summary>
    public class RdlcReportReasult : ActionResult
    {
        readonly string _reportFile;
        readonly Action<LocalReport, ReportSettings> _reportBuilder;
        readonly Dictionary<string, string> _exportFiles = new Dictionary<string, string>();
        internal RdlcReportReasult(string reportFile, Action<LocalReport, ReportSettings> builder)
        {
            _reportFile = reportFile;
            _reportBuilder = builder;
            _exportFiles.Add("image", ".tif");
            _exportFiles.Add("excel", ".xls");
            _exportFiles.Add("pdf", ".pdf");
            _exportFiles.Add("word", ".doc");
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var cmd = context.HttpContext.Request.QueryString["__rdlcmd"];
            if (string.IsNullOrWhiteSpace(cmd))
            {
                outputView(context);
            }
            else if (cmd == "generate")
            {
                OutputGenerate(context);
            }
            else if (cmd == "view")
            {
                OutputImage(context);
            }
            else if (cmd == "export")
            {
                OutputExport(context);
            }
            else
            {
                OutputNotSupported(cmd, context);
            }
        }

        private void outputJson(object data, ControllerContext context)
        {
            JsonResult jr = new JsonResult();
            jr.Data = data;
            jr.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            jr.ExecuteResult(context);
        }

        private void outputView(ControllerContext context)
        {
            var viewReasult = new ViewResult()
            {
                ViewName = null,
                MasterName = null,
                ViewData = context.Controller.ViewData,
                TempData = context.Controller.TempData,
                ViewEngineCollection = ViewEngines.Engines
            };
            viewReasult.ExecuteResult(context);
        }

        private void DeletePreGeneratedFile(string oldReport)
        {
            if (string.IsNullOrWhiteSpace(oldReport)) return;
            Task.Factory.StartNew(() =>
            {
                try
                {
                    foreach (var ext in _exportFiles)
                    {
                        try
                        {
                            File.Delete(Path.Combine(Path.GetTempPath(), oldReport + ext.Value));
                        }
                        // ReSharper disable once EmptyGeneralCatchClause
                        catch
                        {
                        }
                    }
                }
                // ReSharper disable once EmptyGeneralCatchClause
                catch
                {
                }
            });
        }

        private void OutputGenerate(ControllerContext context)
        {
            var reportFile = context.HttpContext.Server.MapPath(_reportFile);
            var oldReport = context.HttpContext.Request.QueryString["__oldrdlReport"];
            DeletePreGeneratedFile(oldReport);
            if (!File.Exists(reportFile))
            {
                outputJson(new GenerateReasult
                {
                    Code = 1,
                    Message = "报表" + _reportFile + "不存在！"
                }, context);
                return;
            }
            var rv = new ReportViewer();
            rv.LocalReport.ReportPath = reportFile;
            var settings = new ReportSettings();
            if (_reportBuilder != null)
            {
                try
                {
                    _reportBuilder(rv.LocalReport, settings);
                }
                catch (Exception ex)
                {
                    outputJson(new GenerateReasult
                    {
                        Code = 2,
                        Message = ex.Message
                    }, context);
                    return;
                }
            }
            try
            {
                rv.LocalReport.Refresh();
                var reportFileId = Guid.NewGuid().ToString();
                var img = _exportFiles.ElementAt(0);

                exportTargetFile(reportFileId, img.Value, img.Key, rv, settings);

                Task.Factory.StartNew(args =>
                {
                    try
                    {
                        if (!(args is Tuple<string, ReportViewer, ReportSettings> tuple))
                            return;
                        for (var i = 1; i < _exportFiles.Count; i++)
                        {
                            var cfg = _exportFiles.ElementAt(i);
                            exportTargetFile(tuple.Item1, cfg.Value, cfg.Key, tuple.Item2, tuple.Item3);
                        }
                    }
                    // ReSharper disable once EmptyGeneralCatchClause
                    catch
                    {
                    }
                }, new Tuple<string, ReportViewer, ReportSettings>(reportFileId, rv, settings));

                var tiffImg = Image.FromFile(Path.Combine(Path.GetTempPath(), reportFileId + ".tif"));
                var guid = tiffImg.FrameDimensionsList[0];
                var dimension = new FrameDimension(guid);
                var pageCount = tiffImg.GetFrameCount(dimension);
                tiffImg.Dispose();

                outputJson(new GenerateReasult
                {
                    Code = 0,
                    FileId = reportFileId,
                    PageCount = pageCount,
                    DownloadName = settings.DownLoadFileName
                }, context);
            }
            catch (Exception ex)
            {
                outputJson(new GenerateReasult
                {
                    Code = 3,
                    Message = GetFirstExceptionMessage(ex)
                }, context);
            }
        }

        private void OutputImage(ControllerContext context)
        {
            var indexStr = context.HttpContext.Request.QueryString["__rdlIndex"];
            var reportId = context.HttpContext.Request.QueryString["__rdlReport"];
            if (string.IsNullOrWhiteSpace(reportId))
            {
                outputJson(new GenerateReasult()
                {
                    Code = 4,
                    Message = "未指定需要查看的报表ID."
                }, context);
                return;
            }
            var reportFile = Path.Combine(Path.GetTempPath(), reportId + ".tif");
            if (!File.Exists(reportFile))
            {
                outputJson(new GenerateReasult()
                {
                    Code = 4,
                    Message = "指定了错误的报表ID或者该报表已经被服务器端删除."
                }, context);
                return;
            }
            if (!int.TryParse(indexStr, out var index))
            {
                outputJson(new GenerateReasult()
                {
                    Code = 4,
                    Message = "未指定需要查看的报表页或者指定的数据有误."
                }, context);
                return;
            }
            var tiff = Image.FromFile(reportFile);
            var guid = tiff.FrameDimensionsList[0];
            var dimension2 = new FrameDimension(guid);
            tiff.SelectActiveFrame(dimension2, index);
            using (var ms = new MemoryStream())
            {
                tiff.Save(ms, ImageFormat.Png);
                OutputBinary(ms.ToArray(), context);
            }
            tiff.Dispose();
        }

        private void OutputBinary(byte[] buffer, ControllerContext context)
        {
            context.HttpContext.Response.ContentType = "image/jpeg";
            context.HttpContext.Response.BinaryWrite(buffer);
            context.HttpContext.Response.Flush();
            context.HttpContext.Response.End();
        }

        private void OutputNotSupported(string cmd, ControllerContext context)
        {
            outputJson(new GenerateReasult
            {
                Code = -1,
                Message = "命令" + cmd + "不被支持."
            }, context);
        }

        private void OutputExport(ControllerContext context)
        {
            var fileId = context.HttpContext.Request.QueryString["__rdlReport"];
            var type = context.HttpContext.Request.QueryString["__rdlType"];
            var fileName = context.HttpContext.Request.QueryString["__rdlName"];
            var targetFile = Path.Combine(Path.GetTempPath(), fileId + "." + type);
            if (File.Exists(targetFile))
            {
                var fpr = new FilePathResult(targetFile, "application/octet-stream");
                var fn = string.IsNullOrWhiteSpace(fileName) ? $"报表导出({DateTime.Now:yyyyMMddHHmmss})" : fileName;
                fpr.FileDownloadName = fn + "." + type;
                fpr.ExecuteResult(context);
            }
            else
            {
                var cr = new ContentResult { Content = "<script>alert('对不起，请需要下载的文件不存在，请重试！');window.close();</script>" };
                cr.ExecuteResult(context);
            }
        }

        private void exportTargetFile(string id, string ext, string type, ReportViewer rv, ReportSettings settings)
        {
            var tempImagePath = Path.Combine(Path.GetTempPath(), id + ext);
            var dir = Path.GetDirectoryName(tempImagePath);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir ?? throw new InvalidOperationException());
            }
            var fileBuffer = rv.LocalReport.Render(type, settings.IsChanged() ? settings.ToString() : null);
            File.WriteAllBytes(tempImagePath, fileBuffer);
        }

        string GetFirstExceptionMessage(Exception ex)
        {
            if (ex == null) return "未知错误";
            var firstException = ex;
            while (ex != null)
            {
                firstException = ex;
                ex = ex.InnerException;
            }
            return firstException.Message;
        }
    }
}
