var BluetoothState, Bluetooth, BluetoothView, bluetoothView, Device, macAddress, DeviceCollection, DeviceView, showError, display, clear, dt;
//-------------------------------------------------app setting-------------------------------------------------------------
	var changeSetting, onChange;
	var app;
    
    document.addEventListener("deviceready", function () {
    app = new kendo.mobile.Application(document.body, { transition: "", layout: "mobile-tabstrip", initial: "#home", loading: "<h1>loading...</h1>"});
	graph();
	}, false);
	
//--------------------------------------------------------settings settings-------------------------------------------------
	changeSetting = function() {
        var listviews = this.element.find("ul.km-listview");

        $("#select-option").kendoMobileButtonGroup({
            select: function(e) {
                listviews.hide()
                         .eq(e.sender.selectedIndex)
                         .show();
            },
            index: 0
        });
    };
//-------------------------------------------------------firt time Off/Ready bluetooth state ooof------------------------------
			//$("#footButtons").data("kendoTabStrip").on("select", _.bind(this.onLoad, this));
			//$("#footButtons").data("kendoTabStrip").bind("select", onSelect);
			var i=0;
			onSelect = function(e) {
			if((e.item.prop("id")=="tab2")&&(i==0)){
			//console.log(e.item);
			 i=1;
			 Enable();
			 }  
			}

//----------------------------------switch change event--------------------------------
	onChange = function(e) {
		console.log(e.checked);//true of false
		//-------------onToggleOn
		if(e.checked){
			bluetoothView.model.set({
				state: BluetoothState.Ready
			}); 
			//window.bluetooth.enable(bluetoothView.model);
		}
		//-------------onToggleOff
		else{
			bluetoothView.model.set({
				state: BluetoothState.Off
			}); 
			//window.bluetooth.disable(bluetoothView.model);
		}
		return bluetoothView;
	}
//-----------------------------------------------------is enable ----------------------------------------    

function Enable(){
	
	 /*window.bluetooth.isEnabled(function(isEnabled) {

		if(isEnabled){
			 bluetoothView.model.set({
				state: BluetoothState.Ready
			}); 
		}
		else{
			 bluetoothView.model.set({
				state: BluetoothState.Off
			});			
		}
    });*/

	bluetoothSerial.isEnabled(
        function() {
            alert("Bluetooth is enabled");
        },
        function() {
            alert("Bluetooth is *not* enabled");
        }
    );


	return bluetoothView;
};
//------------------------------------------------graph settings----------------------------------------------------
  function graph() {

		// We use an inline data source in the example, usually data would
		// be fetched from a server

		var data = [],
			totalPoints = 300;

		function getRandomData(dat) {

			if (data.length > 0)
				data = data.slice(1);

			// Do a random walk

			while (data.length < totalPoints) {

				//var prev = data.length > 0 ? data[data.length - 1] : 50,
					if(dat!=null){
					clear();	
					display(dat);
					y = dat;//prev + Math.random() * 10 - 5;
					}
					else
					y=100;	
				if (y < 0) {
					y = 0;
				} else if (y > 100) {
					y = 100;
				}

				data.push(y);
			}

			// Zip the generated y values with the x values

			var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]])
			}

			return res;
		};

		// Set up the control widget

		var updateInterval = 1;

		var plot = $.plot("#placeholder", [ getRandomData(dt) ], {
			series: {
				shadowSize: 0	// Drawing is faster without shadows
				
			},
			lines:{
			  lineWidth: 4
			},
			yaxis: {
				min: 0,
				max: 250,
				tickLength:0,
				show: false
				
			},
			xaxis: {
				show: false
			},
			grid: {
				show: true,
				hoverable : true,
				margin: {top: 0, right: 0, bottom: 0, left: 0},
				borderWidth: {top: 0, right: 0, bottom: 0, left: 0}
			},
			colors: ["#ED561B"] //"#dba255", "#919733" ,blue 058DC7 , darck red '#AA4643', green'#50B432', orange'#ED561B'
		});

		function update() {

			plot.setData([getRandomData(dt)]);

			// Since the axes don't change, we don't need to call plot.setupGrid()
			plot.draw();
			setTimeout(update, updateInterval);
		};

		update();
	};

