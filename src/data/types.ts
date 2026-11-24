export type FretNoteRole =
  | 'root'
  | 'chord'
  | 'scale'
  | 'characteristic'
  | 'passing'
  | 'approach'
  | 'avoid';

export interface FretNote {
  string: number; // 1 (high E) to 6 (low E)
  fret: number; // 0 = open, 1..22
  label?: string; // e.g., '1', '3', '5', 'b7', 'NP', 'G', etc.
  finger?: string; // optional finger hint (1,2,3,4)
  role: FretNoteRole;
  approachTo?: { string: number; fret: number }; // arrow from this note to target
}

export interface FretboardData {
  title: string;
  subtitle?: string;
  startFret: number; // 0 if showing nut
  numFrets: number;
  notes: FretNote[];
  barre?: { fret: number; fromString: number; toString: number };
  legend?: string;
  transposable?: boolean;
  defaultRootName?: string;
  playOrder?: Array<{ string: number; fret: number }>; // custom playback order if non-linear
}

export interface ChordDiagramData {
  name: string;
  subtitle?: string;
  startFret: number; // 1 = open position
  frets: Array<{
    string: number; // 1..6
    fret: number; // 0 = open, -1 = muted, >0 = fret number (absolute)
    finger?: string;
    role?: 'root' | 'chord';
    degree?: string;
  }>;
  barre?: { fret: number; fromString: number; toString: number };
}

export interface TabNoteItem {
  string: number; // 1..6
  fret: number;
  finger?: string;
  tech?: 'h' | 'p' | '/' | '\\' | 'b' | '~'; // hammer-on, pull-off, slide, bend, vibrato
}

export interface TabBeat {
  notes: TabNoteItem[];
  duration: number; // beats: 4=whole, 2=half, 1.5=dotted q, 1=quarter, 0.5=eighth, 0.33=triplet
  isRest?: boolean;
  pick?: 'down' | 'up';
  label?: string; // degree or note annotation below tab
  tie?: boolean;
}

export interface TabMeasure {
  chord?: string;
  roman?: string;
  beats: TabBeat[];
}

export interface TablatureData {
  exampleNum?: string; // e.g., "Ejemplo 3"
  title: string;
  subtitle?: string;
  bpm: number;
  timeSignature?: string; // "4/4", "12/8", "3/4"
  swing?: boolean;
  measures: TabMeasure[];
  footerNote?: string;
}

export interface ScaleGridCell {
  note: string;
  degree?: string;
  role?: 'root' | 'chord' | 'scale' | 'characteristic' | 'passing' | 'empty';
}

export interface ScaleGridData {
  title: string;
  subtitle?: string;
  cells: ScaleGridCell[];
  intervals?: Array<{ fromIndex: number; toIndex: number; label: string }>;
  startMidi?: number; // for audio playback
}

export interface ProgressionBar {
  chord: string;
  roman?: string;
  region?: 'T' | 'S' | 'D' | 'sec'; // Tónica, Subdominante, Dominante, Dominante secundario
  note?: string;
}

export interface ProgressionData {
  title: string;
  subtitle?: string;
  bpm: number;
  swing?: boolean;
  beatsPerBar?: number;
  barsPerRow?: number;
  bars: ProgressionBar[];
}

export interface CourseTableData {
  title?: string;
  caption?: string;
  headers: string[];
  rows: string[][];
  highlightCol?: number;
}

export interface VideoResource {
  number: string;
  title: string;
  url: string;
  topic: string;
}

export type ContentBlock =
  | { type: 'heading'; text: string; page?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; title?: string; items: string[] }
  | {
      type: 'callout';
      variant: 'memoriza' | 'concepto' | 'truco' | 'nota' | 'ejercicio';
      title: string;
      text: string;
    }
  | { type: 'fretboard'; data: FretboardData }
  | { type: 'fretboardGrid'; title?: string; subtitle?: string; items: FretboardData[] }
  | { type: 'chordSet'; title?: string; subtitle?: string; chords: ChordDiagramData[] }
  | { type: 'tablature'; data: TablatureData }
  | { type: 'scaleGrid'; data: ScaleGridData }
  | { type: 'progression'; data: ProgressionData }
  | { type: 'table'; data: CourseTableData }
  | { type: 'circleOfFifths' }
  | { type: 'forgettingCurve' }
  | { type: 'videoList'; videos: VideoResource[] };

export interface Lesson {
  id: string;
  moduleId: string;
  code: string; // e.g., "2.5"
  title: string;
  shortTitle: string;
  bookPages: string; // e.g., "pp. 40–51"
  summary: string;
  suggestedBpm?: number;
  blocks: ContentBlock[];
  practiceTips: string[];
  commonMistakes: string[];
}

export interface CourseModule {
  id: string;
  number: string; // "0", "1", "2", "3", "4"
  title: string;
  subtitle: string;
  bookPages: string;
  lessons: Lesson[];
}
