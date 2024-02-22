//

function dbase_a_devices_observe({ observed_a_devices, all }) {
  //
  if (!my.a_device_values) my.a_device_values = {};

  // 'mo-paint/a_device'
  dbase_event_observe(
    { changed_key_value, removed_key_value }, //
    { app: my.mo_app + '/a_device' }
  );

  // dbase_event_observe --> dbase_observe_devices
  //

  function changed_key_value(key, value) {
    // console.log('changed_key_value key', key, 'value', value);
    my.a_device_values[key] = value;
    build_devices(key);
  }

  function removed_key_value(key, value) {
    console.log('removed_key_value key', key, 'value', value);
    delete my.a_device_values[key];
    build_devices(key);
  }

  // ?? can performance improved by knowing that only specific device is updated?
  // Collection list of active devices and keep current in sync
  //
  function build_devices(key) {
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

    if (observed_a_devices) observed_a_devices(key);
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

      dbase_update_props({}, my.db_queue);

      my.db_queue = {};
    }
  }
}
window.dbase_queue_update = dbase_queue_update;

function dbase_poll() {
  if (my.db_queue_loop) {
    my.db_queue_loop.step({ loop: 1 });
  }
}
window.dbase_poll = dbase_poll;

// dbase_issue_actions( {clear_action: 1} )
//
function dbase_issue_actions(actions) {
  //
  let nactions = {};
  for (let act in actions) {
    nactions[act] = dbase_value_increment(1);
  }
  // dbase_queue_update({ clear_action: dbase_value_increment(1) });
  dbase_queue_update(nactions);
}
window.dbase_issue_actions = dbase_issue_actions;

// dbase_actions_issued(my, { clear_action: 1})
//
function dbase_actions_issued(my, actions) {
  // console.log('dbase_actions_issued my', my, 'actions', actions);
  //
  let actionSeen = 0;
  if (!my.db_actions_state) my.db_actions_state = {};
  if (!my.db_last_actions_state) my.db_last_actions_state = {};
  // console.log('dbase_actions_issued actions', actions);
  for (let act in actions) {
    if (my.db_last_actions_state[act] != my.db_actions_state[act]) {
      my.db_last_actions_state[act] = my.db_actions_state[act];
      actionSeen++;
    }
  }
  return actionSeen;
}
window.dbase_actions_issued = dbase_actions_issued;
