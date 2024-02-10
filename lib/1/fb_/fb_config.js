//
// Expose firebase api to non-import code p5js script.js
// via variable fb_.xxxx
// fb_.init
// fb_.app
// fb_.auth
// fb_.signInAnonymously
//

// Documentation starting reference
//    https://firebase.google.com/docs/web/alt-setup?authuser=0&hl=en

// console.log('fb_config');

import {
  initializeApp, //
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';

import {
  getAuth, //
  signInAnonymously,
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

// Your web app's Firebase configuration
// jht9629
const firebaseConfig_jht9629 = {
  apiKey: 'AIzaSyDLxi_fvCG2kzD2eJ4MxEZbOJ_GFSpIVe0',
  authDomain: 'molab-485f5.firebaseapp.com',
  databaseURL: 'https://molab-485f5-default-rtdb.firebaseio.com',
  projectId: 'molab-485f5',
  storageBucket: 'molab-485f5.appspot.com',
  messagingSenderId: '219508380677',
  appId: '1:219508380677:web:b5d846a150e7d60368b86c',
  measurementId: 'G-40F0BN8L7L',
};
// jht1493
const firebaseConfig_jht1493 = {
  apiKey: 'AIzaSyBl4dTlon41lMW1b3CgJ7LphBH_fi6RETo',
  authDomain: 'molab-2022.firebaseapp.com',
  databaseURL: 'https://molab-2022-default-rtdb.firebaseio.com',
  projectId: 'molab-2022',
  storageBucket: 'molab-2022.appspot.com',
  messagingSenderId: '1007268220063',
  appId: '1:1007268220063:web:a69f608f35ca3f8d9a26aa',
};
let configs = {
  jht9629: firebaseConfig_jht9629,
  jht1493: firebaseConfig_jht1493,
};

// Initialize Firebase is performed by init function

function init(config) {
  // config is object or string key into configs
  let configLabel;
  let nconfig = config;
  if (typeof nconfig == 'string') {
    // console.log('fb_config config string', config);
    configLabel = nconfig;
    nconfig = configs[config];
  }
  // if config object not found, default to firebaseConfig_jht9629
  nconfig = nconfig || firebaseConfig_jht9629;
  nconfig.configLabel = configLabel;
  nconfig.configVersion = '?v=1';
  // console.log('fb_config config', config);
  // console.log('fb_config config.projectId', config.projectId);
  fb_.app = initializeApp(nconfig);
  fb_.auth = getAuth();
  fb_.fbase.init();
  fb_.fstore.init();
  return nconfig;
}

import { fstore } from './fb_fstore.js?v=1';

import { fbase } from './fb_fbase.js?v=1';

// export api for non-module script
const fb_ = {
  init,
  signInAnonymously,
  fbase,
  fstore,
};

window.fb_ = fb_;

// https://firebase.google.com/docs/projects/api-keys
