import { Track as _MidiTrack } from "@tonejs/midi";
import { Note as MidiNote } from "@tonejs/midi/dist/Note";
import { AdvOpt, arrayLookup } from "./common";

type MidiTrack = Partial<_MidiTrack>;

//641=513,643=514,386=258,259=258,131=130

export function processChannel(track: MidiTrack) {
  const _track = track;
  const melodies: MidiNote[][] = splitChords(flattenChordGroup(sortChords(groupChords(_track.notes!), 'desc')));
  const mmlSequences: string[] = [];
  for (const notes of melodies) {
    if (notes.length == 0) break;

    let ticks: number = (AdvOpt.current.startAtMeasure - 1) * 512;
    let currentOctave: number = 0;
    let mmlSequence: string = '';
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const noteLength = note.durationTicks;
      const noteTriggerTime = note.ticks;
      const octave = note.octave - 1;

      if (note.ticks < (AdvOpt.current.startAtMeasure - 1) * 512) {
        continue;
      }

      if (AdvOpt.current.endAtMeasure > 0 && (noteTriggerTime > 512 * AdvOpt.current.endAtMeasure)) break;

      if (checkRest(ticks, note)) {
        mmlSequence += addRest(noteTriggerTime - ticks);
        ticks += (noteTriggerTime - ticks);
      }

      while (octave != currentOctave) {
        if (octave > currentOctave) {
          mmlSequence += '>';
          currentOctave++;
        }
        else if (octave < currentOctave) {
          mmlSequence += '<';
          currentOctave--;
        }
      }

      mmlSequence += `${toneJSNoteToMmlNote(note.name)}${ticksToNoteLength(noteLength)}`;

      ticks += note.durationTicks;
    }

    mmlSequences.push(mmlSequence.trim());
  }

  return mmlSequences;
}

export function processRhythmChannel(track: MidiTrack) {
  let mmlSequence: string = '';

  const _track = addRestsToTrackNotes(track);
  const chords = Object.entries(groupChords(_track.notes!));
  for (const [, notes] of chords) {
    // const startAt = (AdvOpt.current.startAtMeasure - 1) * 512;
    // const endAt = (AdvOpt.current.endAtMeasure - 1) * 512;
    // if (notes[0].ticks < startAt)
    //   continue;
    // if (endAt != 0 && notes[0].ticks >= endAt)
    //   break;

    if (notes[0].name! == 'R') {
      mmlSequence += addRest(notes[0].durationTicks);
    }
    else {
      let rhythmDefinitionInt = 0;
      notes.forEach(note => rhythmDefinitionInt += parseRhythmDefinition(note)!);
      mmlSequence += `@${rhythmDefinitionInt}c${ticksToNoteLength(notes[0].durationTicks)}`;
    }
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
    if (ticks != note.ticks) {
      ticks = note.ticks;
      index = 0;
    }
    else {
      index += 1;
    }

    if (singleMelodySequences[index] == null)
      singleMelodySequences.push([]);

    singleMelodySequences[index].push(note);
  });

  return singleMelodySequences;
}

export function toneJSNoteToMmlNote(note: string) {
  // Turns B#4 to b+
  return note.toLowerCase().slice(0, note.length - 1).replace('#', '+');
}

export function addRestsToTrackNotes(track: MidiTrack) {
  let currentTicks: number = 0;
  let prevNote: MidiNote;
  let _track: MidiTrack = {
    ...track,
    notes: []
  }

  const _checkRest = (currentNote: MidiNote) => {
    if (currentTicks == 0) {
      return checkRest(currentTicks, currentNote);
    }
    return prevNote != null
      ? (currentNote.ticks - prevNote.ticks) > prevNote.duration
      : false;
  }

  for (const note of track.notes!) {
    const { ticks } = note;
    if (_checkRest(note)) {
      while (currentTicks < ticks) {
        const tickMod = currentTicks % 512 || 0;
        if (tickMod === 0) {
          const _note: Partial<MidiNote> = {
            ticks: currentTicks,
            durationTicks: 512,
            midi: 0,
            velocity: 0,
            name: 'R',
          };
          currentTicks += 512;
          //@ts-ignore
          _track.notes?.push(_note);
        }
        else {
          const _note: Partial<MidiNote> = {
            ticks: currentTicks,
            durationTicks: note.ticks - currentTicks,
            midi: 0,
            velocity: 0,
            name: 'R',
          };
          currentTicks += note.ticks - currentTicks;
          //@ts-ignore
          _track.notes?.push(_note);
          break;
        }
      }
    }
    _track.notes?.push(note);
    currentTicks = note.ticks + note.durationTicks;
    prevNote = note;
  }
  return _track;
}

export function flattenChordGroup(chordGroup: { [key: string]: MidiNote[] }) {
  return Object.values(chordGroup).flat(4);
}

/** Must group the chord first for the input */
export function sortChords(chords: { [key: string]: MidiNote[] }, ordering: 'asc' | 'desc' = 'asc') {
  const newGroup: { [key: string]: MidiNote[] } = {};
  for (const [ticks, notes] of Object.entries(chords)) {
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

export function cutTrackNotesToOffset(track: MidiTrack) {
  const _track: MidiTrack = {
    ...track,
    notes: track.notes!.filter((note) => {
      return note.ticks > AdvOpt.current.startAtMeasure;
    })
  }
  return _track;
}

export function mapRhythmDefFromOpt(seq: string) {
  if (seq == null || seq.length == 0)
    return seq;

  const defs: string[] = AdvOpt.current.rhythmPresets.replace(/\s/g, '').split(',');
  defs.forEach(v => {
    const [before, after] = v.split('=');
    seq = seq.replaceAll(before, after);
  });
  return seq;
}

function sortChordAsc(a: MidiNote, b: MidiNote) {
  return a.midi - b.midi
}

function sortChordDesc(a: MidiNote, b: MidiNote) {
  return b.midi - a.midi
}
