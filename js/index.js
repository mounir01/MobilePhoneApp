/*
	Copyright 2013-2014, JUMA Technology

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var app = {

	device : null,
	
	service : null,
	
	characteristic1 : null,
	
	characteristic2 : null,

    // Application Constructor
    initialize: function() {
        app.bindCordovaEvents();
    },
    
    bindCordovaEvents: function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("org.bcsphere.bcjs");
	},
	
	onBCReady: function() {
        BC.bluetooth.addEventListener("bluetoothstatechange",app.onBluetoothStateChange);
        BC.bluetooth.addEventListener("newdevice",app.addNewDevice);
		if(!BC.bluetooth.isopen){
			if(API !== "ios"){
				BC.Bluetooth.OpenBluetooth(function(){
				});
			}else{					
				//alert("Please open your bluetooth first.");
			}
		}
    },
    
   	onBluetoothStateChange : function(){
		if(BC.bluetooth.isopen){

		}else{
			if(API !== "ios"){
                BC.Bluetooth.OpenBluetooth(function(){
                });
            }else{                  
                //alert("Please open your bluetooth first.");
            }
		}
	},
	
	connect : function(){
		if(BC.bluetooth.isopen){

		}else{
			if(API !== "ios"){
                BC.Bluetooth.OpenBluetooth(function(){
                });
            }else{                  
                //alert("Please open your bluetooth first.");
            }
		}	
	},
	
	
};
















