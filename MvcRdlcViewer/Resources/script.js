//#region JQuery printArea
/**
 *  Version 2.4.0 Copyright (C) 2013
 *  Tested in IE 11, FF 28.0 and Chrome 33.0.1750.154
 *  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
 *  Example:
 *      Print Button: <div id="print_button">Print</div>
 *      Print Area  : <div class="PrintArea" id="MyId" class="MyClass"> ... html ... </div>
 *      Javascript  : <script>
 *                       $("div#print_button").click(function(){
 *                           $("div.PrintArea").printArea( [OPTIONS] );
 *                       });
 *                     </script>
 *  options are passed as json (example: {mode: "popup", popClose: false})
 *
 *  {OPTIONS}   | [type]     | (default), values      | Explanation
 *  ---------   | ---------  | ---------------------- | -----------
 *  @mode       | [string]   | (iframe),popup         | printable window is either iframe or browser popup
 *  @popHt      | [number]   | (500)                  | popup window height
 *  @popWd      | [number]   | (400)                  | popup window width
 *  @popX       | [number]   | (500)                  | popup window screen X position
 *  @popY       | [number]   | (500)                  | popup window screen Y position
 *  @popTitle   | [string]   | ('')                   | popup window title element
 *  @popClose   | [boolean]  | (false),true           | popup window close after printing
 *  @extraCss   | [string]   | ('')                   | comma separated list of extra css to include
 *  @retainAttr | [string[]] | ["id","class","style"] | string array of attributes to retain for the containment area. (ie: id, style, class)
 *  @standard   | [string]   | strict, loose, (html5) | Only for popup. For html 4.01, strict or loose document standard, or html 5 standard
 *  @extraHead  | [string]   | ('')                   | comma separated list of extra elements to be appended to the head tag
 */
