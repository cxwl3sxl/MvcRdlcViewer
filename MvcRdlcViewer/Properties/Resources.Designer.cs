﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace MvcRdlcViewer.Properties {
    using System;
    
    
    /// <summary>
    ///   一个强类型的资源类，用于查找本地化的字符串等。
    /// </summary>
    // 此类是由 StronglyTypedResourceBuilder
    // 类通过类似于 ResGen 或 Visual Studio 的工具自动生成的。
    // 若要添加或移除成员，请编辑 .ResX 文件，然后重新运行 ResGen
    // (以 /str 作为命令选项)，或重新生成 VS 项目。
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "15.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   返回此类使用的缓存的 ResourceManager 实例。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("MvcRdlcViewer.Properties.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   使用此强类型资源类，为所有资源查找
        ///   重写当前线程的 CurrentUICulture 属性。
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   查找 System.Byte[] 类型的本地化资源。
        /// </summary>
        internal static byte[] input_spinner_gif {
            get {
                object obj = ResourceManager.GetObject("input_spinner_gif", resourceCulture);
                return ((byte[])(obj));
            }
        }
        
        /// <summary>
        ///   查找类似 //#region JQuery printArea
        ////**
        /// *  Version 2.4.0 Copyright (C) 2013
        /// *  Tested in IE 11, FF 28.0 and Chrome 33.0.1750.154
        /// *  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
        /// *  Example:
        /// *      Print Button: &lt;div id=&quot;print_button&quot;&gt;Print&lt;/div&gt;
        /// *      Print Area  : &lt;div class=&quot;PrintArea&quot; id=&quot;MyId&quot; class=&quot;MyClass&quot;&gt; ... html ... &lt;/div&gt;
        /// *      Javascript  : &lt;script&gt;
        /// *                       $(&quot;div#print_button&quot;).click(function(){
        /// *                   [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string script {
            get {
                return ResourceManager.GetString("script", resourceCulture);
            }
        }
        
        /// <summary>
        ///   查找类似 .report-container {
        ///    margin: 10px;
        ///    display: inline-block;
        ///    width: 98%
        ///}
        ///
        ///.report-toolbar {
        ///    padding: 5px;
        ///    border: solid #ddd 1px;
        ///    border-width: 0px 0px 1px 0px;
        ///}
        ///
        ///.report-page-separate {
        ///    page-break-after: always;
        ///}
        ///
        ///.report-body {
        ///    /*height: 600px;*/
        ///    overflow: auto;
        ///    background-color: #D5E7F5;
        ///    text-align: center;
        ///    padding: 10px;
        ///    background-image: url(/Content/images/report-backgroud.png);
        ///    background-repeat: no-repeat;
        ///    background- [字符串的其余部分被截断]&quot;; 的本地化字符串。
        /// </summary>
        internal static string style {
            get {
                return ResourceManager.GetString("style", resourceCulture);
            }
        }
    }
}
