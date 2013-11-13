require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
        bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
        bootstrapButton: '../bower_components/sass-bootstrap/js/button',
        bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
        bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
        bootstrapDropdown: '../bower_components/sass-bootstrap/js/dropdown',
        bootstrapModal: '../bower_components/sass-bootstrap/js/modal',
        bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
        bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
        bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
        bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
        bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
        requirejs: '../bower_components/requirejs/require',
        'sass-bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        URI: '../bower_components/uri.js/src/URI',
        IPv6: '../bower_components/uri.js/src/IPv6',
        SecondLevelDomains: '../bower_components/uri.js/src/SecondLevelDomains',
        punycode: '../bower_components/uri.js/src/punycode',
        URITemplate: '../bower_components/uri.js/src/URITemplate',
        'jquery.URI': '../bower_components/uri.js/src/jquery.URI'
    },
    shim: {
        bootstrapAffix: {
            deps: [
                'jquery'
            ]
        },
        bootstrapAlert: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapButton: {
            deps: [
                'jquery'
            ]
        },
        bootstrapCarousel: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapCollapse: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapDropdown: {
            deps: [
                'jquery'
            ]
        },
        bootstrapModal: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapPopover: {
            deps: [
                'jquery',
                'bootstrapTooltip'
            ]
        },
        bootstrapScrollspy: {
            deps: [
                'jquery'
            ]
        },
        bootstrapTab: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapTooltip: {
            deps: [
                'jquery',
                'bootstrapTransition'
            ]
        },
        bootstrapTransition: {
            deps: [
                'jquery'
            ]
        }
    }
});

require([
        'app',
        'jquery'
    ], function (app, $) {
        'use strict';
        var DEBUG = true;
        // Prevent console call to throw errors on old browser
        // Mute console when DEBUG is set to false
        // TODO: turn DEBUG to false on grunt:build
        if (DEBUG === false || !window.console) {
            window.console = {
                assert                    : function() {},
                clear                     : function() {},
                count                     : function() {},
                debug                     : function() {},
                dir                       : function() {},
                dirxml                    : function() {},
                error                     : function() {},
                exception                 : function() {},
                group                     : function() {},
                groupCollapsed            : function() {},
                groupEnd                  : function() {},
                info                      : function() {},
                log                       : function() {},
                markTimeLine              : function() {},
                msIsIndependentlyComposed : function() {},
                profile                   : function() {},
                profileEnd                : function() {},
                table                     : function() {},
                time                      : function() {},
                timeEnd                   : function() {},
                timeStamp                 : function() {},
                trace                     : function() {},
                warn                      : function() {}
            };
        }

        // use app here
        console.log(app);
        console.log('Running jQuery %s', $().jquery);
    }
);
