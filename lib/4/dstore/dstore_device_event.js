//
// device {
//   "count": 259,
//   "date_s": "2023-12-22T03:51:03.651Z",
//   event: [ ... ]
// }

// inputs:
// my.uid
// my.nameDevice

function dstore_device_event_visit() {
  dstore_device_event({ event: 'visit', count: 'visit_count' });
}
window.dstore_device_event_visit = dstore_device_event_visit;

function dstore_device_event_update() {
  dstore_device_event({ event: 'update', count: 'update_count' });
}
window.dstore_device_event_update = dstore_device_event_update;

function dstore_device_event(keys) {
  dstore_device_updates({}, keys);
}

function dstore_device_updates(updates, keys) {
  // console.log('dstore_device_event my.uid', my.uid);
  // ui_log('dstore_device_event my.uid', my.uid);
  if (!my.uid) return;

  let { database, ref, update, increment } = fb_.fbase;
  let path = `${my.dstore_rootPath}/${my.roomName}/device/${my.uid}`;
  // ui_log('dstore_device_event', path);
  let refPath = ref(database, path);

  let date_s = new Date().toISOString();
  let count = increment(1);
  let name_s = my.nameDevice || '';
  let userAgent = navigator.userAgent;

  if (!updates) updates = {};
  if (!keys) {
    keys = { event: 'update', count: 'update_count' };
  }
  Object.assign(updates, { date_s, [keys.count]: count, name_s, userAgent });

  // Acivity is only updated if present in recently received server info
  let events = dstore_device_events(keys, my.uid, date_s);
  if (events) {
    updates[keys.event] = events;
    updates.time = events[0].time;
    updates.time_s = events[0].time_s;
  }
  update(refPath, updates);
}
window.dstore_device_updates = dstore_device_updates;

function dstore_device_events(keys, uid, date_s) {
  // ui_log('dstore_device_events uid', uid, date_s);
  let events = dstore_init_events(keys, uid, date_s);
  if (!events) return null;

  let event = events[0];
  if (!my.eventLogTimeMax) {
    my.eventLogTimeMax = 2000;
    my.eventLogMax = 9;
  }
  let nowTime = new Date(date_s).getTime();
  let pastTime = new Date(event.date_s).getTime();
  let ndiff = nowTime - pastTime;
  if (ndiff > my.eventLogTimeMax) {
    // Create a new entry at head of the event log
    let time = 0;
    let time_s = '';
    event = { date_s, time, time_s };
    events.unshift(event);
  } else {
    // Update the first entry with new time and date
    event.date_s = date_s;
    event.time += ndiff;
    event.time_s = dstore_timeToSeconds(event.time);
  }
  dstore_updateTimeGap(events);
  if (events.length > my.eventLogMax) {
    // Delete the last entry to keep to max number permitted
    events.splice(-1, 1);
  }
  return events;
}

function dstore_init_events(keys, uid, date_s) {
  let time = 0;
  let initActivities = [{ date_s, time }];
  // return null if no server info received yet
  //  or no entry for this device
  if (!my.stored_devices) return null;

  let device = my.stored_devices[uid];
  if (!device) return null;

  let events = device.serverValues && device.serverValues[keys.event];
  if (!events || events.length == 0) {
    return initActivities;
  }

  return events;
}

function dstore_device_isActive(device) {
  let gapTime = dstore_device_eventGapTime(device);
  // console.log('dstore_device_isActive device.index', device.index, 'gapTime', lapgapTimese, my.eventLogTimeMax);
  return gapTime < my.eventLogTimeMax;
}
window.dstore_device_isActive = dstore_device_isActive;

function dstore_device_eventGapTime(device) {
  let events = device.serverValues && device.serverValues.update;
  if (!events || events.length == 0) {
    return Number.MAX_VALUE;
  }
  let event = events[0];
  let gapTime = Date.now() - new Date(event.date_s);
  // console.log('dstore_device_eventGapTime device.index', device.index, 'gapTime', gapTime);
  return gapTime;
}
