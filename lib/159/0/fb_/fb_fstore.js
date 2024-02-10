//
// firebase-storage
// Expose firebase api to non-import code p5js script.js
// via variable fb_.xxxx
// fb_.fstore.storage
// ...

// console.log('fb_fstore');

import {
  getDownloadURL,
  getStorage,
  list,
  listAll,
  ref,
  uploadBytes,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

function init() {
  // console.log('fb_fstore init');
  fstore.storage = getStorage();
}

export const fstore = {
  init,
  getDownloadURL,
  list,
  listAll,
  ref,
  uploadBytes,
};

//
