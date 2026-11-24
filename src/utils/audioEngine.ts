/**
 * Web Audio API engine for plucked guitar synthesis, chord strumming,
 * tablature/arpeggio sequence playback, and precision lookahead metronome.
 */

// Standard guitar tuning (string 1 = high E4, string 6 = low E2)
export const STRING_OPEN_MIDI: Record<number, number> = {
  1: 64, // E4
  2: 59, // B3
  3: 55, // G3
  4: 50, // D3
  5: 45, // A2
  6: 40, // E2
};

export const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function stringFretToMidi(stringNum: number, fret: number): number {
  const open = STRING_OPEN_MIDI[stringNum] ?? 40;
  return open + fret;
}

export function midiToNoteName(midi: number, preferFlats = false): string {
  const names = preferFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  const idx = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[idx]}${octave}`;
}

export function noteNameToMidi(note: string, defaultOctave = 3): number {
  const match = note.trim().match(/^([A-Ga-g])([#b♯♭]?)(-?\d+)?$/);
  if (!match) return 48;
  const letter = match[1].toUpperCase();
  const accidental = match[2];
  const octave = match[3] !== undefined ? parseInt(match[3], 10) : defaultOctave;
  const baseMap: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let semitone = baseMap[letter] ?? 0;
  if (accidental === '#' || accidental === '♯') semitone += 1;
  if (accidental === 'b' || accidental === '♭') semitone -= 1;
  return (octave + 1) * 12 + semitone;
}

let sharedCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * Plays a warm clean electric/acoustic guitar note using layered harmonics
 * and a dynamic low-pass filter envelope.
 */
export function playGuitarMidi(
  midi: number,
  durationSec = 1.1,
  startTimeOffset = 0,
  velocity = 0.55
): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime + startTimeOffset;
  const freq = midiToFreq(midi);

  // Master gain for this note
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(velocity * 0.34, now + 0.008);
  master.gain.exponentialRampToValueAtTime(velocity * 0.14, now + 0.18);
  master.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

  // Warm body filter
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(freq * 7.5, 4800), now);
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2.1, 520), now + Math.min(durationSec * 0.7, 0.9));
  filter.Q.setValueAtTime(1.1, now);

  // Oscillator 1: fundamental triangle (warmth)
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, now);

  // Oscillator 2: slightly detuned sawtooth (string bite/harmonics)
  const osc2 = ctx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(freq, now);
  osc2.detune.setValueAtTime(2.5, now);

  const osc2Gain = ctx.createGain();
  osc2Gain.gain.setValueAtTime(0.28, now);
  osc2Gain.gain.exponentialRampToValueAtTime(0.06, now + 0.25);

  // Subtle pick transient click
  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(freq * 2, now);
  const osc3Gain = ctx.createGain();
  osc3Gain.gain.setValueAtTime(0.14, now);
  osc3Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc1.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);
  osc3.connect(osc3Gain);
  osc3Gain.connect(filter);

  filter.connect(master);
  master.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  const stopAt = now + durationSec + 0.05;
  osc1.stop(stopAt);
  osc2.stop(stopAt);
  osc3.stop(stopAt);
}

export function playGuitarNote(
  stringNum: number,
  fret: number,
  durationSec = 1.0,
  startTimeOffset = 0,
  velocity = 0.55
): void {
  const midi = stringFretToMidi(stringNum, fret);
  playGuitarMidi(midi, durationSec, startTimeOffset, velocity);
}

/**
 * Strums a chord defined by an array of [stringNum, fret] or MIDI notes.
 */
export function playChordFrets(
  notes: Array<{ string: number; fret: number }>,
  direction: 'down' | 'up' = 'down',
  durationSec = 1.8,
  startTimeOffset = 0
): void {
  // Downstrum goes from string 6 (low) to string 1 (high)
  const sorted = [...notes].sort((a, b) =>
    direction === 'down' ? b.string - a.string : a.string - b.string
  );
  sorted.forEach((n, idx) => {
    playGuitarNote(n.string, n.fret, durationSec, startTimeOffset + idx * 0.024, 0.44);
  });
}

/**
 * Plays a chord by its common jazz/guitar symbol (e.g. "G7", "Cm7", "Dm7b5", "Cmaj7", "Db7", "Gdim7").
 */
export function playChordSymbol(symbol: string, durationSec = 1.6, startTimeOffset = 0): void {
  const clean = symbol.trim();
  const match = clean.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return;
  const rootStr = match[1];
  const quality = match[2].toLowerCase();

  let rootMidi = noteNameToMidi(rootStr, 3);
  // Keep voicings in comfortable guitar register (E2=40 to G3=55)
  if (rootMidi > 55) rootMidi -= 12;
  if (rootMidi < 40) rootMidi += 12;

  let intervals = [0, 4, 7]; // major triad default
  if (quality.includes('m7b5') || quality.includes('ø') || quality.includes('mb5')) {
    intervals = [0, 3, 6, 10];
  } else if (quality.includes('dim') || quality.includes('°') || quality.includes('º')) {
    intervals = [0, 3, 6, 9];
  } else if (quality.includes('mmaj7')) {
    intervals = [0, 3, 7, 11];
  } else if (quality.includes('maj7#5') || quality.includes('Δ#5')) {
    intervals = [0, 4, 8, 11];
  } else if (quality.includes('maj7#11') || quality.includes('maj9#11')) {
    intervals = [0, 4, 7, 11, 14, 18];
  } else if (quality.includes('maj9')) {
    intervals = [0, 4, 7, 11, 14];
  } else if (quality.includes('maj7') || quality.includes('Δ')) {
    intervals = [0, 4, 7, 11];
  } else if (quality.includes('m9')) {
    intervals = [0, 3, 7, 10, 14];
  } else if (quality.includes('m7') || quality === '-7' || quality.startsWith('min7')) {
    intervals = [0, 3, 7, 10];
  } else if (quality.startsWith('m') && !quality.startsWith('maj')) {
    intervals = [0, 3, 7];
  } else if (quality.includes('7alt') || quality.includes('7b9b13')) {
    intervals = [0, 4, 10, 13, 20];
  } else if (quality.includes('7#11') || quality.includes('9#11')) {
    intervals = [0, 4, 7, 10, 14, 18];
  } else if (quality.includes('7b9')) {
    intervals = [0, 4, 7, 10, 13];
  } else if (quality.includes('9')) {
    intervals = [0, 4, 7, 10, 14];
  } else if (quality.includes('13')) {
    intervals = [0, 4, 10, 14, 21];
  } else if (quality.includes('7')) {
    intervals = [0, 4, 7, 10];
  } else if (quality.includes('aug') || quality.includes('+')) {
    intervals = [0, 4, 8];
  }

  // Spread guitar-like voicing
  const voicing = intervals.map((iv, i) => {
    if (i === 0) return rootMidi;
    return rootMidi + iv + (iv < 7 && intervals.length >= 4 ? 12 : 0);
  }).sort((a, b) => a - b);

  voicing.forEach((m, idx) => {
    playGuitarMidi(m, durationSec, startTimeOffset + idx * 0.022, 0.36);
  });
}

export interface SequenceStep {
  notes: Array<{ string: number; fret: number }>;
  durationBeats: number; // e.g., 1 = quarter, 0.5 = eighth, 2 = half
  isRest?: boolean;
  chordSymbol?: string;
}

export class SequencePlayer {
  private timerId: number | null = null;
  private isPlaying = false;

  stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  play(
    steps: SequenceStep[],
    bpm: number,
    options: {
      swing?: boolean;
      loop?: boolean;
      onStep?: (stepIndex: number) => void;
      onEnd?: () => void;
    } = {}
  ): void {
    this.stop();
    if (!steps.length) return;
    this.isPlaying = true;

    const { swing = false, loop = false, onStep, onEnd } = options;
    let index = 0;
    let beatCursor = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const step = steps[index];
      onStep?.(index);

      const secPerBeat = 60 / Math.max(30, Math.min(260, bpm));
      let durBeats = step.durationBeats;

      // Apply authentic 2:1 triplet swing feel to consecutive eighth notes
      if (swing && Math.abs(durBeats - 0.5) < 0.05) {
        const frac = beatCursor % 1;
        if (frac < 0.1) {
          durBeats = 0.66;
        } else {
          durBeats = 0.34;
        }
      }

      const durSec = durBeats * secPerBeat;

      if (!step.isRest) {
        if (step.notes.length > 1) {
          playChordFrets(step.notes, 'down', Math.max(durSec * 1.15, 0.45));
        } else if (step.notes.length === 1) {
          playGuitarNote(step.notes[0].string, step.notes[0].fret, Math.max(durSec * 1.2, 0.38));
        } else if (step.chordSymbol) {
          playChordSymbol(step.chordSymbol, Math.max(durSec * 1.05, 0.6));
        }
      }

      beatCursor += step.durationBeats;
      index += 1;

      if (index >= steps.length) {
        if (loop) {
          index = 0;
          beatCursor = 0;
          this.timerId = window.setTimeout(tick, durSec * 1000);
        } else {
          this.timerId = window.setTimeout(() => {
            this.isPlaying = false;
            onStep?.(-1);
            onEnd?.();
          }, durSec * 1000);
        }
      } else {
        this.timerId = window.setTimeout(tick, durSec * 1000);
      }
    };

    tick();
  }
}

export type TimeSignature = '4/4' | '3/4' | '2/4' | '6/8' | '12/8';

export class MetronomeEngine {
  private timerId: number | null = null;
  private isRunning = false;
  private currentBeat = 0;
  private nextNoteTime = 0;
  private bpm = 80;
  private timeSignature: TimeSignature = '4/4';
  private beatsTwoFourOnly = false;
  private onBeatCallback: ((beat: number, totalBeats: number, isMuted: boolean) => void) | null = null;

  getTotalBeats(sig: TimeSignature): number {
    switch (sig) {
      case '2/4':
        return 2;
      case '3/4':
        return 3;
      case '4/4':
        return 4;
      case '6/8':
        return 6;
      case '12/8':
        return 12;
    }
  }

  configure(params: {
    bpm?: number;
    timeSignature?: TimeSignature;
    beatsTwoFourOnly?: boolean;
    onBeat?: (beat: number, totalBeats: number, isMuted: boolean) => void;
  }): void {
    if (params.bpm !== undefined) this.bpm = Math.max(40, Math.min(240, params.bpm));
    if (params.timeSignature !== undefined) {
      this.timeSignature = params.timeSignature;
      this.currentBeat = 0;
    }
    if (params.beatsTwoFourOnly !== undefined) this.beatsTwoFourOnly = params.beatsTwoFourOnly;
    if (params.onBeat !== undefined) this.onBeatCallback = params.onBeat;
  }

  private scheduleClick(time: number, beatIdx: number, totalBeats: number): void {
    const ctx = getAudioContext();

    const isTwoFourMode = this.beatsTwoFourOnly && this.timeSignature === '4/4';
    // In "2 y 4" jazz mode, beatIdx 0 (beat 1) and beatIdx 2 (beat 3) are silent;
    // beatIdx 1 (beat 2) and beatIdx 3 (beat 4) get crisp hi-hat / woodblock click!
    const isMuted = isTwoFourMode && (beatIdx === 0 || beatIdx === 2);

    if (!isMuted) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = 880;
      let peak = 0.28;

      if (isTwoFourMode) {
        freq = 1280; // Crisp hi-hat/rim accent on 2 & 4
        peak = 0.34;
      } else if (beatIdx === 0) {
        freq = 1320; // Downbeat accent
        peak = 0.38;
      } else if (
        (this.timeSignature === '6/8' && beatIdx === 3) ||
        (this.timeSignature === '12/8' && (beatIdx === 3 || beatIdx === 6 || beatIdx === 9))
      ) {
        freq = 1040; // Secondary compound accent
        peak = 0.28;
      }

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.55, time + 0.032);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.042);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    }

    const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
    window.setTimeout(() => {
      if (this.isRunning) {
        this.onBeatCallback?.(beatIdx, totalBeats, isMuted);
      }
    }, delayMs);
  }

  private scheduler = (): void => {
    if (!this.isRunning) return;
    const ctx = getAudioContext();
    const totalBeats = this.getTotalBeats(this.timeSignature);
    // For compound meters (6/8, 12/8), BPM represents eighth-note pulse subdivision or dotted-quarter*3
    const beatMultiplier = this.timeSignature === '6/8' || this.timeSignature === '12/8' ? 0.5 : 1;

    while (this.nextNoteTime < ctx.currentTime + 0.1) {
      this.scheduleClick(this.nextNoteTime, this.currentBeat, totalBeats);
      const secondsPerBeat = (60.0 / this.bpm) * beatMultiplier;
      this.nextNoteTime += secondsPerBeat;
      this.currentBeat = (this.currentBeat + 1) % totalBeats;
    }

    this.timerId = window.setTimeout(this.scheduler, 25);
  };

  start(): void {
    if (this.isRunning) return;
    const ctx = getAudioContext();
    this.isRunning = true;
    this.currentBeat = 0;
    this.nextNoteTime = ctx.currentTime + 0.04;
    this.scheduler();
  }

  stop(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
