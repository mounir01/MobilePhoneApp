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
document.addEventListener('deviceready',function(){
	cordova.define("com.dialog-semiconductor.service.serial_port", function(require, exports, module) {		
		
		var BC = require("org.bcsphere.bcjs");
		var SerialPortService = BC.DialogSerialPortService = BC.Service.extend({

			serialPortCharacterUUID :  "0000ffe1-0000-1000-8000-00805f9b34fb",
			

			subscribeRead : function(callback){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.serialPortCharacterUUID)[0].subscribe(callback);
				});
			},
			
			
			unsubscribeRead : function(){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.serialPortCharacterUUID)[0].unsubscribe();
				});
			}, 
			
			write : function(writeType,writeValue,successFunc,errorFunc){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.serialPortCharacterUUID)[0].write(writeType,writeValue,successFunc,errorFunc);
				});
			},
			read :function(){
				
			},
			/*
			subscribeFlowControl : function(callback){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.flowControlNotifyCharacterUUID)[0].subscribe(callback);
				});
			},
			
			unsubscribeFlowControl : function(){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.flowControlNotifyCharacterUUID)[0].unsubscribe();
				});
			}, 
			
			writeFlowControl : function(writeType,writeValue,successFunc,errorFunc){
				this.discoverCharacteristics(function(){
					this.getCharacteristicByUUID(this.flowControlNotifyCharacterUUID)[0].write(writeType,writeValue,successFunc,errorFunc);
				});
			},
			*/
		});

		document.addEventListener('bccoreready',function(){
			BC.bluetooth.UUIDMap["0000ffe0-0000-1000-8000-00805f9b34fb"] = BC.DialogSerialPortService;
		});
		module.exports = BC;
	});
},false);
