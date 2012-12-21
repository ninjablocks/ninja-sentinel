'use strict';
/**
 * Device Factory
 */
yeomanApp.service('DeviceService'
	, ['$rootScope', '$timeout', 'UIEvents', 'NinjaService', 'NinjaUtilities'
	, function($rootScope, $timeout, UIEvents, NinjaService, NinjaUtilities) {

	var deviceService = {

		/**
		 * A users Devices array
		 * @type {Array}
		 */
		Devices: [],

		/**
		 * A users Blocks array
		 * @type {Array}
		 */
		Blocks: [],


		/**
		 * Loads a user's Devices from the Ninja API
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		LoadUserDevices: function(callback) {
			if (DEBUG) console.log('LoadUserDevices');
			NinjaService.User.GetDevices(this.SetUserDevices.bind(this));
			if (callback) {
				NinjaService.User.GetDevices(callback);
			}
		},

		/**
		 * Filters the specified devices array for any RF duplicates.
		 * @param {array} devices Array of devices
		 */
		FilterUserDevices: function(devices) {
			var filteredDevices = [];

			// Loop over each device
			for(var i=0; i<devices.length; i++) {

				var device = devices[i];

				var matchingDevices, alreadyExists;

				// WT450 Humidity
				if (parseInt(device.Options.deviceId) === 30) {
					matchingDevices = this.GetDeviceByDeviceId(30, filteredDevices);
					alreadyExists = false;
					for (var k=0; k<matchingDevices.length; k++) {
						var matchingDevice = matchingDevices[k];
						if (matchingDevice.Options.port === device.Options.port) {
							alreadyExists = true;
							// break;
						}
					}

					if (!alreadyExists) {
						filteredDevices.push(device);
					}

					// WT450 Temperature
				} else if (parseInt(device.Options.deviceId) === 31) {
					matchingDevices = this.GetDeviceByDeviceId(31, filteredDevices);
					alreadyExists = false;
					for (var k=0; k<matchingDevices.length; k++) {
						var matchingDevice = matchingDevices[k];
						if (matchingDevice.Options.port === device.Options.port) {
							alreadyExists = true;
							// break;
						}
					}

					if (!alreadyExists) {
						filteredDevices.push(device);
					}

				} else {
					filteredDevices.push(device)
				}
			}

			return filteredDevices;
		},




		SetUserDevices: function(blockDevices) {
			this.Devices = this.FilterUserDevices(blockDevices.devices);
			this.Blocks = blockDevices.blocks;

			$rootScope.$broadcast(UIEvents.DevicesLoaded, this.Devices);
		},

		/**
		 * Creates a new device for the UI based on the data returned from pusher data
		 * @param {object} data Data received from a pusher data object
		 */
		CreateAddDevice: function(data) {
			// console.log("Creating Device: ", data);

			var guidComponents = NinjaUtilities.SplitGUID(data.GUID);

			var block = this.GetCreateBlockByNodeId(guidComponents.nodeId);

			var newDevice = new NinjaService.Device({
				deviceId: guidComponents.deviceId,
				name: "New Device (TODO: Lookup)",
				vendor: data.V,
				port: data.G,
				value: data.DA,
				pusherData: data
			});

			block.RegisterDevice(newDevice);

			// Data Handler
			var GetData_Handler = function(data) {
				// console.log("Setting Device Data", data);
				newDevice.Options.rawData = data;
				newDevice.Options.type = data.device_type;
				newDevice.Options.name = data.default_name; // no shortname provided
				newDevice.Options.rawData.shortName = data.default_name;

			};

			newDevice.GetData(GetData_Handler.bind(this)); // Fetch extra information about the device

			var newDevices = this.Devices.slice();
			newDevices.push(newDevice);
			newDevices = this.FilterUserDevices(newDevices);
			// console.log(newDevices);
			if (newDevices.length !== this.Devices.length) {
				this.Devices.push(newDevice);
			}

			$rootScope.$apply();

			$rootScope.$broadcast(UIEvents.IsotopeReLayout);

		},


		/**
		 * Retrieves the block for the specified nodeId.
		 * This will create a block if the node id doesn't exist
		 * @param {string} nodeId Block NodeId
		 */
		GetCreateBlockByNodeId: function(nodeId) {
			var block;

			if (this.Blocks) {

				for (var i=0; i< this.Blocks.length; i++) {
					var blockCursor = this.Blocks[i];
					if (blockCursor.Options.nodeId === nodeId) {
						block = blockCursor;
					}
				}
			}
			if (block === undefined) {
				block = new NinjaService.Block({ nodeId: nodeId});
				this.Blocks.push(block);
			}
		

			return block;
		},


		/**
		 * Retrieves a set of devices associated with the specified nodeId
		 * @param {string} nodeId       NodeId to search for
		 * @param {array} devicesArray Optional devices array to use (instead of build in Devices array)
		 */
		GetDeviceByNodeId: function(nodeId, devicesArray) {
			var devices = [];

			if (!devicesArray) {
				devicesArray = this.Devices;
			}

			if (devicesArray) {
				for (var i=0; i<devicesArray.length; i++) {
					var device = devicesArray[i];

					if (device.Options.block.Options.nodeId === nodeId) {
						devices.push(device);
					}
				}
			}

			return devices;
		},


		/**
		 * Finds a device in the Devices array by the specified guid
		 * @param {string} guid Guidstring to look up
		 * @param {array} devicesArray Optional devices array to use (instead of built in array)
		 */
		GetDeviceByGuid: function(guid, devicesArray) {

			if (!devicesArray) {
				devicesArray = this.Devices;
			}

			if (devicesArray) {
				for(var i=0; i<devicesArray.length; i++) {
					var device = devicesArray[i];

					if (device.GUID() === guid) {
						return device;
					}
				}
			}

			return null;
		},

		/**
		 * Finds a device in the Devices array by the specified type
		 * @param {string} type Device type to search for
		 * @param {array} devicesArray Optional devices array to use (instead of built in array)
		 * @return {array} Devices matching the specified type
		 */
		GetDeviceByType: function(type, devicesArray) {

			var devices = [];

			if (!devicesArray) {
				devicesArray = this.Devices;
			}

			if (devicesArray) {
				for(var i=0; i<devicesArray.length; i++) {
					var device = devicesArray[i];
					if (device.Options.type === type) {
						devices.push(device);
					}
				}
			}

			return devices;
		},


		/**
		 * Finds devices that are of the specified mode
		 * @param {string} mode         actuator|sensor
		 * @param {array} devicesArray Optional devices array to use
		 */
		GetDeviceByMode: function(mode, devicesArray) {
			var devices = [];

			if (!devicesArray) {
				devicesArray = this.Devices;
			}

			if (devicesArray) {
				for (var i=0; i<devicesArray.length; i++) {
					var device = devicesArray[i];
					if (device.Options.mode === mode) {
						devices.push(device);
					}
				}
			}

			return devices;
		},

		/**
		 * Finds a device in the devices array by the specified deviceId
		 * @param {int} 	deviceId     DeviceId to search for
		 * @param {array} devicesArray Optional devices array to use (instead of the built in array)
		 * @return {array} Devices matching the specified id
		 */
		GetDeviceByDeviceId: function(deviceId, devicesArray) {

			var devices = [];

			if (!devicesArray) {
				devicesArray = this.Devices;
			}

			if (devicesArray) {
				for (var i=0; i<devicesArray.length; i++) {
					var device = devicesArray[i];
					if (parseInt(device.Options.deviceId) === parseInt(deviceId)) {
						devices.push(device);
					}
				}
			}

			return devices;
		},

		/**
		 * Creates or returns a service device.
		 * NOTE: Assumes serviceType matches a valid device_type
		 * @param {string} serviceType sms|email|webhook
		 * @return {object} Service Device
		 */
		GetWebService: function(serviceType, callback) {
			var serviceDevice;
			var that = this;

			var serviceDevices = this.GetDeviceByType(serviceType);
			if (serviceDevices.length === 0) {
				// console.log("Service does not exist");
				NinjaService.User.CreateService(serviceType, function(device, block) {
					that.Devices.push(device);
					that.Blocks.push(block);
					
					if (callback) {
						callback(device);
					}
				});
			} else {
				// console.log("Service exists", serviceDevices);
				serviceDevice = serviceDevices[0];

				if (callback) {
					callback(serviceDevice);
				}
			}

			return serviceDevice;
		}

	};


	/**
	 * Handler for receiving pusher data
	 */
	$rootScope.$on(UIEvents.PusherData, function(eventObj, data) {
		var device = deviceService.GetDeviceByGuid(data.GUID);

		if (!device) {
			// Create the device
			deviceService.CreateAddDevice(data);
		}
	});


	/**
	 * Handler for removing a device
	 */
	$rootScope.$on(UIEvents.DeviceRemoved, function(eventObj, device) {
		// console.log("Devices before: ", $scope.Devices);
		var arrayDevice = deviceService.GetDeviceByGuid(device.GUID());
		var deviceIndex = deviceService.Devices.indexOf(arrayDevice);
		deviceService.Devices.splice(deviceIndex,1);


		$rootScope.$emit(UIEvents.IsotopeReLayout, device);
	});



	return deviceService;


}]);
