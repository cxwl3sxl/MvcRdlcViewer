namespace MvcRdlcViewer
{
    /// <summary>
    /// 报表设置
    /// </summary>
    public class ReportSettings
    {
        /// <summary>
        /// 获取或者设置下载时的文件名
        /// </summary>
        public string DownLoadFileName { get; set; }

        internal bool IsChanged()
        {
            return false;
        }
    }
}
