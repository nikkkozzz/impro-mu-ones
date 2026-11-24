import React from 'react';
import {
  Lightbulb,
  AlertTriangle,
  BookmarkCheck,
  Sparkles,
  Info,
  Target,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import { ContentBlock, Lesson } from '../data/types';
import { FretboardSVG } from './FretboardSVG';
import { ChordDiagramSVG } from './ChordDiagramSVG';
import { TablatureSVG } from './TablatureSVG';
import { ScaleGridDiagram } from './ScaleGridDiagram';
import { ProgressionPlayer } from './ProgressionPlayer';
import { CircleOfFifthsSVG } from './CircleOfFifthsSVG';
import { ForgettingCurveSVG } from './ForgettingCurveSVG';

interface LessonRendererProps {
  lesson: Lesson;
}

const CALLOUT_CONFIG = {
  memoriza: {
    icon: BookmarkCheck,
    container: 'border-amber-500/40 bg-amber-500/10',
    title: 'text-amber-700 dark:text-amber-300',
  },
  concepto: {
    icon: Info,
    container: 'border-sky-500/40 bg-sky-500/10',
    title: 'text-sky-700 dark:text-sky-300',
  },
  truco: {
    icon: Sparkles,
    container: 'border-emerald-500/40 bg-emerald-500/10',
    title: 'text-emerald-700 dark:text-emerald-300',
  },
  nota: {
    icon: Info,
    container: 'border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900',
    title: 'text-slate-800 dark:text-slate-200',
  },
  ejercicio: {
    icon: Target,
    container: 'border-violet-500/40 bg-violet-500/10',
    title: 'text-violet-700 dark:text-violet-300',
  },
};

function renderBlock(block: ContentBlock, idx: number): React.ReactNode {
  switch (block.type) {
    case 'heading':
      return (
        <div
          key={idx}
          className="flex flex-wrap items-baseline justify-between gap-2 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800/80"
        >
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-50 tracking-tight">
            {block.text}
          </h3>
          {block.page && (
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
              Libro {block.page}
            </span>
          )}
        </div>
      );

    case 'paragraph':
      return (
        <p
          key={idx}
          className="text-[15.5px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-300"
        >
          {block.text}
        </p>
      );

    case 'bullets':
      return (
        <div key={idx} className="space-y-2 my-3">
          {block.title && (
            <h4 className="font-display font-semibold text-base text-slate-900 dark:text-slate-100">
              {block.title}
            </h4>
          )}
          <ul className="space-y-2 pl-5 list-disc marker:text-amber-500 text-[15px] sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'callout': {
      const cfg = CALLOUT_CONFIG[block.variant];
      const Icon = cfg.icon;
      return (
        <div key={idx} className={`rounded-xl border p-4 sm:p-5 my-4 ${cfg.container}`}>
          <div className={`flex items-center gap-2 font-display font-bold text-sm sm:text-base mb-1.5 ${cfg.title}`}>
            <Icon className="w-4.5 h-4.5 shrink-0" />
            <span>{block.title}</span>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
            {block.text}
          </p>
        </div>
      );
    }

    case 'fretboard':
      return <FretboardSVG key={idx} data={block.data} />;

    case 'fretboardGrid':
      return (
        <div key={idx} className="my-5 space-y-3">
          {block.title && (
            <div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                {block.title}
              </h4>
              {block.subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{block.subtitle}</p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {block.items.map((item, i) => (
              <FretboardSVG key={i} data={item} compact />
            ))}
          </div>
        </div>
      );

    case 'chordSet':
      return (
        <div key={idx} className="my-5 space-y-3">
          {block.title && (
            <div>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                {block.title}
              </h4>
              {block.subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{block.subtitle}</p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {block.chords.map((chord, i) => (
              <ChordDiagramSVG key={i} chord={chord} />
            ))}
          </div>
        </div>
      );

    case 'tablature':
      return <TablatureSVG key={idx} data={block.data} />;

    case 'scaleGrid':
      return <ScaleGridDiagram key={idx} data={block.data} />;

    case 'progression':
      return <ProgressionPlayer key={idx} data={block.data} />;

    case 'table':
      return (
        <div
          key={idx}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden my-5"
        >
          {block.data.title && (
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {block.data.title}
              </h4>
              {block.data.caption && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {block.data.caption}
                </p>
              )}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                  {block.data.headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-3.5 py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                {block.data.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3.5 py-2.5 ${
                          cIdx === 0 || cIdx === block.data.highlightCol
                            ? 'font-mono font-semibold text-amber-700 dark:text-amber-300'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'circleOfFifths':
      return <CircleOfFifthsSVG key={idx} />;

    case 'forgettingCurve':
      return <ForgettingCurveSVG key={idx} />;

    case 'videoList':
      return (
        <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {block.videos.map((v) => (
            <a
              key={v.number}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-amber-500/70 transition-colors"
            >
              <PlayCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    Vídeo {v.number}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                </div>
                <div className="font-display font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                  {v.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v.topic}</div>
              </div>
            </a>
          ))}
        </div>
      );
  }
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({ lesson }) => {
  return (
    <article className="space-y-4">
      {/* Main Content Blocks */}
      {lesson.blocks.map((block, idx) => renderBlock(block, idx))}

      {/* Mandatory Didactic Sections: Consejos de práctica & Errores comunes a evitar */}
      <section
        aria-label="Guía de práctica de la lección"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-8 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2 font-display font-bold text-base text-emerald-700 dark:text-emerald-400 mb-3">
            <Lightbulb className="w-5 h-5 shrink-0" />
            <span>Consejos de práctica</span>
          </div>
          <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.practiceTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  →
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-center gap-2 font-display font-bold text-base text-red-700 dark:text-red-400 mb-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Errores comunes a evitar</span>
          </div>
          <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-red-600 dark:text-red-400 font-bold mt-0.5">
                  ×
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
};
