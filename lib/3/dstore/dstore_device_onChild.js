function dstore_device_onChild() {
  // Setup listener for changes to firebase db device
  let { database, ref, onChildAdded, onChildChanged, onChildRemoved } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/device`;
  let refPath = ref(database, path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('dstore_device_onChild Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('dstore_device_onChild Changed', data);
    receivedDeviceKey('dstore_device_onChild Changed', data);
  });

  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('dstore_device_onChild Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(msg, data, remove) {
    let key = data.key;
    let val = data.val();
    // ui_log(msg, key, 'n=', Object.keys(val).length);
    // ui_log(msg, key, 'n=', JSON.stringify(val));
    // ui_log(msg, key, val.name_s);

    if (remove) {
      if (my.stored_devices) {
        delete my.stored_devices[key];
        my.ndevice = Object.keys(my.stored_devices).length;
      }
      return;
    }
    dstore_device_fetch(key, val);
  }
}
window.dstore_device_onChild = dstore_device_onChild;

function dstore_device_fetch(uid, val) {
  if (!my.stored_devices) {
    my.stored_devices = {};
  }
  let device = my.stored_devices[uid];
  let fresh = 0;
  if (!device) {
    // First use of device, add to my.stored_devices
    let index = Object.keys(my.stored_devices).length;
    device = { uid, index };
    my.stored_devices[uid] = device;
    my.ndevice = index + 1;
    fresh = 1;
  }
  if (val) {
    device.serverValues = val;
  }
  if (fresh && uid == my.uid) {
    // device must be inited to record visit event
    dstore_device_visit();
  }
  return device;
}
window.dstore_device_fetch = dstore_device_fetch;

// --

function dstore_device_remove() {
  let { database, ref, set } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/device/${my.uid}`;
  let refPath = ref(database, path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      // ui_log('dstore_device_remove OK');
    })
    .catch((error) => {
      // The write failed...
      ui_log('dstore_device_remove error', error);
    });
}
window.dstore_device_remove = dstore_device_remove;
