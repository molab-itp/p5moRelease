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

  if (deviceProps == undefined) {
    deviceProps = { count: increment(1) };
  }

  for (let prop in deviceProps) {
    let value = deviceProps[prop];
    let dpath = `device/${my.uid}/${prop}`;
    updates[dpath] = value;
  }

  if (groupProps !== undefined) {
    // !!@ Consider hanlding more than index as group prop
    let dpath = `group/${groupProps.group}/index`;
    updates[dpath] = groupProps.index;
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
