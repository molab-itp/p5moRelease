import { a_ } from '../let/a_state.js?v=413';
import { ui_div_empty, ui_div_append, ui_createButton, ui_createElement } from '../core-ui/ui_tools.js?v=413';
import { ui_patch_eff_panes } from '../core-ui/ui_patch_eff.js?v=413';
import { ui_live_selection } from '../core-ui/ui_live.js?v=413';
import { PadLayout } from '../util/PadLayout.js?v=413';
import { ui_prop_set } from '../core-ui/ui_prop.js?v=413';
import { store_restore_from } from '../core/store_url_parse.js?v=413';
import { str_to_width_height } from '../core-ui/ui_canvas.js?v=413';
import { store_export_json, store_export_url, store_name_update } from '../core/store_url_parse.js?v=413';
import { patch_add, patch_instances_clear_all, patch_inst_update } from '../a/patch_inst.js?v=413';

let layout_options = ['Single', '1x1', '2x1', '2x2', '2x3', '3x2', '3x3', '3x1', '4x4', '1x4'];
let back_color_options = [0, 1, 50, 100, 200, 255, -1];

export function ui_patch_bar() {
  let div = ui_div_empty('ipatch_bar');
  let html = `
  <span>Layout: </span>
  <select id="ilayout">
    ${sel_layout_options(layout_options)}
  </select>
  <span> BackColor: </span>
  <select id="iback_color">
    ${sel_back_color_options(back_color_options)}
  </select>
  <button id="iexport">Export</button>
  <button id="ixurl">URL</button>
  <span> Setting: </span>
  <select id="isettings">
    ${sel_settings_options(a_.settings)}
  </select>
  `;
  ui_div_append(div, html);

  function sel_layout_options(ents) {
    let arr = ents.map((ent) => `<option value="${ent}">${ent}</option>`);
    return arr.join('');
  }

  function sel_back_color_options(ents) {
    let arr = ents.map((ent) => `<option value="${ent}">${ent}</option>`);
    return arr.join('');
  }

  function sel_settings_options(ents) {
    let arr = ents.map((ent, index) => `<option value="${index}">${ent.setting}</option>`);
    return arr.join('');
  }

  // a_.ui.patch_layout
  let ilayout = window.ilayout;
  ilayout.selectedIndex = layout_options.findIndex((ent) => ent === a_.ui.patch_layout);
  ilayout.addEventListener('change', layout_change);
  function layout_change() {
    console.log('layout_change');
    ui_prop_set('patch_layout', this.value);
    pad_layout_update();
    patch_instances_clear_all();
  }

  // a_.ui.back_color
  let iback_color = window.iback_color;
  iback_color.selectedIndex = back_color_options.findIndex((ent) => parseFloat(ent) === a_.ui.back_color);
  iback_color.addEventListener('change', back_color_change);
  function back_color_change() {
    let valu = parseFloat(this.value);
    ui_prop_set('back_color', valu);
  }

  // a_.ui.setting
  let isettings = window.isettings;
  isettings.selectedIndex = a_.settings.findIndex((ent) => ent.setting === a_.ui.setting);
  isettings.addEventListener('change', settings_change);
  function settings_change() {
    let index = parseFloat(this.value);
    let ent = a_.settings[index];
    store_restore_from(ent);
  }

  // iexport
  window.iexport.addEventListener('mousedown', function () {
    store_export_json();
  });

  // ixurl named to avoid spurious warning
  window.ixurl.addEventListener('mousedown', function () {
    store_export_url();
  });
}

export function ui_patch_buttons() {
  ui_createButton('Add Effect').mousePressed(function () {
    let newPatch = { eff_spec: { ipatch: 0, imedia: 1, eff_label: 'show' } };
    patch_add(newPatch);
  });
  ui_createElement('br');
}

// Rebuild dynamic elements of ui
export function ui_refresh() {
  // if (a_.hideui || a_.hide_ui_option) return;
  if (a_.hideui) return;
  ui_live_selection();
  ui_patch_eff_panes();
}

// Write out all patches to local storage
function ui_patch_save_all() {
  ui_prop_set('patches', a_.ui.patches);
}

// Write out all patches to local storage
// and reset given patch
export function ui_patch_update(aPatch) {
  // console.log('ui_patch_update');
  ui_prop_set('patches', a_.ui.patches);
  if (!aPatch) return;
  let ipatch = aPatch.eff_spec.ipatch;
  // console.log('ui_patch_update ipatch', ipatch);
  patch_inst_update(ipatch);
  a_.patch_instances[ipatch] = null;
}

export function pad_layout_update() {
  let layout;
  // console.log('pad_layout_update a_.ui.canvas_resize_ref |' + a_.ui.canvas_resize_ref + '|');
  if (a_.ui.canvas_resize_ref) {
    pads_resize_set_scale();
  } else {
    if (a_.ui.urects_lock) {
      console.log('pad_layout_update a_.ui.urects_lock');
      return;
    }
    layout = new PadLayout();
  }
  let urects_count = 0;
  let urect;
  for (let ipatch = 0; ipatch < a_.ui.patches.length; ipatch++) {
    let uiPatch = a_.ui.patches[ipatch];
    if (uiPatch) {
      let eff_spec = uiPatch.eff_spec;
      if (eff_spec.ipatch != ipatch) {
        // ipatch change due to deletes
        console.log('!!@ eff_spec.ipatch', eff_spec.ipatch, 'ipatch', ipatch);
        eff_spec.ipatch = ipatch;
      }
      if (layout) {
        urect = layout.next();
      } else if (eff_spec.urect_ref) {
        urect = Object.assign({}, eff_spec.urect_ref);
        console.log('pad_layout_ assign pad', JSON.stringify(urect));
        pads_resize_pad(urect);
      } else {
        // !!@ Error no urects_ref
        console.log('!!@ pad_layout_update urects_ref missing ipatch', ipatch, 'uiPatch', JSON.stringify(uiPatch));
      }
      eff_spec.urect = urect;
      urects_count++;
    }
    // console.log('pad_layout_update uiPatch', JSON.stringify(uiPatch));
  }
  ui_prop_set('patches', a_.ui.patches);
  ui_prop_set('urects_count', urects_count);
  // pads_resize_save();
}

function pads_resize_set_scale() {
  let refsz = str_to_width_height(a_.ui.canvas_resize_ref);
  let tosz = str_to_width_height(a_.ui.canvas_size);
  a_.ui.urects_scale = tosz.width / refsz.width;
  console.log('pads_resize_set_scale a_.ui.canvas_resize_ref', a_.ui.canvas_resize_ref);
  console.log('pads_resize_set_scale a_.ui.canvas_size', a_.ui.canvas_size);
  console.log('pads_resize_set_scale urects_scale', a_.ui.urects_scale);
}

function pads_resize_pad(urect) {
  for (let prop in urect) {
    urect[prop] = Math.floor(urect[prop] * a_.ui.urects_scale);
  }
}
