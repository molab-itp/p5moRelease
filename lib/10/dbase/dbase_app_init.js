function dbase_app_init({ completed }) {
  //
  let config = fireb_.init(my.fireb_config);
  console.log('configVersion', config.configVersion);
  console.log('config.projectId', config.projectId);
  console.log('configLabel', config.configLabel);
  console.log('room', my.roomName);

  let { signInAnonymously, auth } = fireb_;
  signInAnonymously(auth)
    .then(() => {
      my.uid = auth.currentUser.uid;
      console.log('dbase_app_init my.uid', my.uid);

      dbase_device_observe();

      // Send initial ping
      dbase_update_props({});

      if (completed) completed();
    })
    .catch((error) => {
      console.log('dbase_app_init error', error);
    });
}
window.dbase_app_init = dbase_app_init;

// return array of devices, most recently active first
function dbase_device_summary(show) {
  if (!my.fireb_devices) {
    // console.log('no fireb_devices');
    return null;
  }
  let arr = Object.values(my.fireb_devices).sort((item1, item2) => {
    let date1 = item1.serverValues.date_s;
    let date2 = item2.serverValues.date_s;
    return date1.localeCompare(date2);
  });
  // Latest date first
  arr.reverse();
  if (show) {
    let lines = [];
    for (let item of arr) {
      let { uid } = item;
      let { date_s, visit_count, update_count, userAgent } = item.serverValues;
      userAgent = userAgent.substring(8, 48);
      lines.push(date_s + ' visit_count ' + visit_count + ' update_count ' + update_count);
      lines.push(uid + ' ' + userAgent);
      // console.log('');
    }
    lines.push('dbase_device_summary n ' + arr.length);
    console.log(lines.join('\n'));
  }
  return arr;
}
window.dbase_device_summary = dbase_device_summary;