//--------------------------------------------------------bluetooth settings-----------------------------------------------
//Backbone defaults Model of bluetooth setting
BluetoothState = Backbone.Model.extend({}, {
     Off: 1,
     Busy: 2,
     Ready: 3,
     Connected: 4
    });
// instance of BluetoothState
Bluetooth = new BluetoothState({
     state: BluetoothState.Busy
    });

// -----------------------Backbone view responsible of bluetooth settings-------------------------------

BluetoothView = Backbone.View.extend({
	
	events: {
	"click #btnBtDiscover": "onDiscover"
    },
	
	onDiscover : function() {
		var opts ={};
		var self= this;
		opts.timeout=10000;
		//alert(opts.timeout);
		var discoverbButtonInst = this.$("#btnBtDiscover").data("kendoMobileButton");
		if(this.$("#btnBtDiscover").data("kendoMobileButton").options.enable){
			//console.log("clicked");
			clear();
			onDeviceDiscovered = function(device) {
				return devices.add(new Device(device));
			};
			onDiscoveryFinished = function() {
				//alert(self.model.get("state"));
				self.model.set({
				state: BluetoothState.Ready
				});
				return this;
			//return $("#btn-bt-discover").button("reset");
			};
			this.model.set({
				state: BluetoothState.Busy
			});
			devicesView.model.reset(); 
			//window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onDiscoveryFinished,opts);
			return this;
		}
	},
	initialize: function(){
		return this.model.on("change", this.render, this);
	},
	render: function() {
		var	switchInstance = this.$("#onOffBluetooth").data("kendoMobileSwitch");
		var	buttonInstance = this.$("#btnBtDiscover").data("kendoMobileButton");
		var buttonConnect = this.$(".btn-bt-connect").data("kendoMobileButton");
		var buttonDisconnect = this.$(".btn-bt-disconnect").data("kendoMobileButton");

		if (this.model.get("state")== BluetoothState.Off){
          switchInstance.enable();
		  switchInstance.refresh();
          buttonInstance.enable(false);
		  if(buttonConnect)
		  buttonConnect.enable(false);
		  if(buttonDisconnect)
		  buttonDisconnect.enable(false);
         }
        else if(this.model.get("state")== BluetoothState.Busy){

          switchInstance.enable(false);
          buttonInstance.enable(false);
		  if(buttonConnect)
		  buttonConnect.enable(false);
		  if(buttonDisconnect)
		  buttonDisconnect.enable(false);
          }
		else if(this.model.get("state")== BluetoothState.Ready){
		  if(switchInstance.element.prop("checked")){
			switchInstance.enable();}
			else{
			switchInstance.check(true);
			switchInstance.enable();
			}
			buttonInstance.enable();
			if(buttonConnect)
			buttonConnect.enable();
			if(buttonDisconnect)
			buttonDisconnect.enable();
          }
        else if(this.model.get("state")== BluetoothState.Connected){
          switchInstance.enable(false);
          buttonInstance.enable();
		  buttonConnect.enable(false);
		  buttonDisconnect.enable();
         }
    return this;
    },
	
});

bluetoothView=new BluetoothView({el:"#settings", model: Bluetooth });

//------------------------------------Backbone view responsible of devices settings---------------------------------

Device = Backbone.Model.extend({
    defaults: {
      name: "name",
      address: "address",
      isConnected: false
    }
});

