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
	device : {},

	connect_sign : 0,	//连接信号，1成功；0断开
	rcv_count : 0,		//接收计数器
	snd_count : 0,		//发送计数器
	snd_cyclic_sign : 0,//循环发送信号，1使能；0disabled
	snd_cyclic_state : 0,//循环发送的状态ID
	send_stop : 0, 		//switch :send stop

	rcvChecked : 0,	//1:HEX;0:ACSII
	sndChecked : 0,		//1:HEX;0:ASCII
	interval : 0, //cyclic time

	consoleshow : 0,
	console_String : [],

	deviceOpen : function(){
		console.log("deviceOpen()");
		app.DialogSerialPortProfile.open(app.device,app.defaultReceive,app.openSuccessFunc,app.openErroFunc);
	},

	deviceClose : function(){
		console.log("deviceClose()");
		app.DialogSerialPortProfile.close(app.device,app.closeSuccessFunc,app.closeErroFunc);
	},

	sendSwitch : function(){
		if(app.connect_sign==1){

			var writeValue = document.getElementById("snd_Data").value;		
			if (writeValue.length == 0){
				alert("no value in send buffer");
				return;
			}

			var sndType = app.checksndType();

			if(app.snd_cyclic_sign==1)
			{
				app.send_stop++;
				if(app.send_stop==1){
					app.onSend_cyclic(writeValue,sndType,app.interval);
					document.getElementById("sendSwitch").innerHTML="Stop";
				}else{
					app.send_stop=0;
					app.onStop();
					document.getElementById("sendSwitch").innerHTML="Send";
				}
			}else{
				app.onSend_once(writeValue,sndType);
			}
		}else{
			alert("device is disconnected");
			return;
		}
		
	},

	onClearData : function(){
		console.log("onClear");
		document.getElementById("rcv_Data").innerHTML="";
		document.getElementById("rcv_Count").innerHTML=0;
		document.getElementById("snd_Data").innerHTML="";
		document.getElementById("snd_Count").innerHTML=0;
		app.snd_count=0;
		app.rcv_count=0;
	},

	onStop : function(){
		console.log("onStop");
		//app.snd_cyclic_sign = 0;
		window.clearInterval(app.snd_cyclic_state);
	},

	onSend_once : function(writeValue,sndType){
		app.DialogSerialPortProfile.write(sndType,writeValue,app.openSuccessFunc,app.openErroFunc);
		app.snd_count += writeValue.length;
		document.getElementById("snd_Count").innerHTML = app.snd_count;
	},

	onSend_cyclic : function(writeValue,sndType,cyc_time){

		app.snd_cyclic_state = window.setInterval(function(){
			if(app.snd_cyclic_sign==0){
				return;
			}else{
				app.onSend_once(writeValue,sndType);
			}
		},cyc_time);
	},

	checksndType : function(){	
		var snd_Type = app.sndChecked?"HEX":"ASCII";
		return snd_Type;
	},

	initialize : function() {
        app.bindCordovaEvents();
    },
    
    bindCordovaEvents : function() {
		document.addEventListener('deviceready',app.onDeviceReady,false);
        document.addEventListener('bcready', app.onBCReady, false);
    },
    
	onDeviceReady : function(){
		var BC = window.BC = cordova.require("com.dialog-semiconductor.profile.serial_port");
	},
	
	onBCReady : function(){
		BC.Bluetooth.StartScan('LE');
		app.device = new BC.Device({deviceAddress:"78:A5:04:8C:90:8F",type:"BLE"});
		app.DialogSerialPortProfile = new BC.DialogSerialPortProfile();
		app.consoleshow = document.getElementById("console_Data");
	},

	openSuccessFunc : function(){
		BC.Bluetooth.StopScan();
		app.connect_sign = 1;
		console.log("device connect");
		document.getElementById("console_Data").innerHTML+="open device successful\n";
	},	
	openErroFunc:function(){
		app.connect_sign = 0;
		console.log("device connect error");
		document.getElementById("console_Data").innerHTML+="open device failed\n";
	},

	closeSuccessFunc : function(){
		app.connect_sign = 0;
		console.log("device disconnect ");
		document.getElementById("console_Data").innerHTML+="close device success\n";
	},	
	closeErroFunc:function(){
		app.connect_sign = 1;
		console.log("device disconnect error");
		document.getElementById("console_Data").innerHTML+="close device failed\n";
	},

	defaultReceive : function(data){
		console.log("defaultReceive");
		var showData = document.getElementById("rcv_Data");
		var rcvType = app.rcvChecked?"getHexString":"getASCIIString";
        showData.innerHTML += data.value[rcvType]();
        app.rcv_count += data.value[rcvType]().length;
        document.getElementById("rcv_Count").innerHTML = app.rcv_count;
	},

	rcv_hex : function(){app.rcvChecked = 1;alert("receive by HEX");},
	rcv_asc : function(){app.rcvChecked = 0;alert("receive by ASCII");},

	snd_hex : function(){app.sndChecked = 1;alert("send by HEX");},
	snd_asc : function(){app.sndChecked = 0;alert("send by ASCII");},

	cyc_dis : function(){app.snd_cyclic_sign = 0;},
	cyc_100 : function(){app.snd_cyclic_sign = 1; app.interval = 100;},
	cyc_200 : function(){app.snd_cyclic_sign = 1; app.interval = 200;},
	cyc_500 : function(){app.snd_cyclic_sign = 1; app.interval = 500;},
	cyc_800 : function(){app.snd_cyclic_sign = 1; app.interval = 800;},
	cyc_103 : function(){app.snd_cyclic_sign = 1; app.interval = 1000;},

	console_data : function(string){
		app.console_String.push(string);
	},

	consoleShow : function(){
		app.consoleshow.innerHTML+=app.console_String.toString();
		app.consoleshow.innerHTML+="\n";	
	},

	
	consoleMode : function(){
		var consoleMode=document.getElementById("consoleMode");
		consoleMode.addEventListener("keydown",function(e){
			app.preData=this.value;		
		},false);
		consoleMode.addEventListener("keyup",function(e){
			app.nextData=this.value;
			if(app.preData.length<app.nextData.length){
				var data=app.nextData.slice(-1);
				if(data){
					var hexChecked=document.getElementById("consoleTxHex").checked;
					var writeType=hexChecked?"HEX":"ASCII";
	    			app.DialogSerialPortProfile.write(writeType,data,function(){console.log("write success")},function(){console.log("write error")});
	    		}
    		}    			
		},false);
	},
};
