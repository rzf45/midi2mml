import { Midi } from '@tonejs/midi';
import { processChannel, processChannel9 } from './utils/mml';
import './style.css'

const inputMidi = document.querySelector<HTMLInputElement>('#inputMidi')!;
const btnConvert = document.querySelector<HTMLButtonElement>('#btnConvert')!;
const mmlTracks = document.querySelector<HTMLTableElement>('#tracks')!;

window.onload = () => {
  btnConvert.addEventListener('click', onConvert);
}

function onConvert() {
  const midiFile = inputMidi.files![0];
  const midiFileUrl = URL.createObjectURL(midiFile);

  const tbody = mmlTracks.querySelector('tbody')!;
  tbody.textContent = '';

  Midi.fromUrl(midiFileUrl)
    .then(midi => {
      for (const track of midi.tracks) {
        const row = tbody.insertRow();
        const [chIndex, chName, mmlContent] = [row.insertCell(), row.insertCell(), row.insertCell()];

        chIndex.appendChild(document.createTextNode(track.channel.toString()));
        chName.appendChild(document.createTextNode(track.name));

        if (track.channel == 9) {
          const mml = processChannel9(track);
          const mmlTextEl = document.createElement('div');
          mmlTextEl.textContent = mml;
          mmlContent.appendChild(mmlTextEl);
        }
        else {
          const mmls = processChannel(track);
          mmls.forEach(mml => {
            const mmlTextEl = document.createElement('div');
            mmlTextEl.textContent = mml;
            mmlContent.appendChild(mmlTextEl);
          });
        }
      }
    });
}
