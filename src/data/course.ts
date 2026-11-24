import { CourseModule, Lesson } from './types';
import { MODULE_0, MODULE_1 } from './module0And1';
import { MODULE_2_ARPEGGIOS } from './module2Arpeggios';
import { MODULE_3_LESSONS_A } from './module3ScalesA';
import { MODULE_3_LESSONS_B } from './module3ScalesB';
import { MODULE_4_APPENDIX } from './module4Appendix';

export const MODULE_3_SCALES: CourseModule = {
  id: 'mod-3',
  number: '3',
  title: 'Las Escalas',
  subtitle: 'Escala mayor, modos, bebop, dórico, menor natural, pentatónica, tensiones, armónica, melódica y disminuida',
  bookPages: 'pp. 121–306',
  lessons: [...MODULE_3_LESSONS_A, ...MODULE_3_LESSONS_B],
};

export const COURSE_MODULES: CourseModule[] = [
  MODULE_0,
  MODULE_1,
  MODULE_2_ARPEGGIOS,
  MODULE_3_SCALES,
  MODULE_4_APPENDIX,
];

export const ALL_LESSONS: Lesson[] = COURSE_MODULES.flatMap((m) => m.lessons);
