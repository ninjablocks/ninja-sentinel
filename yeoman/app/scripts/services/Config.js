'use strict';

yeomanApp.service('Config'
    , ['$rootScope', '$location'
    , function($rootScope, $location) {

        var PLATFORMS = {
            YEOMAN:             'Yeoman',
            LOCALHOST:          'Localhost',
            DERP:               'Derp',
            STAGING:            'Staging',
            PRODUCTION:         'Production'
        };


        var configYeoman = {
            Mode:               PLATFORMS.YEOMAN,
            Server:             'http://localhost:8000',
            StreamServer:       'http://localhost:8000'
        };

        var configDev = {
            Mode:               PLATFORMS.LOCALHOST,
            Server:             '',
            StreamServer:       ''
        };

        var configDerp = {
            Mode:               PLATFORMS.DERP,
            Server:             '',
            StreamServer:       ''
        };

        var configStaging = {
            Mode:               PLATFORMS.STAGING,
            Server:             '',
            StreamServer:       ''
        };

        var configProduction = {
            Mode:               PLATFORMS.PRODUCTION,
            Server:             '',
            StreamServer:       ''
        };


        var detectPlatform = function() {

            var platform;

            switch($location.$$host) {
                case 'localhost':
                    if ($location.$$port === 3501) {
                        platform = PLATFORMS.YEOMAN;
                    } else if ($location.$$port >= 8000) {
                        platform = PLATFORMS.LOCALHOST;
                    }
                    break;
                case 'derp.local':
                    platform = PLATFORMS.DERP;
                    break;
                case 'staging.ninja.is':
                    platform = PLATFORMS.STAGING;
                    break;
                default:
                    platform = PLATFORMS.PRODUCTION;
                    break;
            }

            return platform;
        };


        switch (detectPlatform()) {
            case PLATFORMS.YEOMAN:
                return configYeoman;
                break;
            case PLATFORMS.LOCALHOST:
                return configDev;
                break;
            case PLATFORMS.DERP:
                return configDerp;
                break;
            case PLATFORMS.STAGING:
                return configStaging;
                break;
            case PLATFORMS.PRODUCTION:
                return configProduction;
                break;
        }

}]);
