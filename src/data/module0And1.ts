import { CourseModule } from './types';

export const MODULE_0: CourseModule = {
  id: 'mod-0',
  number: '0',
  title: 'Presentación y Guía del Curso',
  subtitle: 'Portada, filosofía "muñón" y notación anglosajona',
  bookPages: 'pp. 1–8',
  lessons: [
    {
      id: 'l-0-1',
      moduleId: 'mod-0',
      code: '0.1',
      title: 'Portada, Créditos, Filosofía del Libro y Notación',
      shortTitle: 'Presentación y notación',
      bookPages: 'pp. 1–8',
      summary:
        'Bienvenido a Improvisación para Muñones (v1.05, Luis Ángel Rico "Ociosu"). Conoce el enfoque práctico del curso y domina la notación anglosajona antes de empezar.',
      blocks: [
        { type: 'heading', text: 'Improvisación para Muñones (v1.05)', page: 'pp. 1–6' },
        {
          type: 'paragraph',
          text: 'Escrito por Luis Ángel Rico («Ociosu», Langreo, 2021) para la comunidad de Rock & Roll para Muñones. Este curso nace con una filosofía muy clara: ser «los apuntes del compañero de clase» dirigidos al guitarrista aficionado que toca en casa, sabe poner acordes con cejilla y domina algo la pentatónica, pero siente que siempre toca lo mismo y quiere empezar a improvisar con sentido musical real.',
        },
        {
          type: 'callout',
          variant: 'concepto',
          title: '¿Para quién es este curso?',
          text: 'No necesitas saber solfeo ni haber estudiado armonía clásica en un conservatorio. Todo lo necesario se explica desde cero y en el orden exacto para que puedas aplicarlo directamente sobre el mástil de tu guitarra desde el primer día.',
        },
        {
          type: 'bullets',
          title: 'Lo que recorrerás paso a paso (pp. 1–353)',
          items: [
            'Módulo 1 — Introducción (pp. 9–18): Qué significa realmente improvisar, expectativas realistas, cómo organizar tus sesiones de práctica y el cambio de chip mental.',
            'Módulo 2 — Los Arpegios (pp. 19–120): Construcción de la escala mayor, armonización, localizar grados en el mástil, los 4 arpegios diatónicos (7, m7, maj7, m7b5), blues mayor y menor, ii-V-I, aproximaciones, notas guía, enclosures, regiones armónicas, dominantes secundarios, sustitución tritonal y atlas completo de 32 digitaciones.',
            'Módulo 3 — Las Escalas (pp. 121–306): Las 5 posiciones de la escala mayor, los 7 modos, patrones melódicos, mixolidia y mixolidia bebop, modo dórico, enfoque modal vs tonal, escala menor natural, pentatónica y superposición avanzada, tensiones y Fakebooks, menor armónica (mixolidia b9 b13), menor melódica (alterada, lidia dominante, backdoor) y el mundo simétrico disminuido.',
            'Módulo 4 — Ideas Importantes y Apéndice (pp. 307–353): Figuras y compases, precisión rítmica, swing, metrónomo en tiempos 2 y 4, transcripción, curva del olvido, tablas maestras de intervalos y 23 acordes, círculo de quintas interactivo y los 11 vídeos oficiales.',
          ],
        },
        { type: 'heading', text: 'Notación anglosajona (Sistema de cifrado)', page: 'p. 6' },
        {
          type: 'paragraph',
          text: 'A lo largo de todo el libro y en prácticamente cualquier partitura moderna, Real Book o página web de guitarra se utiliza el cifrado anglosajón (letras de la A a la G). Memoriza esta equivalencia al instante antes de pasar a la siguiente lección.',
        },
        {
          type: 'table',
          data: {
            title: 'Equivalencia entre notación latina y anglosajona',
            headers: ['Nota Latina', 'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'],
            rows: [
              ['Cifrado Anglosajón', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
              ['Regla mnemotécnica', 'C = Do', 'D = Re', 'E = Mi', 'F = Fa', 'G = Sol', 'A = La (440 Hz)', 'B = Si'],
            ],
          },
        },
        {
          type: 'scaleGrid',
          data: {
            title: 'Las 7 notas naturales en el cifrado anglosajón (pulsa para escuchar)',
            subtitle: 'Haz clic en cada casilla o pulsa "Escuchar" para oír la referencia afinada.',
            startMidi: 48,
            cells: [
              { note: 'C (Do)', degree: '1', role: 'root' },
              { note: '·', role: 'empty' },
              { note: 'D (Re)', degree: '2', role: 'scale' },
              { note: '·', role: 'empty' },
              { note: 'E (Mi)', degree: '3', role: 'chord' },
              { note: 'F (Fa)', degree: '4', role: 'scale' },
              { note: '·', role: 'empty' },
              { note: 'G (Sol)', degree: '5', role: 'chord' },
              { note: '·', role: 'empty' },
              { note: 'A (La)', degree: '6', role: 'scale' },
              { note: '·', role: 'empty' },
              { note: 'B (Si)', degree: '7', role: 'chord' },
            ],
          },
        },
      ],
      practiceTips: [
        'Tómate el curso con calma: sigue el orden secuencial del menú lateral sin saltarte lecciones, ya que cada bloque se apoya en el anterior.',
        'Ten la guitarra afinada en afinación estándar (E-A-D-G-B-e) y utiliza la barra inferior de metrónomo y cronómetro en cada sesión.',
        'Marca cada lección como «Completada» solo cuando hayas tocado sus ejemplos con comodidad y limpieza.',
      ],
      commonMistakes: [
        'Intentar leer todo el curso del tirón como una novela sin tocar los ejercicios en la guitarra.',
        'Traducir mentalmente cada letra anglosajona («G es Sol...») en lugar de asociar directamente la letra G con su sonido y posición en el mástil.',
      ],
    },
  ],
};

export const MODULE_1: CourseModule = {
  id: 'mod-1',
  number: '1',
  title: 'Introducción',
  subtitle: 'Mentalidad, método de estudio y cambio de chip',
  bookPages: 'pp. 9–18',
  lessons: [
    {
      id: 'l-1-1',
      moduleId: 'mod-1',
      code: '1.1',
      title: 'Introducción y ¿Qué es improvisar?',
      shortTitle: '¿Qué es improvisar?',
      bookPages: 'pp. 9–10',
      summary:
        'Desmontamos el mito de «inventar notas de la nada». Improvisar es mantener una conversación musical con vocabulario y gramática.',
      blocks: [
        { type: 'heading', text: '¿Qué es improvisar realmente?', page: 'pp. 9–10' },
        {
          type: 'paragraph',
          text: 'Si buscas «improvisar» en el diccionario de la RAE encontrarás algo como «hacer algo de pronto, sin estudio ni preparación». En música esa definición es un mito peligroso («un mojón pa ti», como dice el autor con humor): nadie se sube a un escenario y se inventa solos geniales por arte de magia sin preparación previa.',
        },
        {
          type: 'callout',
          variant: 'concepto',
          title: 'La analogía de la conversación',
          text: 'Improvisar con la guitarra es exactamente igual que mantener una conversación hablada. Cuando charlas con un amigo no recitas un guion memorizado palabra por palabra, pero tampoco te inventas palabras ni reglas gramaticales sobre la marcha: combinas vocabulario y frases que llevas años interiorizando para expresar una idea en el momento.',
        },
        {
          type: 'bullets',
          title: 'Los 3 ingredientes de la improvisación musical',
          items: [
            'Vocabulario: arpegios, escalas, frases cortas (licks), motivos rítmicos y recursos melódicos aprendidos de oído y de otros músicos.',
            'Gramática (Armonía): saber qué acordes están sonando en cada compás y qué notas encajan o generan tensión sobre ellos.',
            'Práctica consciente: repetir pequeños bloques musicales hasta que tus dedos respondan automáticamente a lo que imagina tu oído.',
          ],
        },
      ],
      practiceTips: [
        'Escucha hoy un solo que te guste e intenta identificar si el guitarrista está «hablando con frases y pausas» en vez de subir y bajar escalas sin parar.',
        'Empieza a ver cada arpegio y escala del curso como nuevo vocabulario para tu conversación musical, no como ejercicios gimnásticos.',
      ],
      commonMistakes: [
        'Creer que improvisar bien es un «don innato» reservado a genios en lugar de una habilidad entrenable paso a paso.',
        'Tocar sin respirar ni dejar silencios: una buena conversación musical necesita comas y puntos.',
      ],
    },
    {
      id: 'l-1-2',
      moduleId: 'mod-1',
      code: '1.2',
      title: 'Seamos realistas: Tiempo y etapas de asimilación',
      shortTitle: 'Seamos realistas',
      bookPages: 'pp. 11–12',
      summary:
        'La regla de las 10.000 horas, las 3 fases para interiorizar cualquier concepto y por qué menos es más.',
      blocks: [
        { type: 'heading', text: 'La regla de las 10.000 horas y el guitarrista aficionado', page: 'p. 11' },
        {
          type: 'paragraph',
          text: 'Alcanzar la maestría absoluta en cualquier disciplina requiere alrededor de 10.000 horas de práctica deliberada. Como aficionados con trabajo, familia y vida propia probablemente no lleguemos a esa cifra, ¡y no pasa absolutamente nada! Nuestro objetivo no es convertirnos en el próximo Pat Metheny, sino disfrutar muchísimo más tocando y superar la frustración de sonar siempre igual.',
        },
        { type: 'heading', text: 'Las 3 etapas para dominar cualquier recurso', page: 'pp. 11–12' },
        {
          type: 'table',
          data: {
            title: 'Proceso natural de asimilación en la guitarra',
            headers: ['Etapa', 'Qué ocurre', 'Analogía al conducir'],
            rows: [
              ['1. Memorizar la digitación', 'Aprendes dónde van los dedos de un arpegio o escala y logras tocarlo despacio sin fallos.', 'Aprender dónde está el embrague, el freno y cada marcha.'],
              ['2. Aplicar sobre cambios de acordes', 'Eres capaz de seguir una progresión (ej. un blues) pensando conscientemente en qué acorde entra ahora.', 'Conducir por ciudad atento a cada señal y cambiando de marcha pensando en ello.'],
              ['3. Interiorizarlo', 'El recurso sale de forma natural en tus improvisaciones sin calcular trastes ni fórmulas.', 'Conducir mientras charlas relajadamente sin pensar en los pedales.'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'memoriza',
          title: 'Regla de oro del curso',
          text: 'Trabaja pocas cosas a la vez, pero en profundidad. Es infinitamente mejor dominar un solo arpegio dominante y saber aplicarlo con musicalidad sobre un blues que memorizar siete escalas exóticas y no saber usar ninguna.',
        },
      ],
      practiceTips: [
        'No pases a la siguiente fase de un arpegio o escala hasta que la digitación salga fluida y relajada a tempo lento.',
        'Disfruta el camino: celebra los pequeños logros diarios, como clavar la 3ª de cada acorde en un blues por primera vez.',
      ],
      commonMistakes: [
        'Querer abarcar 5 escalas y 10 licks en la misma semana: acabarás abrumado y sin interiorizar ninguno.',
        'Compararte con músicos profesionales que dedican 6 horas diarias al instrumento.',
      ],
    },
    {
      id: 'l-1-3',
      moduleId: 'mod-1',
      code: '1.3',
      title: 'Cómo organizar las sesiones de práctica',
      shortTitle: 'Organizar la práctica',
      bookPages: 'pp. 13–15',
      summary:
        'Los 7 errores típicos del guitarrista autodidacta, la importancia del metrónomo, el cronómetro y la regla de oro «aprendemos lo que repetimos».',
      suggestedBpm: 60,
      blocks: [
        { type: 'heading', text: 'Los 7 errores más habituales al practicar', page: 'p. 13' },
        {
          type: 'bullets',
          items: [
            'Sentarse con la guitarra sin tener decidido de antemano qué vas a practicar.',
            'Tocar siempre lo que ya te sale bien en lugar de trabajar tus puntos débiles.',
            'Practicar sin metrónomo ni referencia rítmica.',
            'Empezar demasiado rápido, acumulando fallos y tensiones en la mano.',
            'Practicar en maratones ocasionales de 4 horas el domingo en vez de sesiones cortas diarias.',
            'Mezclar el tiempo de estudio estructurado con el rato de «tocar por diversión».',
            'No medir tu progreso (tempos alcanzados, ejercicios dominados).',
          ],
        },
        { type: 'heading', text: 'Plan de sesión recomendado (30 minutos diarios)', page: 'pp. 14–15' },
        {
          type: 'table',
          data: {
            title: 'Ejemplo de rutina diaria enfocada (usa el cronómetro inferior)',
            headers: ['Bloque', 'Duración', 'Objetivo concreto'],
            rows: [
              ['1. Calentamiento y repaso', '5 min', 'Digitar lentamente el arpegio o escala del día anterior con metrónomo.'],
              ['2. Nuevo concepto / técnica', '10 min', 'Memorizar una digitación nueva o un patrón rítmico empezando a 60 BPM sin errores.'],
              ['3. Aplicación sobre armonía', '10 min', 'Aplicar lo trabajado sobre una base (blues en G, ii-V-I, etc.) controlando cada cambio.'],
              ['4. Tiempo libre / diversión', '5+ min', 'Desconectar el modo estudio e improvisar libremente disfrutando de tu música.'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'memoriza',
          title: 'USA SIEMPRE METRÓNOMO · Aprendemos lo que repetimos',
          text: 'Tu cerebro no distingue entre una repetición buena y una mala: simplemente automatiza lo que repites. Si tocas un arpegio rápido tropezándote cinco veces, estás entrenando a tus dedos a tropezarse. Empieza exageradamente lento (60 BPM), clávalo limpio y sube el tempo de 5 en 5 BPM.',
        },
      ],
      practiceTips: [
        'Usa el cronómetro integrado en la barra inferior de esta app para dividir tu sesión en bloques de 5–10 minutos.',
        'Lleva un objetivo trimestral o semestral realista (por ejemplo: «en 6 meses quiero improvisar con soltura un blues mayor y menor usando arpegios»).',
        '30 minutos diarios constantes rinden muchísimo más que 5 horas un solo día a la semana.',
      ],
      commonMistakes: [
        'Subir el metrónomo antes de poder tocar el ejercicio 5 veces seguidas sin un solo fallo ni tensión.',
        'Confundir «echar un rato tocando canciones o improvisando sobre YouTube» con practicar de forma deliberada.',
      ],
    },
    {
      id: 'l-1-4',
      moduleId: 'mod-1',
      code: '1.4',
      title: 'Planteamiento del contenido: Cambiar el chip',
      shortTitle: 'Cambiar el chip',
      bookPages: 'pp. 16–17',
      summary:
        'Una noticia buena y otra mala: no existe una «turbo-escala» mágica; el secreto está en pensar en los acordes y en los dos pilares del método.',
      blocks: [
        { type: 'heading', text: 'Una noticia buena y otra mala', page: 'pp. 16–17' },
        {
          type: 'paragraph',
          text: 'Muchos guitarristas llegan aquí buscando la «siguiente pentatónica»: una nueva escala mágica de cinco o siete notas que puedas subir y bajar encima de cualquier canción para sonar instantáneamente a jazz, rock sofisticado o blues profesional.',
        },
        {
          type: 'callout',
          variant: 'nota',
          title: 'La mala noticia... y la gran noticia',
          text: 'La mala noticia es que NO existe ninguna «turbo-escala» mágica que funcione en piloto automático. La buena noticia es que una vez cambias el chip y empiezas a pensar en los acordes (y sus arpegios) que están sonando en cada compás, TODO cobra sentido: tus frases suenan conectadas con la canción y cada nota tiene un propósito claro.',
        },
        {
          type: 'bullets',
          title: 'Los dos grandes pilares de este curso',
          items: [
            'Pilar 1 — Dominar las notas de los acordes (Arpegios) y sus escalas asociadas a lo largo del mástil.',
            'Pilar 2 — Conocer la armonía en todo momento: saber exactamente en qué compás estás, qué acorde suena ahora y cuál viene a continuación.',
            'Complemento imprescindible — Educar el oído: cantar las notas fundamentales, transcribir frases sencillas y escuchar mucha música de los estilos que quieres tocar.',
          ],
        },
      ],
      practiceTips: [
        'A partir del Módulo 2, resiste la tentación de refugiarte en la pentatónica «en piloto automático»: concéntrate en apuntar a las notas reales de cada acorde.',
        'Cuando escuches una canción, intenta contar los compases y notar cuándo cambia el acorde de fondo.',
      ],
      commonMistakes: [
        'Seguir tocando una única escala sin prestar atención a los cambios de acordes de la base.',
        'Saltarse el bloque de arpegios para ir directo a los modos o escalas exóticas: los arpegios son el esqueleto sobre el que se construye todo lo demás.',
      ],
    },
  ],
};
