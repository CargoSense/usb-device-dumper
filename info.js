var async = require('async');

function fieldPopulator(dev, field, descriptor) {
  return function(done) {
    var index = dev.deviceDescriptor[descriptor];
    if (index) {
      dev.getStringDescriptor(index, function(err, data) {
        if (!err) {
          dev.info[field] = data;
          done(null, dev);
        } else {
          done(null, dev);
        }
      });
    } else {
      done(null, dev);
    }
  }
}

function clean(dev) {
  return {
    info: dev.info,
    deviceAddress: dev.deviceAddress,
    busNumber: dev.busNumber
  };
}

function populateInfo(dev, cb) {
  // Basics
  dev.info = {
    vendorId: '0x' + dev.deviceDescriptor.idVendor.toString(16),
    productId: '0x' + dev.deviceDescriptor.idProduct.toString(16)
  };
  // We need to open the device to use `getStringDescriptor`
  try {
    dev.open();
  } catch(_) {
    debug("Could not open device");
    cb(null, clean(dev));
    return;
  }
  // Define the final callback for this device
  function callback(err, results) {
    try { dev.close() }
    catch(_) { /* Well, we tried... */ }
    cb(null, clean(dev));
  }
  // Populate thes serially (concurrent access fails)
  async.series([
    fieldPopulator(dev, 'manufacturer', 'iManufacturer'),
    fieldPopulator(dev, 'product', 'iProduct'),
    fieldPopulator(dev, 'serial', 'iSerialNumber')
  ], callback);
}

module.exports = populateInfo;
