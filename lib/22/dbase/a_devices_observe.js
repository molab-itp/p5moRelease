//

function dbase_a_devices_observe({ observed_a_device, removed_a_device, all }) {
  //
  if (!my.a_device_values) my.a_device_values = {};

  // 'mo-paint/a_device'
  dbase_app_observe(
    { observed_device, removed_device }, //
    { app: my.mo_app + '/a_device' }
  );

  // dbase_app_observe --> dbase_observe_devices
  //

  function observed_device(key, value) {
    // console.log('observed_device key', key, 'value', value);
    my.a_device_values[key] = value;
    build_devices(key);
  }

  function removed_device(key, value) {
    console.log('removed_key_value key', key, 'value', value);
    delete my.a_device_values[key];
    build_devices(key, { removed: 1 });
  }

  // ?? can performance improved by knowing that only specific device is updated?
  // Collection list of active devices and keep current in sync
  //
  function build_devices(key, removed) {
    // console.log('build_devices key', key);
    //
    let siteDevices = dbase_site_devices();
    let devices = [];
    for (let index = 0; index < siteDevices.length; index++) {
      let sdevice = siteDevices[index];
      let uid = sdevice.uid;
      let device = my.a_device_values[uid];
      if (!device) {
        // console.log('build_devices no uid', uid);
        continue;
      }
      if (all || device_uid_isActive(uid)) {
        device.uid = uid;
        devices.push(device);
      }
    }
    my.a_devices = devices;
    if (removed) {
      removed_a_device(key);
    } else {
      let a_device = my.a_device_values[key];
      if (observed_a_device) observed_a_device(key, a_device);
    }
  }
}
window.dbase_a_devices_observe = dbase_a_devices_observe;

function dbase_a_devices() {
  if (!my.a_devices) my.a_devices = [];
  return my.a_devices;
}
window.dbase_a_devices = dbase_a_devices;

function dbase_a_device_for_uid(uid) {
  // console.log('dbase_a_device_for_uid uid', uid, my.a_device_values[uid]);
  if (!my.a_device_values) my.a_device_values = {};
  return my.a_device_values[uid];
}
window.dbase_a_device_for_uid = dbase_a_device_for_uid;
