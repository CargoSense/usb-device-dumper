var usb = require('usb');
var async = require('async');

var info = require('./info');

var devices = usb.getDeviceList();

async.each(devices, function(device, cb) {
  info(device, function(err, dev) {
    console.log(JSON.stringify(dev));
    cb();
  });
}, function(err) {
  if (!err) {
    console.log("All devices output. Press ^C.");
  } else {
    console.log("Error: " + err);
  }
});
