//
function dbase_app_observe({ observed_key, removed_key, observed_item }, options) {
  // options = { app, tag }
  let app = my.mo_app;
  let tag = 'dbase_app_observe';
  if (options) {
    app = options.app || app;
    tag = options.tag || tag;
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
      if (removed_key) {
        removed_key(key, value);
      }
      return;
    }
    if (observed_key) {
      observed_key(key, value);
    }
    if (observed_item && key == 'a_group') {
      let group = my.group;
      if (group) {
        // broadcast group when has comma separated values
        //  my.group=s1,s2,... --> group=s0
        if (group.indexOf(',') > -1) {
          // For broadcast group - Observe special group 0
          group = 's0';
        }
      } else {
        // Default group
        group = 's0';
      }
      let item = value[group];
      // console.log('dbase_app_observe item', item);
      my.a_group_item = item;
      if (item) {
        observed_item(item);
      }
    }
  }
}
window.dbase_app_observe = dbase_app_observe;

function dbase_update_item(item) {
  let group = my && my.group;
  if (!group) group = 's0';
  // broadcast group when has comma separated values
  //  my.group=s1,s2,... --> group=s0
  if (group.indexOf(',') > -1) {
    // Special group 's0' recieves all updates
    group = 's0,' + group;
  }
  dbase_update_props(item, { group: group });
}
window.dbase_update_item = dbase_update_item;
