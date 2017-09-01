using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MvcRdlcViewer
{
    internal class GenerateReasult
    {
        /// <summary>
        /// 0： 成功
        /// 1： 报表文件不存在
        /// 2： 生成数据报错
        /// 3： 生成报表报错
        /// 4： 查看报表出错
        /// -1： 命令不支持
        /// </summary>
        public int Code { get; set; }
        public string Message { get; set; }
        public string FileId { get; set; }
        public int PageCount { get; set; }
        public string DownloadName { get; set; }
    }
}
