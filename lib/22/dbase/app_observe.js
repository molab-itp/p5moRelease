//
function dbase_app_observe({ observed_device, removed_device }, apps) {
  // apps = { app, tag }
  let app = my.mo_app;
  let tag = 'dbase_app_observe';
  if (apps) {
    app = apps.app || app;
    tag = apps.tag || tag;
  }
  // Setup listener for changes to firebase db device
  let path = `${my.dbase_rootPath}/${my.roomName}/${app}`;
  let { getRefPath, onChildAdded, onChildChanged, onChildRemoved } = fireb_.fbase;
  let refPath = getRefPath(path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('Changed', data);
    receivedDeviceKey('Changed', data);
  });

  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(op, data, remove) {
    let msg = tag + ' ' + op;
    let key = data.key;
    let value = data.val();
    // ui_log(msg, key, 'n=', Object.keys(val).length);
    // ui_log(msg, 'key', key, 'value', value);
    if (remove) {
      if (removed_key_value) {
        removed_device(key, value);
      }
      return;
    }
    if (observed_device) {
      observed_device(key, value);
    }
  }
}
window.dbase_app_observe = dbase_app_observe;