DeviceCollection = Backbone.Collection.extend({
model: Device
});
DeviceView = Backbone.View.extend({
	tagName:"li",
	events: {
		"click .btn-bt-connect": "connect",
		"click .btn-bt-disconnect": "disconnect"
	},
	initialize: function() {
      return this.model.on("change", this.render, this);
	},
	render:function(){
		var source = $("#deviceTemplate").html();
		var template = _.template(source);
		this.$el.html(template({
				name: this.model.get("name"),
				address: this.model.get("address"),
				isConnected: this.model.get("isConnected")
		}));
		return this;
	},
	connect: function() {
      var gotUuids, onError;
      onErrorx = (function(_this) {
        return function() {
          return bluetoothView.model.set({
            state: BluetoothState.Ready
          });
        };
      })(this);
      gotUuids = (function(_this) {
        return function(device) {
          var onConnectionEstablished;
          onConnectionEstablished = function() {
            var onConnectionLost, onMessageReceived;
            onMessageReceived = function(msg) {
              return console.log(msg);
            };
            onConnectionLost = function() {
              _this.model.set({
                isConnected: false
              });
              return onErrorx();
            };
            _this.model.set({
              isConnected: true
            });
			bluetoothView.model.set({
            state: BluetoothState.connected
            });
            //return window.bluetooth.startConnectionManager(onMessageReceived, onConnectionLost);
          };
          //return window.bluetooth.connect(onConnectionEstablished, onErrorx, {
            address: _this.model.get("address"),
            uuid: device.uuids[0]
          });
        };
      })(this);
      bluetoothView.model.set({
        state: BluetoothState.Busy
      });
	   macAddress = this.model.get("address");
	   var self=this;
	   var onSuccess = serialConnect(self);
	   var onError= function(){
	   //return window.bluetooth.getUuids(gotUuids, onErrorx, macAddress);
	   }
	   //window.bluetooth.isPaired(onSuccess, onError, macAddress);
	    
	   return this;
    },
	disconnect: function() {
      bluetoothView.model.set({
        state: BluetoothState.Busy
      });
	  var self=this;
       ////window.bluetooth.disconnect(onDisconnected);
		serialDisconnect(self);   
		return this;
    }
});

DeviceListView = Backbone.View.extend({
    initialize: function() {
      return this.model.on("change reset add", this.render, this);
    },
	onDeviceAdded: function(){
	 console.log("device added");
	},
    render: function() {
	
	  this.$el.html("");
      var self = this;
	  this.model.each(function(device){
	  var deviceView= new DeviceView({model:device});
	  self.$el.append(deviceView.render().$el);
	  });
	  return this;
    }
  });
  
devices = new DeviceCollection();
devicesView = new DeviceListView({el:"#devices", model:devices});


//--------------------------------serial functions--------------------------------
function serialConnect(self) {
		clear();
        display("Attempting to connect. " +
            "Make sure the serial port is open on the target device.");
        // attempt to connect:---------------------------------------------------
		var openPort= function() {
            // if you get a good Bluetooth serial connection:
			self.model.set({
              isConnected: true
            });
			bluetoothView.model.set({
            state: BluetoothState.connected
            });
             display("Connected to: " + macAddress);
            // set up a listener to listen for newlines
            // and display any new data that's come in since
            // the last newline:
			 bluetoothSerial.subscribe('\n', function (data) {
                clear();
				dt=data;
                //display("data: "+data+"  dt: "+dt);

             });
        };
		onErrorConnect = function(error){
              bluetoothView.model.set({
                state: BluetoothState.Ready
              });
			  self.model.set({
                isConnected: false
              });
		      display(error);
              //return _this.$(".btn-bt-connect").button("reset");
        };
		bluetoothSerial.connect(
                macAddress,  // device to connect to
                openPort,    // start listening if you succeed
                onErrorConnect    // show the error if you fail
        );
};
function serialDisconnect(self) {
            
			var closePort = function() {
			self.model.set({
              isConnected: false
            });
			bluetoothView.model.set({
            state: BluetoothState.Ready
            });
            // if you get a good Bluetooth serial connection:
            display("Disconnected from: " + macAddress);
			alert("goog one");
            // unsubscribe from listening:
            bluetoothSerial.unsubscribe(
                    function (data) {
                        //display(data);
                        dt=data;
                		//display("data: "+data+"  dt: "+dt);
                    },
                    showError
            );
			};
			
			onErrorDisconnect = function(error){
					bluetoothView.model.set({
						state: BluetoothState.connected
					});
					display(error);
					//return _this.$(".btn-bt-disconnect").button("reset");

			};
			display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                closePort,     // stop listening to the port
                onErrorDisconnect      // show the error if you fail
            );
			
 };


/*
    appends @error to the message div:
*/
showError = function(error){
        display(error);
};
/*
    appends @message to the message div:
*/
display = function(message){
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
};
/*
    clears the message div:
*/
clear = function(){
        var display = document.getElementById("message");
        display.innerHTML = "";
};
