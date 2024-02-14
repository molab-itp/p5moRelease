//
// firebase-storage
// Expose firebase api to non-import code p5js script.js
// via variable fireb_.xxxx
// fireb_.fstorage.storage
// ...

// console.log('fireb_fstorage');

import {
  getDownloadURL,
  getStorage,
  list,
  listAll,
  ref,
  uploadBytes,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

// function init() {
//   // console.log('fireb_fstorage init');
//   fstorage.storage = getStorage();
// }

export const fstorage = {
  // init,
  getDownloadURL,
  getStorage,
  list,
  listAll,
  ref,
  uploadBytes,
};

//
