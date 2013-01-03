'use strict';

yeomanApp.service('UIEvents', function() {

    var uiEvents = {

        /**
         * Pusher
         */
        PusherData:             'PusherData',
        PusherHeartbeat:        'PusherHeartbeat',
        PusherConfig:           'PusherConfig',
        PusherStream:           'PusherStream',

        ConfigureMode:          'ConfigureMode',

        /**
         * User
         */
        UserIsLoggedIn:         'UserIsLoggedIn',
        UserIsLoggedOut:        'UserIsLoggedOut',
        UserStatusChecked:      'UserStatusChecked',

        // Login
        UserLoggingIn:          'UserLoggingIn',
        UserLogin:              'UserLogin',
        UserLoginFailed:        'UserLoginFailed',

        // Logout
        UserLoggingOut:         'UserLoggingOut',
        UserLogout:             'UserLogout',
        UserLogoutFailed:       'UserLogoutFailed',

        // UserInfo
        UserInfoLoading:        'UserInfoLoading',
        UserInfoLoaded:         'UserInfoLoaded',
        UserInfoLoadFailed:     'UserInfoLoadFailed',


        /**
         * HEADER
         */
        TopBarOpen:             'TopBarOpen',
        TopBarClose:            'TopBarClose',

        /**
         * DEVICES
         */

        DevicePlugin:           'DevicePlugin',
        DeviceUnplug:           'DeviceUnplug',

        // Loading Devices
        DevicesLoading:         'DevicesLoading',
        DevicesLoaded:          'DevicesLoaded',
        DevicesLoadFailed:      'DevicesLoadFailed',

        // Removing a device from the UI
        DeviceRemoving:         'DeviceRemoving',
        DeviceRemoved:          'DeviceRemoved',
        DeviceRemoveFailed:     'DeviceRemoveFailed',

        SetDeviceType:          'SetDeviceType',

        ServiceUpdated:         'ServiceUpdated',

        /**
         * ZONES
         */
        
        ZoneAdding:             'ZoneAdding',
        ZoneAdded:              'ZoneAdded',
        ZoneAddFailed:          'ZoneAddFailed',

        ZoneEditing:            'ZoneEditing',
        ZoneEdited:             'ZoneEdited',
        ZoneEditFailed:         'ZoneEditFailed',

        ZoneUpdating:           'ZoneUpdating',
        ZoneUpdated:            'ZoneUpdated',
        ZoneUpdateFailed:       'ZoneUpdateFailed',

        ZoneSaving:             'ZoneSaving',
        ZoneSaved:              'ZoneSaved',
        ZoneSaveFailed:         'ZoneSaveFailed',

        ZoneRemoving:           'ZoneRemoving',
        ZoneRemoved:            'ZoneRemoved',
        ZoneRemoveFailed:       'ZoneRemoveFailed',


        /**
         * TRIGGERS
         */
        TriggerAdding:          'TriggerAdding',
        TriggerAdded:           'TriggerAdded',
        TriggerAddFailed:       'TriggerAddFailed',

        TriggerRemoving:        'TriggerRemoving',
        TriggerRemoved:         'TriggerRemoved',
        TriggerRemoveFailed:    'TriggerRemoveFailed',


        /**
         * OVERRIDES
         */
        OverrideUpdate:         'OverrideUpdate',


        /**
         * ALERTS
         */
        AlertAdding:            'AlertAdding',
        AlertAdded:             'AlertAdded',
        AlertAddFailed:         'AlertAddFailed',

        AlertUpdating:          'AlertUpdating',
        AlertUpdated:           'AlertUpdated',
        AlertUpdateFailed:      'AlertUpdateFailed',

        AlertRemoving:          'AlertRemoving',
        AlertRemoved:           'AlertRemoved',
        AlertRemoveFailed:      'AlertRemoveFailed'

    };

    return uiEvents;
  
  });
