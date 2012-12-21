'use strict';

/**
 * Pusher Factory
 */
yeomanApp.service('PusherService'
	, ['$rootScope', 'UIEvents', 'NinjaService', 'UserService'
	, function($rootScope, UIEvents, NinjaService, UserService) {

	var pusher;
	var pusherChannel;



	// Wait for user to load
	$rootScope.$on(UIEvents.UserInfoLoaded, function(eventObj, userData) {
		
		// don't process if there is an error
		if (userData.error) return;

		//Get the user pusher channel & key
		var pusherKey = userData.pusherKey;

		pusher = new Pusher(pusherKey);

		pusherChannel = pusher.subscribe(userData.pusherChannel);

		pusher.log = function(message) {
			console.log(message);
		};

		// Create the channel event handlers

		var pusherHeartbeat_Handler = function(data) {
			$rootScope.$broadcast(UIEvents.PusherHeartbeat, data);
		};

		var pusherData_Handler = function(data) {
			$rootScope.$broadcast(UIEvents.PusherData, data);
		};

		var pusherStream_Handler = function(data) {
			$rootScope.$broadcast(UIEvents.PusherStream, data);
		};

		var pusherConfig_Handler = function(data) {
			switch (data.type) {
				case "NODE_ACTIVATION":
					break;
				case "PLUGIN":
					$rootScope.$broadcast(UIEvents.DevicePlugin, data);
					break;
				case "UNPLUG":
					$rootScope.$broadcast(UIEvents.DeviceUnplug, data);
					break;
				default:
					$rootScope.$broadcast(UIEvents.PusherConfig, data);
			}

			
		};


		pusherChannel.bind('heartbeat', pusherHeartbeat_Handler);
		pusherChannel.bind('data', pusherData_Handler);
		pusherChannel.bind('stream', pusherStream_Handler);
		pusherChannel.bind('config', pusherConfig_Handler);


	});


}]);
