//

// dbase.date_s;
// dbase.remote

//
function dbase_app_init({ completed }) {
  //
  let config = fireb_.init(my.fireb_config);
  console.log('configVersion', config.configVersion);
  console.log('config.projectId', config.projectId);
  console.log('configLabel', config.configLabel);
  console.log('room', my.roomName);

  createStatusElement();

  let { signInAnonymously, auth } = fireb_;
  signInAnonymously(auth)
    .then(() => {
      my.uid = auth.currentUser.uid;
      console.log('dbase_app_init my.uid', my.uid);

      dbase_report_status({});

      dbase_site_observe();

      // Send initial ping
      dbase_update_props({}, { count: 1 });

      if (completed) completed();
    })
    .catch((error) => {
      console.log('dbase_app_init error', error);
    });
}
globalThis.dbase_app_init = dbase_app_init;

// return array of devices, most recently active first
function dbase_site_devices(show) {
  if (!my.fireb_devices) {
    // console.log('no fireb_devices');
    return [];
  }
  let arr = Object.values(my.fireb_devices).sort((item1, item2) => {
    let date1 = item1.dbase.date_s;
    let date2 = item2.dbase.date_s;
    return date1.localeCompare(date2);
  });
  // Latest date first
  arr.reverse();
  if (show) {
    let lines = [];
    for (let item of arr) {
      let { uid } = item;
      let { date_s, visit_count, update_count, userAgent } = item.dbase;
      userAgent = userAgent.substring(8, 48);
      lines.push(date_s + ' visit_count ' + visit_count + ' update_count ' + update_count);
      lines.push(uid + ' ' + userAgent);
      // console.log('');
    }
    lines.push('dbase_site_devices n ' + arr.length);
    console.log(lines.join('\n'));
  }
  // [ {
  //    index
  //    dbase {date_s: '2024-02-19T03:52:26.337Z', name_s: '', time: 0, time_s: '', update: Array(9), …}
  //    uid
  //    } ... ]
  //
  return arr;
}
globalThis.dbase_site_devices = dbase_site_devices;

function createStatusElement() {
  if (!document) return;
  if (!my.statusElement) {
    my.statusElement = document.createElement('span');
    document.body.appendChild(my.statusElement);
    my.statusElement.style.position = 'fixed';
    my.statusElement.style.pointerEvents = 'none';
  }
  dbase_positionStatus();
  my.statusElement.textContent = 'Starting...';
}

function dbase_positionStatus() {
  if (!my.statusElement) return;

  let w = window.innerWidth;
  let h = 10;

  let x = window.innerWidth - w;
  let y = window.innerHeight - h;
  let width = w;
  let height = h;

  my.statusElement.style.top = `${y}px`;
  my.statusElement.style.left = `${x}px`;
  my.statusElement.style.width = `${width}px`;
  my.statusElement.style.height = `${height}px`;

  my.statusElement.style.zIndex = 10;
  my.statusElement.style.backgroundColor = 'black';
  my.statusElement.style.color = 'white';
  my.statusElement.style.fontSize = `${h}px`;
}
globalThis.dbase_positionStatus = dbase_positionStatus;

function dbase_report_status(props) {
  if (!my.statusElement) return;
  let uid = props.uid || '';
  let visit_count = props.visit_count || '';
  let ndevice = props.ndevice || '';
  my.statusElement.textContent = `${my.uid} ${uid} (${visit_count}) [${ndevice}]`;
}
globalThis.dbase_report_status = dbase_report_status;
