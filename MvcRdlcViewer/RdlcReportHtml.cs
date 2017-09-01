using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        /// <returns></returns>
        public static MvcHtmlString RdlcReportViewer(
            this HtmlHelper htmlHelper,
            string viewerId,
            string searchPanel = "",
            string clientValidateFunc = "",
            string searchDialogWidth = "600px",
            string searchDialogHegiht = "450px",
            string helpLink = ""
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
                + "' ></div> ");
        }
    }
}
