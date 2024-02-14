function dbase_device_observe() {
  // Setup listener for changes to firebase db device
  let { getRefPath, onChildAdded, onChildChanged, onChildRemoved } = fireb_.fbase;
  let path = `${my.dbase_rootPath}/${my.roomName}/device`;
  let refPath = getRefPath(path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('dbase_device_observe Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('dbase_device_observe Changed', data);
    receivedDeviceKey('dbase_device_observe Changed', data);
  });

  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('dbase_device_observe Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(msg, data, remove) {
    let key = data.key;
    let val = data.val();
    // ui_log(msg, key, 'n=', Object.keys(val).length);
    // ui_log(msg, key, 'n=', JSON.stringify(val));
    // ui_log(msg, key, val.name_s);

    if (remove) {
      if (my.fireb_devices) {
        delete my.fireb_devices[key];
        my.ndevice = Object.keys(my.fireb_devices).length;
      }
      return;
    }
    dbase_device_fetch(key, val);
  }
}
window.dbase_device_observe = dbase_device_observe;

function dbase_device_fetch(uid, val) {
  if (!my.fireb_devices) {
    my.fireb_devices = {};
  }
  let device = my.fireb_devices[uid];
  let fresh = 0;
  if (!device) {
    // First use of device, add to my.fireb_devices
    let index = Object.keys(my.fireb_devices).length;
    device = { uid, index };
    my.fireb_devices[uid] = device;
    my.ndevice = index + 1;
    fresh = 1;
  }
  if (val) {
    device.serverValues = val;
  }
  if (fresh && uid == my.uid) {
    // device must be inited to record visit event
    dbase_device_event_visit();
  }
  return device;
}
window.dbase_device_fetch = dbase_device_fetch;

// --

function dbase_device_remove() {
  let { getRefPath, set } = fireb_.fbase;
  let path = `${my.dbase_rootPath}/${my.roomName}/device/${my.uid}`;
  let refPath = getRefPath(path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      // ui_log('dbase_device_remove OK');
    })
    .catch((error) => {
      // The write failed...
      ui_log('dbase_device_remove error', error);
    });
}
window.dbase_device_remove = dbase_device_remove;
