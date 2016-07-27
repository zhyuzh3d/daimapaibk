/*通用的基础功能_cfg,_fns对象*/

var _wdapp = new Wilddog("https://daimapai.wilddogio.com"); //野狗app数据库

var _cfg = {}; //最高全局变量，功用设置
var _fns = {}; //最高全局变量，公用函数
var _xdat = {}; //最高全局变量，共享变量

(function () {
    "use strict";
    _cfg.host = window.location.host;
    _cfg.homePath = _cfg.host + '/mod/';

    _cfg.qn = {
        getUploadTokenApi: 'http://www.10knet.com/api/getUploadToken', //获取七牛上传token的接口
        bucket: 'http://pubfiles.10knet.com/', //上传到哪个bucket
    };

    _cfg.startPage = 'register';

    //可选的自动载入库文件列表，这些功能只能延迟使用
    _cfg.libs = {
        jquery: { //已经载入
            js: '//cdn.bootcss.com/jquery/2.2.4/jquery.min.js',
        },
        bootstrap: { //已经载入
            js: '//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js',
            css: '//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js'
        },
        fontawesome: { //已经载入
            css: '//cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css'
        },
        wilddog: { //已经载入
            js: '//cdn.wilddog.com/js/client/current/wilddog.js'
        },
        angular: { //已经载入
            js: '//cdn.bootcss.com/angular.js/1.3.20/angular.min.js',
            js2: '//cdn.bootcss.com/angular.js/1.3.20/angular-resource.min.js'
        },
        swal: {
            js: '//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.js',
            css: '//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css'
        },
        toastr: {
            js: '//cdn.bootcss.com/toastr.js/latest/js/toastr.min.js',
            css: '//cdn.bootcss.com/toastr.js/latest/css/toastr.min.css'
        },
        md5: {
            js: '//cdn.bootcss.com/blueimp-md5/2.3.0/js/md5.min.js'
        },
        qcode: {
            js: '//cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js'
        },
        moment: {
            js: '//cdn.bootcss.com/moment.js/2.13.0/moment.min.js'
        },
        module: {
            js: '//' + _cfg.host + '/lib/simditor/latest/scripts/module.js',
        },
        simditor: {
            lib: 'module',
            css: '//' + _cfg.host + '/lib/simditor/latest/styles/simditor.css',
            js1: '//' + _cfg.host + '/lib/simditor/latest/scripts/hotkeys.js',
            js2: '//' + _cfg.host + '/lib/simditor/latest/scripts/uploader_qn.js',
            js3: '//' + _cfg.host + '/lib/simditor/latest/scripts/simditor.js',
        },
        plupload: {
            js: '//cdn.bootcss.com/plupload/2.1.9/moxie.min.js',
            js2: '//cdn.bootcss.com/plupload/2.1.9/plupload.dev.js',
            js2: '//cdn.bootcss.com/plupload/2.1.9/plupload.full.min.js',
        },
        qiniu: {
            js: '//cdn.bootcss.com/qiniu-js/1.0.15-beta/qiniu.min.js',
        },
        jform: {
            js: '//cdn.bootcss.com/jquery.form/3.51/jquery.form.min.js',
        },
    };


    /*获取地址栏参数
    arg    name        参数名key
    res    value/null  值或null
     */
    _fns.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /*获取路由页面,用于换页,只是添加controller路径
    arg     ctrlrname   控制器名称，不带路径和文件类型，比如'register'
    res     string      完整的路径
     */
    _fns.getCtrlr = function (ctrlrname) {
        var path = './controllers/' + ctrlrname + '.html';
        return path;
    };

    /*自动载入控制器对应的js,用在controller里面，html自动加载需要的js
    arg     ctrlrname   控制器名称，不带路径和文件类型，比如'register'
    res     null
    */
    _fns.addCtrlrJs = function (ctrlrname) {
        var all_js = document.getElementsByTagName("script");
        var cur_js = $(all_js[all_js.length - 1]);

        var url = './controllers/' + ctrlrname + '.js';
        cur_js.prev().append('<script src="' + url + '"><\/script>');
        return null;
    };

    /*向head添加需要初始化的库，参照_cfg.libs
    arg     libstr      js库名称，一定是 _cfg.libs里面包含的名称，比如'swal'
    res     null
     */
    _fns.addLib = function (libstr) {
        var lib = _cfg.libs[libstr];
        if (libstr && lib && !lib.loaded) {
            for (var attr in lib) {
                var htmlstr = '';

                //匹配文件类型,如果是lib则关联载入
                if (attr.substr(0, 2) == 'js') {
                    htmlstr = '<script src="' + lib[attr] + '"><\/script>';
                } else if (attr.substr(0, 3) == 'css') {
                    htmlstr = '<link href="' + lib[attr] + '" rel="stylesheet">';
                } else if (attr == 'lib') {
                    _fns.addLib(lib[attr]);
                };

                //载入文件到头部
                if (htmlstr) {
                    $('head').append(htmlstr);
                    lib.loaded = true;
                };
            };
        } else {
            if (lib.loaded) {
                console.log('_app.load:' + libstr + ' already exist.')
            } else {
                console.log('_app.load:' + libstr + ' format err.')
            };
        };
    };


    /*重新应用scope,用于整体刷新controller
    arg     scp         controller的$scope
    res     null
     */
    _fns.applyScope = function (scp) {
        if (scp && scp.$root && scp.$root.$$phase != '$apply' && scp.$root.$$phase != '$digest') {
            scp.$apply();
        };
    };

    /*创建唯一的id,简单的使用时间戳加随机方法
    arg     prefix      修饰性前缀
    res     string
     */
    _fns.uuid = function uniqueId(prefix) {
        var ts = Number(new Date()).toString(36)
        var rd = Number(String(Math.random()).replace('.', '')).toString(36);
        var res = ts + '-' + rd;
        if (prefix) res = prefix + '-' + res;
        return res;
    };

    /*汇总获取ctrlr上层传来的参数，优先使用_xdat[ctrlr],其次使用dom的属性
    需要具有scope.ctrlrName属性，
    结果写入到$scope.args
    arg     scope       controller的$scope
    arg     element     controller的$element
    res     object      汇总后的对象，包含所有上层传来的参数
     */
    _fns.getCtrlrAgs = function (scope, element) {
        var res;
        if (scope) {
            if (!scope.args) scope.args = {};

            //提取dom传来的属性参数放到scope.args
            if (element) {
                var hargs = element.getParentAttr();
                for (var attr in hargs) {
                    scope.args[attr] = hargs[attr];
                };
            };

            //提取xdat的参数放到scope.args
            var xargs = _xdat[scope.ctrlrName] || {};
            for (var attr in xargs) {
                scope.args[attr] = xargs[attr];
            };

            res = scope.args;
        };
        return res;
    };


    /*最基本的上传按钮函数，在evt对象的兄弟层添加input并自动激活，调用uploadFileQn进行上传
    arg     evt         点击事件$event
    arg     callback    回调对象，可以包含三个事件ingfn(evt),okfn(res),errfn(err)
    res     null
    */
    _fns.uploadFile = function (evt, callback) {
        var btnjo = $(evt.target);

        //创建formdata数据
        var filejo = btnjo.siblings('#uploadFileInput');
        filejo.remove();
        filejo = $('<input id="uploadFileInput" type="file"></input>').appendTo(btnjo);
        btnjo.after(filejo);

        //给file input添加监听
        filejo.bind('change', function () {
            var fileobj = filejo.get(0).files[0];
            console.log('onchange', fileobj);

            $.get(_cfg.qn.getUploadTokenApi,
                function (res) {
                    if (res.code == 1) {
                        if (callback == undefined) callback = {};
                        _fns.uploadFileQn(fileobj, res.uptoken,
                            function (evt) {
                                if (evt.lengthComputable) {
                                    var percentComplete = evt.loaded / evt.total;
                                };
                                if (callback.ingfn) callback.ingfn(evt);
                            },
                            function (res) {
                                if (callback.okfn) callback.okfn(res);
                            },
                            function (err) {
                                if (callback.errfn) callback.errfn(err);
                            });
                    };
                });
        });

        //激活点击
        filejo.click();
    };


    /*上传到七牛存储的函数
    arg     ingfn(evt)      传输中的函数,
    arg     okfn(res)       完成后的函数
    arg     errfn(err)       完成后的函数

    */
    _fns.uploadFileQn = function (fileobj, token, ingfn, okfn, errfn) {
        //准备fromdata
        var fdata = new FormData();
        fdata.append('file', fileobj);
        fdata.append('token', token);

        //发起上传
        var set = {
            url: "http://up.qiniu.com",
            data: fdata,
            type: 'POST',
            processData: false,
            contentType: false,
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (ingfn) ingfn(evt);
                }, false);
                return xhr;
            },
            success: function (res) {
                //把七牛的返回结果专为标准格式
                res['success'] = true;
                res['file_path'] = _cfg.qn.bucket + res.key;
                res['msg'] = 'upload ok.';
                if (okfn) okfn(res);
            },
            error: function (err) {
                if (errfn) errfn(err);
            }
        };


        return $.ajax(set);
    };

    /*所有文件类型及对应的fa图标
     */
    _cfg.fileIcons = {
        'image/jpeg': 'fa fa-file-image-o',
        'video/mp4': 'fa fa-file-movie-o',
        'text/plain': 'fa fa-file-text-o',
        'application/x-zip-compressed': 'fa fa-file-archive-o',
        'application/msword': 'fa fa-file-word-o',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa fa-file-word-o',
        'application/vnd.ms-excel': 'fa fa-file-excel-o',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa fa-file-excel-o',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa fa-file-excel-o',
    };

    /*获取mime文件类型对应的fa图标
    arg    typestr     文件mime字符串
    arg    size        fa的尺寸字符串,可选fa-1 fa-lg fa-2 fa-3
    res    string      图标class的字符串，比如'fa fa-phone fa-1'
    */
    _fns.getFileIcon = function (typestr, size) {
        var res = _cfg.fileIcons[typestr] || 'fa fa-file-o';
        res = 'fa ' + res;
        if (size) res += ' ' + size;
        return res;
    };



    /*扩展$,获取父层的参数
    控制器用来获取由页面传来的参数，这些值都设定在模版父层<div ng-include='aa' name='jack'>，得到{ng-include:'aa',name:'jack'}
    */
    $.fn.getParentAttr = $getParentAttr;

    function $getParentAttr() {
        var res = {};
        var jo = this;
        if (jo && jo[0] && jo.parent()[0]) {
            var attrs = jo.parent()[0].attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                res[attr.name] = attr.value;
            };
        };
        return res;
    };
})();
