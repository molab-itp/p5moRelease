import { a_ } from '../let/a_state.js?v=413';
import { ui_div_empty } from '../core-ui/ui_tools.js?v=413';
import { ui_prop_set } from '../core-ui/ui_prop.js?v=413';
import { liveMedia_attach, liveMedia_detach } from '../core/liveMedia_attach.js?v=413';

export function ui_live_selection() {
  //
  // if (a_.hide_ui_option) return;

  let div = ui_div_empty('live_selection');

  let chk = createCheckbox('Live ', a_.ui.live_chk);
  div.child(chk);
  chk.style('display:inline');
  chk.changed(function () {
    let a_live = this.checked();
    ui_prop_set('live_chk', a_live ? 1 : 0);
    select('#ichat_blk').style(a_.ui.live_chk ? 'display:inline' : 'display:none');
    livem_restore();
  });

  div.child(createSpan('Device: '));
  let aSel = createSelect();
  div.child(aSel);
  // aSel.option('Canvas', 0);
  for (let index = 0; index < a_.mediaDivs.length; index++) {
    let ent = a_.mediaDivs[index];
    // aSel.option(ent.label, index + 1);
    aSel.option(ent.label, index);
  }
  aSel.selected(a_.ui.live_index);
  aSel.changed(function () {
    let index = parseFloat(this.value());
    console.log('ui_live_selection index', index);
    ui_prop_set('live_index', index);
    let ent = media_for_livem_index(index);
    if (a_.ui.live_chk) liveMedia_attach(ent);
    else liveMedia_detach(ent);
  });
  {
    let elm = createSpan('Room: ');
    div.child(elm);
    elm = createInput(a_.ui.room_name).input(function () {
      ui_prop_set('room_name', this.value());
    });
    div.child(elm);
  }
  {
    let chk = createCheckbox('Data ', a_.ui.canvas_data_chk);
    div.child(chk);
    chk.style('display:inline');
    chk.changed(function () {
      let state = this.checked();
      ui_prop_set('canvas_data_chk', state ? 1 : 0);
    });
  }
}

function media_for_livem_index(index) {
  return a_.mediaDivs[index];
}

export function livem_restore() {
  if (!a_.livem && a_.ui.live_chk) {
    console.log('livem_restore a_.ui.live_index', a_.ui.live_index);
    let mediaDiv = media_for_livem_index(a_.ui.live_index);
    console.log('livem_restore mediaDiv', mediaDiv);
    if (mediaDiv) liveMedia_attach(mediaDiv);
  }
}