(function ($) {
    var counter = 0;
    var modes = { iframe: "iframe", popup: "popup" };
    var standards = { strict: "strict", loose: "loose", html5: "html5" };
    var defaults = {
        mode: modes.iframe,
        standard: standards.html5,
        popHt: 500,
        popWd: 400,
        popX: 200,
        popY: 200,
        popTitle: '',
        popClose: false,
        extraCss: '',
        extraHead: '',
        retainAttr: ["id", "class", "style"]
    };

    var settings = {};//global settings

    $.fn.printArea = function (options) {
        $.extend(settings, defaults, options);

        counter++;
        var idPrefix = "printArea_";
        $("[id^=" + idPrefix + "]").remove();

        settings.id = idPrefix + counter;

        var $printSource = $(this);

        var PrintAreaWindow = PrintArea.getPrintWindow();

        PrintArea.write(PrintAreaWindow.doc, $printSource);

        setTimeout(function () { PrintArea.print(PrintAreaWindow); }, 1000);
    };

    var PrintArea = {
        print: function (PAWindow) {
            var paWindow = PAWindow.win;

            $(PAWindow.doc).ready(function () {
                paWindow.focus();
                paWindow.print();

                if (settings.mode == modes.popup && settings.popClose)
                    setTimeout(function () { paWindow.close(); }, 2000);
            });
        },
        write: function (PADocument, $ele) {
            PADocument.open();
            PADocument.write(PrintArea.docType() + "<html>" + PrintArea.getHead() + PrintArea.getBody($ele) + "</html>");
            PADocument.close();
        },
        docType: function () {
            if (settings.mode == modes.iframe) return "";

            if (settings.standard == standards.html5) return "<!DOCTYPE html>";

            var transitional = settings.standard == standards.loose ? " Transitional" : "";
            var dtd = settings.standard == standards.loose ? "loose" : "strict";

            return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd + '.dtd">';
        },
        getHead: function () {
            var extraHead = "";
            var links = "";

            if (settings.extraHead) settings.extraHead.replace(/([^,]+)/g, function (m) { extraHead += m });

            $(document).find("link")
                .filter(function () { // Requirement: <link> element MUST have rel="stylesheet" to be considered in print document
                    var relAttr = $(this).attr("rel");
                    return ($.type(relAttr) === 'undefined') == false && relAttr.toLowerCase() == 'stylesheet';
                })
                .filter(function () { // Include if media is undefined, empty, print or all
                    var mediaAttr = $(this).attr("media");
                    return $.type(mediaAttr) === 'undefined' || mediaAttr == "" || mediaAttr.toLowerCase() == 'print' || mediaAttr.toLowerCase() == 'all'
                })
                .each(function () {
                    links += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
                });
            if (settings.extraCss) settings.extraCss.replace(/([^,\s]+)/g, function (m) { links += '<link type="text/css" rel="stylesheet" href="' + m + '">' });

            return "<head><title>" + settings.popTitle + "</title>" + extraHead + links + "</head>";
        },
        getBody: function (elements) {
            var htm = "";
            var attrs = settings.retainAttr;
            elements.each(function () {
                var ele = PrintArea.getFormData($(this));

                var attributes = ""
                for (var x = 0; x < attrs.length; x++) {
                    var eleAttr = $(ele).attr(attrs[x]);
                    if (eleAttr) attributes += (attributes.length > 0 ? " " : "") + attrs[x] + "='" + eleAttr + "'";
                }

                htm += '<div ' + attributes + '>' + $(ele).html() + '</div>';
            });

            return "<body>" + htm + "</body>";
        },
        getFormData: function (ele) {
            var copy = ele.clone();
            var copiedInputs = $("input,select,textarea", copy);
            $("input,select,textarea", ele).each(function (i) {
                var typeInput = $(this).attr("type");
                if ($.type(typeInput) === 'undefined') typeInput = $(this).is("select") ? "select" : $(this).is("textarea") ? "textarea" : "";
                var copiedInput = copiedInputs.eq(i);

                if (typeInput == "radio" || typeInput == "checkbox") copiedInput.attr("checked", $(this).is(":checked"));
                else if (typeInput == "text") copiedInput.attr("value", $(this).val());
                else if (typeInput == "select")
                    $(this).find("option").each(function (i) {
                        if ($(this).is(":selected")) $("option", copiedInput).eq(i).attr("selected", true);
                    });
                else if (typeInput == "textarea") copiedInput.text($(this).val());
            });
            return copy;
        },
        getPrintWindow: function () {
            switch (settings.mode) {
                case modes.iframe:
                    var f = new PrintArea.Iframe();
                    return { win: f.contentWindow || f, doc: f.doc };
                case modes.popup:
                    var p = new PrintArea.Popup();
                    return { win: p, doc: p.doc };
            }
        },
        Iframe: function () {
            var frameId = settings.id;
            var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
            var iframe;

            try {
                iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                $(iframe).attr({ style: iframeStyle, id: frameId, src: "#" + new Date().getTime() });
                iframe.doc = null;
                iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
            }
            catch (e) { throw e + ". iframes may not be supported in this browser."; }

            if (iframe.doc == null) throw "Cannot find document.";

            return iframe;
        },
        Popup: function () {
            var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
            windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=yes";

            var newWin = window.open("", "_blank", windowAttr);

            newWin.doc = newWin.document;

            return newWin;
        }
    };
})(jQuery);
//#endregion

