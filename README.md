# MvcRdlcViewer

为mvc程序提供rdlc报表的展现功能，并且提供导出等

主要分为服务器端和客户端，服务器端直接引用相关dll，然后采用如下代码返回一个report对象
```c#
 public ActionResult Index(string name)
        {
            return MvcRdlcViewer.RdlcReport.Build("~/Reports/Report1.rdlc", (report, setting) =>
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
                setting.DownLoadFileName = "牛";
            });
        }
```
页面上则采用如下方式输出
```html
@Html.RdlcReportViewer("myReport", "#search", "validate")
```
客户端可以采用如下方式访问到对应的reportviewer对象
```javascript
Reports.myReport
```
该对象支持的方法如下：
```javascript
Reports.myReport.print();//打印报表
Reports.myReport.load({p1:"",p2:""});//采用指定的参数刷新报表数据
Reports.myReport.refresh();//刷新报表
Reports.myReport.exportPdf();//导出为pdf文件
Reports.myReport.exportExcel();//导出为excel文件
Reports.myReport.showSearch();//显示搜索框，仅在调用@Html.RdlcReportViewer方法时候传递了相关参数有效
Reports.myReport.flowdisplay();//采用连续显示的方式显示报表
Reports.myReport.singlepage();//采用单页方式显示报表
Reports.myReport.help();//打开帮助页面
Reports.myReport.firstpage();//翻页操作第一页
Reports.myReport.prepage();//翻页操作上一页
Reports.myReport.nextpage();//翻页操作下一页
Reports.myReport.lastpage();//翻页操作最后一页
Reports.myReport.updateBodyCss();//更新报表主体部分的css，主要用于解决高度问题
Reports.myReport.exportWord();//导出word文档
Reports.myReport.exportImage();//导出tif图片文档
```

客户端界面需要应用如下两个文件
```html
rdlcReport.css
rdlcReport.js
```
`注意`：里面的部分功能用到了layer的弹窗插件，所以需要自行添加layer的引用
屏幕截图
![](https://raw.githubusercontent.com/cxwl3sxl/MvcRdlcViewer/master/%E6%8D%95%E8%8E%B7.PNG)  
