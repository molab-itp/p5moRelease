//
// Expose firebase api to non-import code p5js script.js
// via variable fb_.xxxx
// fb_.fbase.dbRef
// ...

// console.log('fb_fbase');

import {
  child,
  get,
  getDatabase,
  increment,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  ref,
  set,
  update,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

function init() {
  // console.log('fb_fbase init');
  fbase.dbRef = ref(getDatabase());
  fbase.database = getDatabase();
}

export const fbase = {
  init,
  child,
  get,
  increment,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
  ref,
  set,
  update,
};

// -- History

// https://firebase.google.com/docs/database/web/read-and-write?hl=en&authuser=0#atomic_server-side_increments

// https://firebase.google.com/docs/database/web/read-and-write?hl=en&authuser=0

// Extracted to own file fb_firebase.js and use
//  <script type="module" src="firebase.js"></script>
// to load from index.html
// This step was to verify that script module import works in p5js editor

// Initial version that does not use module import
// https://editor.p5js.org/jht1493/sketches/5LgILr8RF
// Firebase-createImg-board
// Display images from Firebase storage as a bill board
