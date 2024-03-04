//
// Send an update to all a_devices
//
function dbase_devices_update(deviceProps) {
  //
  if (!my.a_device_values) {
    console.log('dbase_devices_update NO my.a_device_values', my.a_device_values);
    return;
  }
  let path = `${my.dbase_rootPath}/${my.roomName}/${my.mo_app}`;
  let { getRefPath, update } = fireb_.fbase;
  let refPath = getRefPath(path);
  // ui_log('dbase_update_props', path);

  let updates = {};
  for (let uid in my.a_device_values) {
    for (let prop in deviceProps) {
      let value = deviceProps[prop];
      let dpath = `a_device/${uid}/${prop}`;
      updates[dpath] = value;
    }
  }

  update(refPath, updates);
}
window.dbase_devices_update = dbase_devices_update;

//
// throttle update to queue to time
//
function dbase_queue_update(props) {
  //
  if (!my.db_queue) {
    my.db_queue = {};
    my.db_queue_loop = new Anim({ time: 0.25, action: check_queue });
    my.db_queue_count = 0;
    my.db_queue_count_last = 0;
  }
  Object.assign(my.db_queue, props);
  my.db_queue_count++;
  function check_queue() {
    // console.log('check_queue db_queue_count_last', my.db_queue_count_last, my.db_queue_count);
    if (my.db_queue_count_last != my.db_queue_count) {
      my.db_queue_count_last = my.db_queue_count;

      dbase_update_props(my.db_queue);

      my.db_queue = {};
    }
  }
}
window.dbase_queue_update = dbase_queue_update;

//
// Check for pending queue updates
//
function dbase_poll() {
  if (my.db_queue_loop) {
    my.db_queue_loop.step({ loop: 1 });
  }
}
window.dbase_poll = dbase_poll;

//
// Return non-zero if any actions issued for device uid
//
// dbase_actions_issued(uid, { clear_action: 1})
//
function dbase_actions_issued(uid, actions) {
  // console.log('dbase_actions_issued uid', uid, 'actions', actions);
  let actionSeen = 0;
  if (!my.db_last_actions_uid) my.db_last_actions_uid = {};
  if (!my.a_device_values) {
    console.log('dbase_actions_issued uid', my.uid, 'no a_device_values', my.a_device_values);
    return;
  }
  let device = my.a_device_values[uid];
  if (!device) {
    console.log('dbase_actions_issued uid', uid, 'no device', device);
    return;
  }
  let last_actions = my.db_last_actions_uid[uid];
  if (!last_actions) {
    last_actions = {};
    my.db_last_actions_uid[uid] = last_actions;
  }
  for (let act in actions) {
    if (last_actions[act] != device[act]) {
      // console.log('dbase_actions_issued device act', device[act]);
      last_actions[act] = device[act];
      actionSeen++;
    }
  }
  return actionSeen;
}
window.dbase_actions_issued = dbase_actions_issued;

//
// Issue actions to my device
//
// dbase_issue_actions( { clear_action: 1 }, { all: 1} )
//
function dbase_issue_actions(actions, options) {
  //
  if (!options) options = {};
  let nactions = {};
  for (let act in actions) {
    nactions[act] = dbase_increment(1);
  }
  if (options.all) {
    dbase_devices_update(nactions);
  } else {
    dbase_queue_update(nactions);
  }
}
window.dbase_issue_actions = dbase_issue_actions;

//
// Issue actions to all a_devices
//
function dbase_devices_issue_actions(actions) {
  //
  let nactions = {};
  for (let act in actions) {
    nactions[act] = dbase_increment(1);
  }
  // dbase_queue_update({ clear_action: dbase_increment(1) });
  dbase_devices_update(nactions);
}
window.dbase_devices_issue_actions = dbase_devices_issue_actions;
