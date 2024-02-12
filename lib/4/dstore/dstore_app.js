//
function dstore_app_onChild({ mo_app_key_value }) {
  // Setup listener for changes to firebase db device
  let { database, ref, onChildAdded, onChildChanged, onChildRemoved } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/${my.mo_app}`;
  let refPath = ref(database, path);

  onChildAdded(refPath, (data) => {
    receivedDeviceKey('dstore_app_onChild Added', data);
  });

  onChildChanged(refPath, (data) => {
    // console.log('dstore_app_onChild Changed', data);
    receivedDeviceKey('dstore_app_onChild Changed', data);
  });

  onChildRemoved(refPath, (data) => {
    receivedDeviceKey('dstore_app_onChild Removed', data, { remove: 1 });
  });

  function receivedDeviceKey(msg, data, remove) {
    let key = data.key;
    let value = data.val();
    // ui_log(msg, key, 'n=', Object.keys(val).length);
    // ui_log(msg, 'key', key, 'value', value);
    if (remove) {
      return;
    }
    if (mo_app_key_value) {
      // { index, qrcode }
      mo_app_key_value(key, value);
    }
  }
}
window.dstore_app_onChild = dstore_app_onChild;

//  props { index, qrcode, startup_time }
function dstore_app_update(props, deviceProps, groupProps) {
  // ui_log('dstore_app_update props', props, 'groupProps', groupProps);
  // ui_log('dstore_app_update props', props, 'deviceProps', deviceProps);
  // ui_log('dstore_app_update my.uid', my.uid);
  if (!my.uid) return;

  let { database, ref, update, increment } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/${my.mo_app}`;
  let refPath = ref(database, path);
  // ui_log('dstore_app_update', path);

  let updates = {};

  for (let prop in props) {
    updates[prop] = props[prop];
  }

  if (deviceProps == undefined) {
    deviceProps = { count: increment(1) };
  }

  for (let prop in deviceProps) {
    let value = deviceProps[prop];
    let dpath = `device/${my.uid}/${prop}`;
    updates[dpath] = value;
  }

  if (groupProps !== undefined) {
    let dpath = `group/${groupProps.group}/index`;
    updates[dpath] = groupProps.index;
  }

  // ui_log('dstore_app_update updates', updates);

  update(refPath, updates);

  dstore_device_event_update();
}
window.dstore_app_update = dstore_app_update;