//#region rdlc report
var rdlcViewerLang = {
    zh_CN: {
        print: "打印",
        refresh: "刷新",
        flowDisplay: "连续显示",
        singlePage: "单页显示",
        firstPage: "首页",
        prePage: "上一页",
        nextPage: "下一页",
        lastPage: "末页",
        exportPdf: "导出为PDF",
        exportExcel: "导出为Excel",
        exportWord: "导出为Word",
        exportImage: "导出为图片",
        help: "帮助",
        searchButton: "搜索",
        total: "共{0}页",
        searchDialogTitle: "报表检索",
        printWhenNoDataLoaded: "当前还未加载任何数据，无法打印！",
        errors: {
            reportFileNotExist: "由于报表文件不存在，无法生成报表，请检查报表文件是否存在；技术信息：\n{0}",
            generateDataError: "由于生成数据报错，目前暂时无法查看报表；技术信息：\n{0}",
            generateReportError: "由于生成报表报错，目前暂时无法查看报表；技术信息：\n{0}",
            viewReportError: "由于查看报表出错，目前暂时无法查看报表；技术信息：\n{0}",
            commandNotSupported: "由于命令不支持，目前暂时无法查看报表；技术信息：\n{0}",
            noHelpInfo: "当前未设置任何帮助信息，请联系管理员！"
        }
    },
    zh_TW: {
        print: "打印",
        refresh: "刷新",
        flowDisplay: "連續顯示",
        singlePage: "單頁顯示",
        firstPage: "首頁",
        prePage: "上壹頁",
        nextPage: "下壹頁",
        lastPage: "末頁",
        exportPdf: "導出為PDF",
        exportExcel: "導出為Excel",
        exportWord: "導出為Word",
        exportImage: "導出為圖片",
        help: "幫助",
        searchButton: "搜索",
        total: "共{0}頁",
        searchDialogTitle: "報表檢索",
        printWhenNoDataLoaded: "當前還未加載任何數據，無法打印！",
        errors: {
            reportFileNotExist: "由於報表文件不存在，無法生成報表，請檢查報表文件是否存在；技術信息：\n{0}",
            generateDataError: "由於生成數據報錯，目前暫時無法查看報表；技術信息：\n{0}",
            generateReportError: "由於生成報表報錯，目前暫時無法查看報表；技術信息：\n{0}",
            viewReportError: "由於查看報表出錯，目前暫時無法查看報表；技術信息：\n{0}",
            commandNotSupported: "由於命令不支持，目前暫時無法查看報表；技術信息：\n{0}",
            noHelpInfo: "當前未設置任何幫助信息，請聯系管理員！"
        }
    }
};
(function ($) {
    function Report(ele, opts) {
        var $element = ele;
        var $this = this;
        var defaultOpts = {
            "searchPanel": "",
            "iconSize": "btn-xs",
            "dialogWidth": "600px",
            "dialogHeight": "450px",
            "helpLink": "",
            "validateFunction": function () { return true; },
            "language": rdlcViewerLang.zh_CN
        };

        $.extend(defaultOpts, opts);
        if (typeof (defaultOpts.language) === "string") {
            defaultOpts.language = rdlcViewerLang[defaultOpts.language];
        }
        if (typeof (defaultOpts.language) === "undefined") {
            defaultOpts.language = rdlcViewerLang.zh_CN;
        }
        if (defaultOpts.searchPanel != "") {
            defaultOpts.iconSize = "";
        }
        var currentPageIndex = 0;
        var displayType = 0;//0 表示连续模式，1表示单页模式
        var lastReportData = null;//报表加载的最后数据

        var body = '<div class="report-toolbar">';

        /*工具栏左1*/
        body += '<div class="btn-group toolbar-group">';

        body += '<a class="btn btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="print" title="'
            + defaultOpts.language.print
            + '" href="javascript:;">';
        body += '<span class="fa fa-print"></span>';
        body += '</a>';

        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="refresh" title="'
            + defaultOpts.language.refresh
            + '" href="javascript:;">';
        body += '<span class="fa fa-refresh"></span>';
        body += '</a>';
        body += '</div>';

        /*工具栏左2*/
        body += '<div class="btn-group toolbar-group">';
        body += '<a class="btn  btn-default display-type active '
            + defaultOpts.iconSize
            + '" data-cmd="flowdisplay" title="'
            + defaultOpts.language.flowDisplay
            + '" href="javascript:;">';
        body += '<span class="fa fa-bars"></span>';
        body += '</a>';

        body += '<a class="btn  btn-default display-type '
            + defaultOpts.iconSize
            + '" data-cmd="singlepage" title="'
            + defaultOpts.language.singlePage
            + '" href="javascript:;">';
        body += '<span class="fa fa-file-o"></span>';
        body += '</a>';

        body += '<a class="btn  btn-default page-btns disabled '
            + defaultOpts.iconSize
            + '" data-cmd="firstpage" title="'
            + defaultOpts.language.firstPage
            + '" href="javascript:;">';
        body += '<span class="fa fa-step-backward"></span>';
        body += '</a>';

        body += '<a class="btn  btn-default page-btns disabled '
            + defaultOpts.iconSize
            + '" data-cmd="prepage" title="'
            + defaultOpts.language.prePage
            + '" href="javascript:;">';
        body += '<span class="fa fa-chevron-left"></span>';
        body += '</a>';

        body += '<div class="page-number-info page-btns disabled page-number-info-'
            + defaultOpts.iconSize
            + '">';
        body += '?/?';
        body += '</div>';

        body += '<a class="btn  btn-default page-btns disabled '
            + defaultOpts.iconSize
            + '" data-cmd="nextpage" title="'
            + defaultOpts.language.nextPage
            + '" href="javascript:;">';
        body += '<span class="fa fa-chevron-right"></span>';
        body += '</a>';

        body += '<a class="btn  btn-default page-btns disabled '
            + defaultOpts.iconSize
            + '" data-cmd="lastpage" title="'
            + defaultOpts.language.lastPage
            + '" href="javascript:;">';
        body += '<span class="fa fa-step-forward"></span>';
        body += '</a>';

        body += '</div>';

        /*工具栏左3*/
        body += '<div class="btn-group toolbar-group">';
        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="exportPdf" title="'
            + defaultOpts.language.exportPdf
            + '" href="javascript:;">';
        body += '<span class="fa fa-file-pdf-o"></span>';
        body += '</a>';
        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="exportExcel" title="'
            + defaultOpts.language.exportExcel
            + '" href="javascript:;">';
        body += '<span class="fa fa-file-excel-o"></span>';
        body += '</a>';
        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="exportWord" title="'
            + defaultOpts.language.exportWord
            + '" href="javascript:;">';
        body += '<span class="fa fa-file-word-o"></span>';
        body += '</a>';
        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="exportImage" title="'
            + defaultOpts.language.exportImage
            + '" href="javascript:;">';
        body += '<span class="fa fa-image"></span>';
        body += '</a>';
        body += '</div>';

        /*工具栏左3*/
        body += '<div class="btn-group toolbar-group">';
        body += '<a class="btn  btn-default '
            + defaultOpts.iconSize
            + '" data-cmd="help" title="'
            + defaultOpts.language.help
            + '" href="javascript:;">';
        body += '<span class="fa fa-question"></span>';
        body += '</a>';
        body += '</div>';

        /*工具栏右侧区域*/
        body += '<div class="report-info">';
        body += '<div class="extend-toolbar">';
        if (defaultOpts.searchPanel !== "") {
            body += '<div class="btn-group toolbar-group"><button class="btn btn-default search-button"><span class="fa fa-search"></span>'
                + defaultOpts.language.searchButton
                + '</button></div>';
        }
        body += '</div>';
        body += '<div class="loading" style="display:none">';
        body += '<img src="/Content/images/input-spinner.gif" />';
        body += '</div>';
        body += '<divc class="report-detail"></divc>';
        body += '</div>';
        body += '<div style="clear:both;"></div>';
        body += '</div>';
        body += '<div class="report-body">';
        body += '</div>';
        $element.addClass("report-container panel panel-default").html(body);

        var searchPanel = $(defaultOpts.searchPanel);
        if (searchPanel.length === 1) {
            $element.find("button.search-button").click(function () {
                $this.showSearch();
            });
            searchPanel.hide();

            $element.addClass("fill-page");
            setTimeout(function () {
                var totalHeight = $element.height();
                if (totalHeight) {
                    totalHeight = (totalHeight + "").replace("px", "");
                    $element.find(".report-body").height((totalHeight - 65) + "px");
                }
            }, 500);
        }

        $element.find(".report-toolbar").find("a").each(function () {
            $(this).click(function () {
                var func = $this[$(this).data("cmd")];
                if (typeof (func) == "function") {
                    func.apply(this);
                }
            });
        });

        function buildUrl(args) {
            var baseUrl = window.location.origin + window.location.pathname;
            var searchStr = window.location.search;
            var oldSearch = {};
            if (searchStr) {
                if (searchStr[0] === "?") {
                    searchStr = searchStr.substr(1);
                }

                var searchs = searchStr.split("&");
                for (var i = 0; i < searchs.length; i++) {
                    var kv = searchs[i].split('=');
                    oldSearch[kv[0]] = kv.length > 1 ? kv[1] : "";
                }
            }
            $.extend(oldSearch, args);
            baseUrl += "?";
            for (var a in oldSearch) {
                baseUrl += a + "=" + encodeURI(oldSearch[a]) + "&";
            }
            return baseUrl;
        }

        function loading() {
            $element.find(".report-detail").hide();
            $element.find(".loading").css({ "display": "inline-block" });
        }

        function loaded(reasult) {
            if (!reasult) {
                alert("加载报表出错，原因未知！");
                return;
            }
            /*
0： 成功
1： 报表文件不存在
2： 生成数据报错
3： 生成报表报错
4： 查看报表出错
-1： 命令不支持
            */
            switch (reasult.Code) {
                case 0:
                    $element.find(".report-detail").html(defaultOpts.language.total.replace("{0}", reasult.PageCount)).show();
                    $element.find(".loading").hide();
                    return true;
                case 1:
                    alert(defaultOpts.language.errors.reportFileNotExist.replace("{0}", reasult.Message));
                    return false;
                case 2:
                    alert(defaultOpts.language.errors.generateDataError.replace("{0}", reasult.Message));
                    return false;
                case 3:
                    alert(defaultOpts.language.errors.generateReportError.replace("{0}", reasult.Message));
                    return false;
                case 4:
                    alert(defaultOpts.language.errors.viewReportError.replace("{0}", reasult.Message));
                    return false;
                case -1:
                    alert(defaultOpts.language.errors.commandNotSupported.replace("{0}", reasult.Message));
                    return false;
            }
        }

        function getImageUrl(index, id) {
            return window.location.origin
                + window.location.pathname
                + "?__rdlcmd=view&__rdlIndex="
                + index
                + "&__rdlReport="
                + id;
        }

        function renderReport(ajaxReasult, pageAction) {
            if (ajaxReasult) {
                lastReportData = ajaxReasult;
            }
            else {
                ajaxReasult = lastReportData;
            }
            if (!ajaxReasult)
                return;

            $element.data("_reportId", ajaxReasult.FileId);
            $element.data("_reportName", ajaxReasult.DownloadName);

            if (displayType === 0) {
                var page = "";
                for (var i = 0; i < ajaxReasult.PageCount; i++) {
                    page += '<div class="report-page">';
                    page += '<img src="' + getImageUrl(i, ajaxReasult.FileId) + '" /></div >';
                    page += '<div class="report-page-separate"></div>';
                }
                $($element).find(".report-body").html(page);
                $element.find(".page-number-info").html("?/?");
            }
            else {
                var showIndex = currentPageIndex;
                if (pageAction) {
                    if (pageAction === -2) {//首页
                        showIndex = 0;
                    }
                    else if (pageAction === 2) {//末页
                        showIndex = ajaxReasult.PageCount - 1;
                    }
                    else {
                        showIndex += pageAction;
                    }
                }
                if (showIndex < 0)
                    showIndex = 0;
                if (showIndex >= ajaxReasult.PageCount)
                    showIndex = ajaxReasult.PageCount - 1;
                currentPageIndex = showIndex;
                $($element).find(".report-body").html('<div class="report-page"><img src="' + getImageUrl(showIndex, ajaxReasult.FileId) + '" /></div><div class="report-page-separate"></div>');
                $element.find(".page-number-info").html((currentPageIndex + 1) + "/" + ajaxReasult.PageCount);

                $element.find(".page-btns").removeClass("disabled");
                if (showIndex === 0) {
                    $element.find('[data-cmd="firstpage"]').addClass("disabled");
                    $element.find('[data-cmd="prepage"]').addClass("disabled");
                }
                if (showIndex === ajaxReasult.PageCount - 1) {
                    $element.find('[data-cmd="nextpage"]').addClass("disabled");
                    $element.find('[data-cmd="lastpage"]').addClass("disabled");
                }
            }
        }

        this.print = function () {
            var html = "";
            if (displayType === 0) {
                html = $($element).find(".report-body").html();
            }
            else {
                if (!lastReportData) {
                    alert(defaultOpts.Language.printWhenNoDataLoaded);
                    return;
                }
                for (var i = 0; i < lastReportData.PageCount; i++) {
                    html += '<div class="report-page">';
                    html += '<img src="' + getImageUrl(i, lastReportData.FileId) + '" /></div >';
                    html += '<div class="report-page-separate"></div>';
                }
            }
            $(html).printArea({ "mode": "iframe" });
        }

        this.load = function (args) {
            if (typeof (args) == "string") {
                var data = [];
                $(args).find("input").each(function () {
                    var name = $(this).attr("name");
                    if (!name) {
                        name = $(this).attr("id");
                    }
                    if (!name)
                        return;
                    data[name] = $(this).val();
                });
                $element.data("args", data);
            }
            else {
                $element.data("args", args);
            }
            $this.refresh();
        }

        this.refresh = function () {
            var data = $element.data("args");
            if (!data) {
                data = {};
            }
            data["__rdlcmd"] = "generate";
            if (lastReportData) {
                data["__oldrdlReport"] = lastReportData.FileId;
            }
            loading();
            $.get(buildUrl(data), function (ajaxReasult) {
                if (loaded(ajaxReasult)) {
                    renderReport(ajaxReasult);
                }
            });
        }

        this.exportPdf = function () {
            window.open(window.location.origin
                + window.location.pathname
                + "?__rdlcmd=export&__rdlReport="
                + $element.data("_reportId")
                + "&__rdlType=pdf&__rdlName="
                + encodeURI($element.data("_reportName")));
        }

        this.exportExcel = function () {
            window.open(window.location.origin
                + window.location.pathname
                + "?__rdlcmd=export&__rdlReport="
                + $element.data("_reportId")
                + "&__rdlType=xls&__rdlName="
                + encodeURI($element.data("_reportName")));
        }

        this.showSearch = function () {
            var targetForm = $(defaultOpts.searchPanel);
            layer.openContentDialog(defaultOpts.language.searchDialogTitle, targetForm, defaultOpts.dialogWidth, defaultOpts.dialogHeight, function (form) {
                var data = [];
                $(form).find("input").each(function () {
                    var name = $(this).attr("name");
                    if (!name) {
                        name = $(this).attr("id");
                    }
                    if (!name)
                        return;
                    data[name] = $(this).val();
                });
                if (defaultOpts.validateFunction(data)) {
                    $this.load(data);
                }
            });
        }

        this.flowdisplay = function () {
            $element.find(".display-type").removeClass("active");
            $element.find(".page-btns").addClass("disabled");
            $(this).addClass("active");
            displayType = 0;
            renderReport(null);
        }

        this.singlepage = function () {
            $element.find(".display-type").removeClass("active");
            $element.find(".page-btns").removeClass("disabled");
            $(this).addClass("active");
            displayType = 1;
            renderReport(null);
        }

        this.help = function () {
            if (defaultOpts.helpLink) {
                window.open(defaultOpts.helpLink);
            }
            else {
                alert(defaultOpts.language.errors.noHelpInfo);
            }
        }

        this.firstpage = function () {
            renderReport(null, -2);
        }

        this.prepage = function () {
            renderReport(null, -1);
        }

        this.nextpage = function () {
            renderReport(null, 1);
        }

        this.lastpage = function () {
            renderReport(null, 2);
        }

        this.updateBodyCss = function (css) {
            $element.find(".report-body").css(css);
        }

        this.exportWord = function () {
            window.open(window.location.origin
                + window.location.pathname
                + "?__rdlcmd=export&__rdlReport="
                + $element.data("_reportId")
                + "&__rdlType=doc&__rdlName="
                + encodeURI($element.data("_reportName")));
        }

        this.exportImage = function () {
            window.open(window.location.origin
                + window.location.pathname
                + "?__rdlcmd=export&__rdlReport="
                + $element.data("_reportId")
                + "&__rdlType=tif&__rdlName="
                + encodeURI($element.data("_reportName")));
        }
    }

    $.fn.extend({
        "Report": function (opts) {
            return new Report(this, opts);
        }
    });


    $(function () {
        if (typeof (window.Report) == "undefined") {
            window.Reports = {};
        }
        $('[data-toggle="rdlcReport"]').each(function () {
            var data = $(this).data();
            var valfunc = window[data.validateFunction];
            if (typeof (valfunc) == "function") {
                data.validateFunction = valfunc;
            }
            else {
                data.validateFunction = function () { return true; }
            }
            var rp = $(this).Report(data);
            var id = $(this).attr("id");
            if (id) {
                window.Reports[id] = rp;
            }
        });
    });
})(jQuery);
//#endregion