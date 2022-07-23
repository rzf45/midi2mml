import { Midi } from '@tonejs/midi';
import { mapRhythmDefFromOpt, processChannel, processRhythmChannel } from './utils/mml';
import './style.css'
import { AdvOpt, advOptActive } from './utils/common';

const inputMidi = document.querySelector<HTMLInputElement>('#inputMidi')!;
const btnConvert = document.querySelector<HTMLButtonElement>('#btnConvert')!;
const advOptToggle = document.querySelector<HTMLButtonElement>('#advOptToggle')!;
const mmlTracks = document.querySelector<HTMLTableElement>('#tracks')!;
const saveOptBtn = document.querySelector<HTMLButtonElement>('#saveOptBtn')!;
const loadOptBtn = document.querySelector<HTMLButtonElement>('#loadOptBtn')!;
const resetOptBtn = document.querySelector<HTMLButtonElement>('#resetOptBtn')!;
const wrapper = document.querySelector<HTMLDivElement>('#advOptWrapper')!;
const startAtMeasure = document.querySelector<HTMLInputElement>('#startAtMeasure')!;
const endAtMeasure = document.querySelector<HTMLInputElement>('#endAtMeasure')!;
const midiOffset = document.querySelector<HTMLInputElement>('#midiOffset')!;
const rhythmPresets = document.querySelector<HTMLInputElement>('#rhythmPresets')!;
const processAsRhythm = document.querySelector<HTMLInputElement>('#processAsRhythm')!;
const tbody = mmlTracks.querySelector('tbody')!;

const _advancedOption = {
  startAtMeasure: 0,
  endAtMeasure: 0,
  midiOffset: 0,
  rhythmPresets: '',
  processAsRhythm: '9',
};

let _debounceSaveLast: number | null = null;
let applyAdvancedOpt = false;

window.onload = () => {
  
  btnConvert.addEventListener('click', onConvert);
  advOptToggle.onclick = (ev) => {
    ev.preventDefault();
    applyAdvancedOpt = !applyAdvancedOpt;

    if(applyAdvancedOpt)
      wrapper.classList.remove('hidden');
    else
      wrapper.classList.add('hidden');

    localStorage.setItem('midi2mml::advOpt.enabled', JSON.stringify(applyAdvancedOpt));
  }
  saveOptBtn.onclick = () => {
    const saves = Object.entries(localStorage).filter(([key]) => key.includes('midi2mml::saves'));
    const name = prompt(`Save as:`, saves.length.toString());

    if (name) {
      AdvOpt.save(name);
      alert(`Saved as "${name}"`);
    }
  }
  loadOptBtn.onclick = () => {
    let message = 'Available Saves:';
    message += `\n${AdvOpt.getSaveNames()}`;
    message += '\n\nEnter save name to load:';
    const saveName = prompt(message);
    if (saveName) {
      AdvOpt.loadFromSave(saveName);
      AdvOpt.saveCurrent();
      applyOptInput();
    }
  }
  resetOptBtn.onclick = () => {
    AdvOpt.current = _advancedOption;
    applyOptInput();
  }
  initOpt();
  applyOptInput();
  startAtMeasure.onchange = () => updateOpt();
  endAtMeasure.onchange = () => updateOpt();
  midiOffset.onchange = () => updateOpt();
  rhythmPresets.onchange = () => updateOpt();
  processAsRhythm.onchange = () => updateOpt();

  if(advOptActive()) {
    wrapper.classList.remove('hidden');
    applyAdvancedOpt = true;
  }
}

function onConvert() {
  const midiFile = inputMidi.files![0];
  if(midiFile) {
    const midiFileUrl = URL.createObjectURL(midiFile);
    Midi.fromUrl(midiFileUrl)
    .then(midi => {
      tbody.textContent = '';
      CreateNoMeasureSplitProcess(midi);
    });
  }
  else {
    alert('Select the file first.');
  }
}

function CreateNoMeasureSplitProcess(midi: Midi) {
  const rhythmChannels = AdvOpt.current.processAsRhythm.split(',');
  for (let i = 0; i < midi.tracks.length; i++) {
    const track = midi.tracks[i];
    const row = tbody.insertRow();
    const [trackIndex, chIndex, chName, mmlContent] = [row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell()];

    trackIndex.appendChild(document.createTextNode(i.toString()));
    chIndex.appendChild(document.createTextNode(track.channel.toString()));
    chName.appendChild(document.createTextNode(track.name));

    if (rhythmChannels.includes(track.channel)) {
      const mml = processRhythmChannel(track);
      const mmlTextEl = document.createElement('div');
      mmlTextEl.textContent = AdvOpt.current.rhythmPresets ? mapRhythmDefFromOpt(mml) : mml;
      mmlContent.appendChild(mmlTextEl);
    }
    else {
      const forceOpt = AdvOpt.current.processAsRhythm.split(',').map((s: string) => s.trim());
      const mmls = forceOpt.includes(track.channel.toString())
        ? [processRhythmChannel(track)]
        : processChannel(track);
      mmls.forEach(mml => {
        const mmlTextEl = document.createElement('div');
        mmlTextEl.textContent = AdvOpt.current.rhythmPresets ? mapRhythmDefFromOpt(mml) : mml;
        mmlContent.appendChild(mmlTextEl);
      });
    }
  }
}

function initOpt() {
  AdvOpt.current = { ..._advancedOption };
  AdvOpt.loadLastSave();
}

function updateOpt() {
  AdvOpt.current = {
    startAtMeasure: parseInt(startAtMeasure.value),
    endAtMeasure: parseInt(endAtMeasure.value),
    midiOffset: parseInt(midiOffset.value),
    rhythmPresets: rhythmPresets.value,
    processAsRhythm: processAsRhythm.value
  }

  if(_debounceSaveLast != null) {
    clearTimeout(_debounceSaveLast);
  }
  setTimeout(() => {
    AdvOpt.saveCurrent();
  }, 1000);
}

function applyOptInput() {
  startAtMeasure.value = AdvOpt.current?.startAtMeasure?.toString() || _advancedOption.startAtMeasure;
  endAtMeasure.value = AdvOpt.current?.endAtMeasure?.toString() || _advancedOption.endAtMeasure;
  midiOffset.value = AdvOpt.current?.midiOffset?.toString() || _advancedOption.midiOffset;
  rhythmPresets.value = AdvOpt.current?.rhythmPresets || _advancedOption.rhythmPresets;
  processAsRhythm.value = AdvOpt.current?.processAsRhythm || _advancedOption.processAsRhythm;
}
