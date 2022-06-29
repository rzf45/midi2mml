import { Midi, Track as MidiTrack } from '@tonejs/midi';
import './style.css';

const inputMidi = document.querySelector<HTMLInputElement>('#inputMidi')!;
const btnConvert = document.querySelector<HTMLButtonElement>('#btnConvert')!;
const mmlTracks = document.querySelector<HTMLTableElement>('#tracks')!;

window.onload = () => {
  btnConvert.addEventListener('click', onConvert);
}

function onConvert() {
  const midiFile = inputMidi.files![0];
  const midiFileUrl = URL.createObjectURL(midiFile);

  Midi.fromUrl(midiFileUrl)
    .then(midi => {

      // jsonContent.textContent = JSON.stringify(midi.toJSON(), null, 2);

      for (const track of midi.tracks) {
        createTrackElement(track);
      }
    });
}

function createTrackElement(track: MidiTrack) {
  const tbody = mmlTracks.querySelector('tbody')!;
  const row = tbody.insertRow();
  const [chIndex, chName, mmlContent] = [row.insertCell(), row.insertCell(), row.insertCell()];

  const mmlSequences: string[] = [];

  if(track.channel == 9) {
    const grouppedNotes = Object.entries(groupChords(track.notes));

    let ticks: number = 0;
    let mmlSequence: string = '';
    for(const [noteTriggerTime, notes] of grouppedNotes) {
      let rhythmDefinitionInt = 0;
      if (checkRest(ticks, notes[0])) {
        mmlSequence += addRest(parseInt(noteTriggerTime) - ticks);
        ticks += (parseInt(noteTriggerTime) - ticks);
      }
      notes.forEach(note => {
        rhythmDefinitionInt += parseRhythmDefinition(note)!;
      });
      mmlSequence += `@${rhythmDefinitionInt}c${ticksToNoteLength(notes[0].durationTicks)}`;
      ticks += notes[0].durationTicks;
    }
    mmlSequences.push(mmlSequence.trim());
  }
  else {
    const trackNotes = reorderNotes(track.notes);
    const melodies = splitChords(trackNotes);
    for(const notes of melodies) {
      if(notes.length == 0) break;
      
      let ticks: number = 0;
      let currentOctave: number = 0;
      let mmlSequence: string = '';
      notes.forEach(note => {
        const noteLength = note.durationTicks;
        const noteTriggerTime = note.ticks;
        const octave = note.octave - 1;

        if (checkRest(ticks, note)) {
          mmlSequence += addRest(noteTriggerTime - ticks);
          ticks += (noteTriggerTime - ticks);
        }

        while (octave != currentOctave) {
          if(octave > currentOctave) {
            mmlSequence += '>';
            currentOctave++;
          }
          else if(octave < currentOctave) {
            mmlSequence += '<';
            currentOctave--;
          }
        }

        mmlSequence += `${toneJSNoteToMmlNote(note.name)}${ticksToNoteLength(noteLength)}`;
        
        ticks += note.durationTicks;
      });

      mmlSequences.push(mmlSequence.trim());
    }
  }

  chIndex.appendChild(document.createTextNode(track.channel.toString()));
  chName.appendChild(document.createTextNode(track.name));
  mmlSequences.forEach(seq => {
    const div = document.createElement('div');
    div.classList.add('mb-4');
    div.classList.add('single-melodies')
    div.textContent = seq;
    
    mmlContent.appendChild(div);
  });
}

function checkRest(currentTicks: number, currentNote: any) {
  return currentNote.ticks > currentTicks;
}

function addRest(length: number) {
  return `r${ticksToNoteLength(length)}`
}

function parseRhythmDefinition(note: any) {
  return arrayLookup(
    note.name,
    [
      ['C2', 1],
      ['E2', 2],
      ['F2', 4],
      ['A2', 8],
      ['C3', 16],
      ['XX', 32],
      ['D2', 64],
      ['F#2', 128],
      ['A#2', 256],
      ['C#3', 512],
      ['D#2', 1024]
    ],
    0
  );
}

function ticksToNoteLength(ticks: number) {
  let current = ticks, noteLength = '';
  while (current > 0) {
    // There's gotta be a way cleaner code than this
    if (current >= 512) {
      current = current - 512;
      noteLength += '1&';
    }
    else if (current >= 256) {
      current = current - 256;
      noteLength += '2&';
    }
    else if (current >= 128) {
      current = current - 128;
      noteLength += '4&';
    }
    else if (current >= 64) {
      current = current - 64;
      noteLength += '8&';
    }
    else if (current >= 32) {
      current = current - 32;
      noteLength += '16&';
    }
    else if (current >= 16) {
      current = current - 16;
      noteLength += '32&';
    }
    else {
      noteLength = noteLength.slice(0, noteLength.length - 1);
      noteLength += `%${Math.floor(current / 2)}&`;
      current = 0;
    }
  }
  return noteLength.slice(0, noteLength.length - 1);
}

function toneJSNoteToMmlNote(note: string) {
  // Turns B#4, B3 to b+
  return note.toLowerCase().slice(0, note.length - 1).replace('#', '+');
}

function groupChords(notes: any[]) {
  const result: { [key: string]: any[] } = {};
  let ticks = 0;

  notes.forEach(note => {
    ticks = note.ticks;
    if (result[ticks.toString()] == null) {
      result[ticks.toString()] = [];
    }
    result[ticks.toString()].push(note);
  });

  return result;
}

function splitChords(notes: any[]) {
  const singleMelodySequences: any[][] = [[], [], []];
  
  let ticks = -1;
  let index = 0;

  notes.forEach(note => {
    if(ticks != note.ticks) {
      ticks = note.ticks;
      index = 0;
    }
    else {
      index += 1;
    }

    singleMelodySequences[index].push(note);
  });

  return singleMelodySequences;
}

function reorderNotes(notes: any[]) {
  // to make sure the lowest note is at array 0 when splitting chords
  const group = groupChords(notes);
  const newGroup: any = {};
  for(const [ticks, notes] of Object.entries(group)) {
    const sorted = notes.sort((a, b) => a.midi - b.midi);
    newGroup[ticks.toString()] = sorted;
  }
  return Object.values(newGroup).flat(4);
}

function arrayLookup<T, U>(value: T, lookupArray: [T, U][], defaultValue: U | null): U | null {
  let result = defaultValue;
  for (let i = 0; i < lookupArray.length; i++) {
    if (value === lookupArray[i][0]) {
      result = lookupArray[i][1];
      break;
    }
  }
  return result;
}
