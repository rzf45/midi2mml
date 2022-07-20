import { Track as MidiTrack } from "@tonejs/midi";
import { Note as MidiNote } from "@tonejs/midi/dist/Note";
import { arrayLookup } from "./common";

export function processChannel(track: MidiTrack) {
  const melodies: MidiNote[][] = splitChords(flattenChordGroup(sortChords(groupChords(track.notes), 'desc')));
  const mmlSequences: string[] = [];
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
  
  return mmlSequences;
}

export function processChannel9(track: MidiTrack) {
  const chords = Object.entries(groupChords(track.notes));

  let ticks: number = 0;
  let mmlSequence: string = '';
  for(const [noteTriggerTime, notes] of chords) {
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
  
  return mmlSequence.trim();
}

export function checkRest(currentTicks: number, currentNote: MidiNote) {
  return currentNote.ticks > currentTicks;
}

export function addRest(length: number) {
  return `r${ticksToNoteLength(length)}`
}

export function parseRhythmDefinition(note: MidiNote) {
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
      ['D#3', 1024]
    ],
    0
  );
}

export function ticksToNoteLength(ticks: number) {
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

function splitChords(notes: MidiNote[]) {
  const singleMelodySequences: MidiNote[][] = [];
  
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

    if(singleMelodySequences[index] == null)
      singleMelodySequences.push([]);

    singleMelodySequences[index].push(note);
  });

  return singleMelodySequences;
}

export function toneJSNoteToMmlNote(note: string) {
  // Turns B#4 to b+
  return note.toLowerCase().slice(0, note.length - 1).replace('#', '+');
}

export function flattenChordGroup(chordGroup: { [key: string]: MidiNote[] }) {
  return Object.values(chordGroup).flat(4);
}

/** Must group the chord first for the input */
export function sortChords(chords: { [key: string]: MidiNote[] }, ordering: 'asc' | 'desc' = 'asc') {
  const newGroup: { [key: string]: MidiNote[] } = {};
  for(const [ticks, notes] of Object.entries(chords)) {
    const sorted = notes.sort((ordering == 'desc' ? sortChordDesc : sortChordAsc));
    newGroup[ticks.toString()] = sorted;
  }
  return newGroup;
}

export function groupChords(notes: MidiNote[]) {
  const result: { [key: string]: MidiNote[] } = {};
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

function sortChordAsc(a: MidiNote, b: MidiNote) {
  return a.midi - b.midi
}

function sortChordDesc(a: MidiNote, b: MidiNote) {
  return b.midi - a.midi
}
