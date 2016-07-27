//每个页面都引入这个文件，提供所有的全局设置和文件引入

var _app = {}; //最高全局变量，angular

(function _main() {
    'use strict';

    /*angular初始设置,提供全局功能函数
     */
    _app = angular.module('app', [
        'app.factories',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers',
        'ui.bootstrap',
        'ngMaterial',
    ]).config(
        function angularConfig($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $mdThemingProvider) {
            $locationProvider.html5Mode(true);
            _app.controller = $controllerProvider.register;
            _app.service = $provide.service;
            _app.factory = $provide.factory;
            _app.directive = $compileProvider.directive;
            _app.filter = $filterProvider.register;

            //material design theme主题颜色定制
            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('pink', {
                    'default': '400'
                })
                .warnPalette('red', {
                    'default': '600'
                });
        }
    );

    angular.module('app.factories', []);
    angular.module('app.services', []);
    angular.module('app.filters', []);
    angular.module('app.directives', []);
    angular.module('app.controllers', []);


    _app.run(function angularRun($rootScope) {
        //所有跨控制器共享数据
        _xdat = $rootScope.xdat = {};

        //切换页面的函数
        $rootScope.changePage = function(pname, args) {
            //传递参数
            if (args) {
                if (!$rootScope.xdat[pname]) $rootScope.xdat[pname] = {};
                for (var attr in args) {
                    $rootScope.xdat[pname][attr] = args[attr];
                };
            };

            $rootScope.curPage = pname;
            $rootScope.curPageUrl = './controllers/' + pname + '.html';
        };

        $rootScope.changePage(_cfg.startPage);
    });

    //自定义filter过滤器

    //显示为html样式
    _app.filter('toTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            }
        }
    ]);





})();
