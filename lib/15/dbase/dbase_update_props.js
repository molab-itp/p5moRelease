//
function dbase_update_props(props, deviceProps, groupProps) {
  // ui_log('dbase_update_props props', props, 'groupProps', groupProps);
  // ui_log('dbase_update_props props', props, 'deviceProps', deviceProps);
  // ui_log('dbase_update_props my.uid', my.uid);
  if (!my.uid) {
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/${my.mo_app}`;
  let { getRefPath, update, increment } = fireb_.fbase;
  let refPath = getRefPath(path);
  // ui_log('dbase_update_props', path);

  let updates = {};

  for (let prop in props) {
    updates[prop] = props[prop];
  }

  // default to increment ../mo_app/device/count
  //
  if (deviceProps == undefined) {
    deviceProps = { count: increment(1) };
  }

  for (let prop in deviceProps) {
    let value = deviceProps[prop];
    let dpath = `device/${my.uid}/${prop}`;
    updates[dpath] = value;
  }

  if (groupProps !== undefined) {
    // group=s1,s2,s3,s4 to broadcast
    let groups = groupProps.group.split(',');
    // console.log('dbase_update_props groups', groups);
    for (let group of groups) {
      for (let prop in groupProps) {
        if (prop == 'group') continue;
        let value = groupProps[prop];
        let dpath = `group/${group}/${prop}`;
        updates[dpath] = value;
      }
    }
  }
  // ui_log('dbase_update_props updates', updates);

  update(refPath, updates);

  dbase_device_event_update();
}
window.dbase_update_props = dbase_update_props;

function dbase_update_value(value, apps) {
  // apps = { app, tag, suffix }
  let app = my.mo_app;
  let tag = 'dbase_update_value';
  let suffix = '';
  if (apps) {
    app = apps.app || app;
    tag = apps.tag || tag;
    if (apps.suffix != undefined) suffix = '/' + apps.suffix;
  }
  if (!my.uid) {
    ui_log(tag + ' no uid', my.uid);
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/${app}/${my.uid}${suffix}`;
  let { getRefPath, update } = fireb_.fbase;
  let refPath = getRefPath(path);

  update(refPath, value);

  dbase_device_event_update();
}
window.dbase_update_value = dbase_update_value;

function dbase_value_increment(value) {
  let { increment } = fireb_.fbase;
  return increment(value);
}
window.dbase_value_increment = dbase_value_increment;

function dbase_remove_room() {
  let path = `${my.dbase_rootPath}/${my.roomName}`;
  let { getRefPath, set } = fireb_.fbase;
  let refPath = getRefPath(path);
  set(refPath, {})
    .then(() => {
      // Data saved successfully!
      console.log('dbase_remove_room OK');
    })
    .catch((error) => {
      // The write failed...
      console.log('dbase_remove_room error', error);
    });
}
window.dbase_remove_room = dbase_remove_room;
