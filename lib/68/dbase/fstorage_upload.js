//

function fstorage_upload({ layer, path, imageQuality, result, error }) {
  // console.log('fstorage_img_upload');
  if (!layer || !layer.elt || !layer.elt.toBlob) {
    ui_error('fstorage_upload bad layer', layer);
    return;
  }
  if (!path) {
    ui_error('fstorage_upload missing path', path);
    return;
  }
  let imageType = 'image/jpeg';
  let last4 = path.substring(path.length - 4);
  if (last4.toLowerCase() == '.png') {
    imageType = 'image/png';
  }
  // console.log('last4', last4, 'imageType', imageType);

  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  layer.elt.toBlob(
    (blob) => {
      fstorage_upload_blob(blob, imagePath, result, error);
    },
    imageType,
    imageQuality
  );
}
window.fstorage_upload = fstorage_upload;

function fstorage_remove({ path, result, error }) {
  if (!path) {
    ui_error('fstorage_remove missing path', path);
    return;
  }
  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  let { getStorage, ref, deleteObject } = fireb_.fstorage;
  const desertRef = ref(getStorage(), imagePath);

  deleteObject(desertRef)
    .then(() => {
      // File deleted successfully
      ui_log('fstorage_remove ', imagePath);
      if (result) result(imagePath);
    })
    .catch((err) => {
      // Uh-oh, an error occurred!
      ui_error('fstorage_remove error', err);
      if (error) error(err);
    });
}
window.fstorage_remove = fstorage_remove;

function fstorage_download_url({ path, result, error }) {
  // console.log('fstorage_img_download ');

  let imagePath = `${my.dbase_rootPath}/${my.roomName}/${path}`;

  // my.lastDownloadPath = null;
  // ui_log('fstorage_img_download next_imagePath ' + path);
  let { getStorage, ref, getDownloadURL } = fireb_.fstorage;
  getDownloadURL(ref(getStorage(), imagePath))
    .then((url) => {
      ui_log('fstorage_img_download url', url);
      if (result) result(url);
    })
    .catch((err) => {
      // Handle any errors
      ui_error('fstorage_download_url error', err);
      if (error) error(err);
    });
}
window.fstorage_download_url = fstorage_download_url;

function fstorage_upload_blob(blob, imagePath, result, error) {
  // console.log('fstorage_upload', blob);
  let { getStorage, ref, uploadBytes } = fireb_.fstorage;
  // ui_log('fstorage_upload my.imagePath', my.imagePath);
  const storageRef = ref(getStorage(), imagePath);

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, blob)
    .then((snapshot) => {
      // ui_log('snapshot.metadata.fullPath ' + snapshot.metadata.fullPath);
      // console.log('snapshot', snapshot);
      // console.log('Uploaded path', path);
      ui_log('fstorage_upload ', imagePath);
      if (result) result(imagePath);
    })
    .catch((err) => {
      // Handle any errors
      ui_error('fstorage_upload error', err);
      if (error) error(err);
    });
}

// https://firebase.google.com/docs/storage/web/upload-files?authuser=0#upload_from_a_blob_or_file

// function next_imagePath(count) {
//   // console.log('next_imagePath');
//   let str = (count + my.count_base + 1).toString().padStart(my.image_seq_pad, '0');
//   return `${my.dbase_rootPath}/${my.clipsName}/${str}${my.imagExt}`;
// }
