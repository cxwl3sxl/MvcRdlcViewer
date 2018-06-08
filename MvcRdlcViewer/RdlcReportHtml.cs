// ReSharper disable once CheckNamespace
namespace System.Web.Mvc.Html
{
    public static class RdlcReportHtml
    {
        /// <summary>
        /// 生成一个用于展现报表的控件
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="viewerId">控件ID，客户端可以通过 Reports.{viewerId}的方式访问到相关控件</param>
        /// <param name="searchPanel">搜索框的ID，需要自行添加#号，如果传递空则自行在客户端调用报表控件的Reports.{viewerId}.load(args)方法进行数据加载</param>
        /// <param name="clientValidateFunc">客户端的验证方法，只有当searchPanel有值的时候有效</param>
        /// <param name="searchDialogWidth">搜索对话框宽度，只有当searchPanel有值的时候有效</param>
        /// <param name="searchDialogHegiht">搜索对话框高度，只有当searchPanel有值的时候有效</param>
        /// <param name="helpLink">点击界面上的帮助按钮时候打开的帮助页面</param>
        /// <param name="language">默认的界面显示语言, 默认支持 zh_CN;zh_TW
        /// <remarks>自定义语言：
        /// <code>
        /// rdlcViewerLang.XXLang = {
        /// print: "打印",
        /// refresh: "刷新",
        /// flowDisplay: "连续显示",
        /// singlePage: "单页显示",
        /// firstPage: "首页",
        /// prePage: "上一页",
        /// nextPage: "下一页",
        /// lastPage: "末页",
        /// exportPdf: "导出为PDF",
        /// exportExcel: "导出为Excel",
        /// exportWord: "导出为Word",
        /// exportImage: "导出为图片",
        /// help: "帮助",
        /// searchButton: "搜索",
        /// total: "共{0}页",
        /// searchDialogTitle: "报表检索",
        /// printWhenNoDataLoaded: "当前还未加载任何数据，无法打印！",
        /// errors: {
        /// reportFileNotExist: "由于报表文件不存在，无法生成报表，请检查报表文件是否存在；技术信息：\n{0}",
        /// generateDataError: "由于生成数据报错，目前暂时无法查看报表；技术信息：\n{0}",
        /// generateReportError: "由于生成报表报错，目前暂时无法查看报表；技术信息：\n{0}",
        /// viewReportError: "由于查看报表出错，目前暂时无法查看报表；技术信息：\n{0}",
        /// commandNotSupported: "由于命令不支持，目前暂时无法查看报表；技术信息：\n{0}",
        /// noHelpInfo: "当前未设置任何帮助信息，请联系管理员！"
        /// }
        /// </code>
        /// 语言包传XXLang即可
        /// </remarks>
        /// </param>
        /// <returns></returns>
        public static MvcHtmlString RdlcReportViewer(
                this HtmlHelper htmlHelper,
                string viewerId,
                string searchPanel,
                string clientValidateFunc,
                string searchDialogWidth = "600px",
                // ReSharper disable once MethodOverloadWithOptionalParameter
                string searchDialogHegiht = "450px",
                string helpLink = "",
                string language = "zh_CN"
            )
        {
            return new MvcHtmlString("<div id='"
                                     + viewerId
                                     + "' data-toggle='rdlcReport' data-search-panel='"
                                     + searchPanel
                                     + "' data-validate-function='"
                                     + clientValidateFunc
                                     + "' data-help-link='"
                                     + helpLink
                                     + "' data-dialog-width='"
                                     + searchDialogWidth
                                     + "' data-dialog-height='"
                                     + searchDialogHegiht
                                     + "' data-language='"
                                     + language
                                     + "'></div>");
        }

        /// <summary>
        /// 生成一个用于展现报表的控件
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="viewerId">控件ID，客户端可以通过 Reports.{viewerId}的方式访问到相关控件</param>
        /// <param name="searchPanel">搜索框的ID，需要自行添加#号，如果传递空则自行在客户端调用报表控件的Reports.{viewerId}.load(args)方法进行数据加载</param>
        /// <param name="clientValidateFunc">客户端的验证方法，只有当searchPanel有值的时候有效</param>
        /// <param name="language">默认的界面显示语言, 默认支持 zh_CN;zh_TW</param>
        /// <returns></returns>
        public static MvcHtmlString RdlcReportViewer(
            this HtmlHelper htmlHelper,
            string viewerId,
            string searchPanel,
            string clientValidateFunc,
            string language
        )
        {
            return RdlcReportViewer(htmlHelper, viewerId, searchPanel, clientValidateFunc, "600px", "450px", "",
                language);
        }

        /// <summary>
        /// 生成一个用于展现报表的控件
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="viewerId">控件ID，客户端可以通过 Reports.{viewerId}的方式访问到相关控件</param>
        /// <param name="searchPanel">搜索框的ID，需要自行添加#号，如果传递空则自行在客户端调用报表控件的Reports.{viewerId}.load(args)方法进行数据加载</param>
        /// <returns></returns>
        public static MvcHtmlString RdlcReportViewer(
            this HtmlHelper htmlHelper,
            string viewerId,
            string searchPanel
        )
        {
            return RdlcReportViewer(htmlHelper, viewerId, searchPanel, "", "600px", "450px", "", "zh_CN");
        }

        /// <summary>
        /// 生成一个用于展现报表的控件
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="viewerId">控件ID，客户端可以通过 Reports.{viewerId}的方式访问到相关控件</param>
        /// <returns></returns>
        public static MvcHtmlString RdlcReportViewer(
            this HtmlHelper htmlHelper,
            string viewerId
        )
        {
            return RdlcReportViewer(htmlHelper, viewerId, "", "", "600px", "450px", "", "zh_CN");
        }

        /// <summary>
        /// 生成当前报表组件需要的脚本文件加载代码
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString RdlcScriptCore(this HtmlHelper htmlHelper)
        {
            if (htmlHelper == null) throw new ArgumentNullException(nameof(htmlHelper));
            return new MvcHtmlString(
                $"<script type='text/javascript' src='{htmlHelper.ViewContext?.RequestContext?.HttpContext.Request.Url?.GetLeftPart(UriPartial.Path)}?__rdlcmd=getScript'></script>");
        }

        /// <summary>
        /// 生成当前报表组件需要的样式文件加载代码
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <returns></returns>
        public static MvcHtmlString RdlcStyleCore(this HtmlHelper htmlHelper)
        {
            if (htmlHelper == null) throw new ArgumentNullException(nameof(htmlHelper));
            return new MvcHtmlString(
                $"<link rel='stylesheet' href='{htmlHelper.ViewContext?.RequestContext?.HttpContext.Request.Url?.GetLeftPart(UriPartial.Path)}?__rdlcmd=getStyle'/>");
        }
    }
}