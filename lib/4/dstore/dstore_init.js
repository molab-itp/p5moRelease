function dstore_init({ dstore_host_init }) {
  let { signInAnonymously, auth } = fb_;
  signInAnonymously(auth)
    .then(() => {
      my.uid = auth.currentUser.uid;
      console.log('dstore_init my.uid', my.uid);

      dstore_device_onChild();

      // Send initial ping
      dstore_app_update({});

      if (dstore_host_init) dstore_host_init();
    })
    .catch((error) => {
      console.log('dstore_init error', error);
    });
}
window.dstore_init = dstore_init;

// return array of devices, most recently active first
function dstore_device_summary(show) {
  if (!my.stored_devices) {
    console.log('no stored_devices');
    return null;
  }
  let arr = Object.values(my.stored_devices).sort((item1, item2) => {
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
    lines.push('dstore_device_summary n ' + arr.length);
    console.log(lines.join('\n'));
  }
  return arr;
}
window.dstore_device_summary = dstore_device_summary;
