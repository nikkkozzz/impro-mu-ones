import { CourseModule } from './types';

export const MODULE_4_APPENDIX: CourseModule = {
  id: 'mod-4',
  number: '4',
  title: 'Ideas Importantes y Apéndice Completo',
  subtitle: 'Ritmo, swing, metrónomo 2 y 4, transcripción, tablas maestras, círculo de quintas y vídeos',
  bookPages: 'pp. 307–353',
  lessons: [
    // L4.1
    {
      id: 'l-4-1',
      moduleId: 'mod-4',
      code: '4.1',
      title: 'Conceptos básicos de solfeo: Figuras musicales y Compases',
      shortTitle: 'Figuras y Compases',
      bookPages: 'pp. 307–314',
      summary:
        'Duraciones desde redonda a semifusa, puntillos, tresillos, silencios y la diferencia esencial entre compases binarios (2/4, 3/4, 4/4) y compuestos/ternarios (6/8, 9/8, 12/8).',
      suggestedBpm: 75,
      blocks: [
        { type: 'heading', text: 'Figuras musicales, silencios, puntillo y tresillos', page: 'pp. 308–310' },
        {
          type: 'paragraph',
          text: 'Aunque no necesites leer partituras clásicas a primera vista, conocer la duración exacta de cada figura rítmica es imprescindible para que tus solos tengan pulso, intención y groove. El puntillo detrás de cualquier figura aumenta su duración en la mitad de su valor (ej. blanca con puntillo = 2 + 1 = 3 tiempos). El tresillo mete 3 notas iguales donde normalmente cabían 2.',
        },
        {
          type: 'table',
          data: {
            title: 'Tabla de figuras musicales y equivalencias en compás 4/4',
            headers: ['Figura', 'Símbolo', 'Silencio', 'Duración en 4/4', 'Notas por compás'],
            rows: [
              ['Redonda', '𝅝', '𝄻', '4 pulsos (tiempos)', '1'],
              ['Blanca', '𝅗𝅥', '𝄼', '2 pulsos', '2'],
              ['Negra', '♩', '𝄽', '1 pulso (unidad de tiempo)', '4'],
              ['Corchea', '♪', '𝄾', '1/2 pulso', '8 (4 parejas)'],
              ['Tresillo de corchea', '♪³', '—', '1/3 de pulso', '12 (4 grupos de 3)'],
              ['Semicorchea', '𝅘𝅥𝅯', '𝄿', '1/4 de pulso', '16 (4 grupos de 4)'],
              ['Fusa / Semifusa', '𝅘𝅥𝅰 / 𝅘𝅥𝅱', '—', '1/8 y 1/16 de pulso', '32 y 64'],
            ],
          },
        },
        { type: 'heading', text: 'Compases simples vs Compases compuestos (3/4 vs 6/8 y 12/8)', page: 'pp. 311–314' },
        {
          type: 'table',
          data: {
            title: 'Compases fundamentales y canciones de referencia del libro',
            headers: ['Compás', 'Tipo / Acentuación', 'Cómo se siente', 'Canciones de ejemplo'],
            rows: [
              ['4/4', 'Simple cuaternario (F–d–mF–d)', '1 - 2 - 3 - 4 (el estándar pop/rock/jazz)', 'La mayoría del rock y blues recto'],
              ['3/4', 'Simple ternario (F–d–d)', '1 - 2 - 3 (vals, 3 negras por compás)', 'My Favorite Things · Valses'],
              ['2/4', 'Simple binario (F–d)', '1 - 2 (marcha, polka, chotis)', 'Marchas y folclore'],
              ['6/8', 'Compuesto binario (2 pulsos de 3)', 'UN-dos-tres DOS-dos-tres (balanceo)', 'House of the Rising Sun · Nothing Else Matters'],
              ['12/8', 'Compuesto cuaternario (4 pulsos de 3)', 'Slow blues con subdivisión de 3', 'Story of the Blues · Red House · Gravity'],
              ['5/4', 'Irregular (3+2)', '1-2-3-1-2', 'Take Five (Dave Brubeck)'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'concepto',
          title: 'Diferencia clave entre 3/4 y 6/8',
          text: 'Aunque matemáticamente 3 negras y 6 corcheas suman lo mismo, su acentuación es completamente distinta: en 3/4 contamos tres pulsos divididos en dos (1-y 2-y 3-y), mientras que en 6/8 sentimos DOS grandes pulsos divididos en tres (1-2-3, 4-5-6). ¡Pruébalo ahora mismo cambiando entre 3/4 y 6/8 en el metrónomo inferior!',
        },
      ],
      practiceTips: [
        'Activa el metrónomo inferior en 6/8 y luego en 3/4 a 90 BPM y rasguea un acorde de Em siguiendo los acentos hasta notar claramente el cambio de sensación.',
      ],
      commonMistakes: [
        'Acentuar todas las notas al mismo volumen sin respetar el pulso fuerte y débil del compás.',
      ],
    },

    // L4.2
    {
      id: 'l-4-2',
      moduleId: 'mod-4',
      code: '4.2',
      title: 'Ritmo, Precisión rítmica, Swing y Metrónomo en 2 y 4 (Ejemplos 91–92)',
      shortTitle: 'Swing y Metrónomo en 2 y 4',
      bookPages: 'pp. 315–322',
      summary:
        'Contar 1-y-2-y-3-y-4-y, tocar adelantado vs «laid back», desplazar el inicio de las frases, corcheas rectas vs swing (1:1, 2:1, 3:1) y el método de 5 pasos del metrónomo en 2 y 4.',
      suggestedBpm: 90,
      blocks: [
        { type: 'heading', text: '1. Contar tiempos, síncopas y dónde empezar tus frases (Ej. 91)', page: 'pp. 315–317' },
        {
          type: 'paragraph',
          text: 'Una misma melodía aburrida puede convertirse en una frase brutal simplemente desplazando el instante en el que empieza. Cuenta siempre «1 - y - 2 - y - 3 - y - 4 - y»: los números son tiempos fuertes y las «y» son contratiempos (síncopas). Además, recuerda que adelantarse al pulso genera ansiedad/tensión, mientras que tocar milésimas de segundo detrás del pulso («laid back») da ese groove relajado del blues y el jazz.',
        },
        {
          type: 'tablature',
          data: {
            exampleNum: 'Ejemplo 91',
            title: 'Misma frase sobre ii–V–i en Cm empezando en el pulso 1, en el pulso 2 y en el «2 y»',
            subtitle: 'Escucha cómo el simple hecho de entrar en la «y» del tiempo 2 dispara el swing y el interés musical.',
            bpm: 95,
            swing: true,
            measures: [
              { chord: 'Inicio en tiempo 1', roman: 'Dm7b5', beats: [
                { notes: [{ string: 3, fret: 5 }], duration: 0.5, label: '1' },
                { notes: [{ string: 2, fret: 4 }], duration: 0.5, label: 'y' },
                { notes: [{ string: 2, fret: 7 }], duration: 0.5, label: '2' },
                { notes: [{ string: 1, fret: 6 }], duration: 0.5, label: 'y' },
                { notes: [{ string: 2, fret: 4 }], duration: 2, label: '3-4' },
              ]},
              { chord: 'Inicio en tiempo 2', roman: 'G7', beats: [
                { notes: [], duration: 1, isRest: true, label: '1(sil)' },
                { notes: [{ string: 3, fret: 4 }], duration: 0.5, label: '2' },
                { notes: [{ string: 2, fret: 3 }], duration: 0.5, label: 'y' },
                { notes: [{ string: 2, fret: 6 }], duration: 0.5, label: '3' },
                { notes: [{ string: 2, fret: 4 }], duration: 0.5, label: 'y' },
                { notes: [{ string: 3, fret: 4 }], duration: 1, label: '4' },
              ]},
              { chord: 'Inicio en «2 y» (síncopa)', roman: 'Cm7', beats: [
                { notes: [], duration: 1, isRest: true, label: '1' },
                { notes: [], duration: 0.5, isRest: true, label: '2' },
                { notes: [{ string: 3, fret: 5 }], duration: 0.5, label: 'y!' },
                { notes: [{ string: 2, fret: 4 }], duration: 0.5, label: '3' },
                { notes: [{ string: 1, fret: 3 }], duration: 0.5, label: 'y' },
                { notes: [{ string: 1, fret: 6 }], duration: 1, label: '4' },
              ]},
            ],
          },
        },
        { type: 'heading', text: '2. Recto vs Swing (Ejemplo 92)', page: 'pp. 318–319' },
        {
          type: 'table',
          data: {
            title: 'Proporciones de la corchea: de totalmente recta a swing marcado',
            headers: ['Feel / Proporción', 'Duración 1ª + 2ª corchea', 'Sonido característico'],
            rows: [
              ['Recto (1:1)', '50% + 50%', 'Rock, pop, funk recto, metal, bossa nova.'],
              ['Swing clásico / Tresillo (2:1)', '66% + 33% (tresillo ligado)', 'Swing de jazz estándar y shuffle de blues (¡prueba el botón Swing en cualquier TAB!).'],
              ['Swing exagerado (3:1)', '75% + 25% (corchea puntillo + semicorchea)', 'Tempos lentos muy arrastrados y blues pesado.'],
            ],
          },
        },
        { type: 'heading', text: '3. Cómo practicar con el metrónomo en los tiempos 2 y 4 (5 Pasos)', page: 'pp. 320–322' },
        {
          type: 'callout',
          variant: 'ejercicio',
          title: '¡Activa el botón «Modo 2 y 4» en la barra de metrónomo inferior!',
          text: 'En el jazz y el blues el batería pisa el charles (hi-hat) en los tiempos 2 y 4, NO en el 1 y 3. Practicar con el clic únicamente en 2 y 4 convierte tu pulso interno en una roca y le da swing automático a todo lo que toques.',
        },
        {
          type: 'bullets',
          title: 'Los 5 pasos progresivos del libro para dominar el metrónomo en 2 y 4',
          items: [
            'Paso 1: Pon el metrónomo en «Modo 2 y 4» a 80 BPM y chasquea los dedos o da palmas coincidiendo con cada clic diciendo en voz alta «1 – (CLIC 2) – 3 – (CLIC 4)».',
            'Paso 2: Practica el conteo clásico de jam session antes de entrar: «1 – (clic) – 2 – (clic) – 1, 2, 3, 4».',
            'Paso 3: Marca el compás con el pie en 1-2-3-4 o rasguea un acorde sencillo (Cm7) en blancas/negras sintiendo el clic en 2 y 4.',
            'Paso 4: Toca una escala mayor o arpegio en negras y luego en corcheas swing sobre el Modo 2 y 4.',
            'Paso 5: Improvisa libremente sobre el blues en G o un ii–V–I únicamente con el metrónomo en 2 y 4.',
          ],
        },
      ],
      practiceTips: [
        'Usa el botón «Modo 2 y 4» de esta aplicación al menos 5 minutos en cada sesión: en dos semanas notarás un salto gigante en tu sentido del ritmo.',
      ],
      commonMistakes: [
        '«Darle la vuelta al pulso» involuntariamente y acabar escuchando el clic del metrónomo como si fuera el tiempo 1 y 3.',
      ],
    },

    // L4.3
    {
      id: 'l-4-3',
      moduleId: 'mod-4',
      code: '4.3',
      title: 'El qué y el cómo, Transcripción y La Curva del Olvido',
      shortTitle: 'Transcripción y Curva del Olvido',
      bookPages: 'pp. 323–325',
      summary:
        'Por qué el fraseo («el cómo») importa más que las notas («el qué»), el método de 4 pasos para transcribir de oído y cómo vencer la curva del olvido con repasos espaciados.',
      blocks: [
        { type: 'heading', text: 'El «qué» vs el «cómo» (B.B. King, SRV, T-Bone Walker)', page: 'p. 323' },
        {
          type: 'paragraph',
          text: 'Dos guitarristas pueden tocar exactamente las mismas 4 notas de un arpegio (el «qué») y uno sonar robótico mientras el otro te pone los pelos de punta (el «cómo»). Dinámica (tocar suave y fuerte), vibrato, bendings afinados, silencios, ataques de púa y articulación (ligados, slides, staccato) son lo que transforma la teoría en música viva.',
        },
        { type: 'heading', text: 'Transcribir de oído: el método de 4 pasos', page: 'p. 324' },
        {
          type: 'bullets',
          items: [
            'Paso 1 — Escuchar y cantar la frase hasta poder tararearla sin la grabación (si puedes cantarla, ya está en tu cabeza).',
            'Paso 2 — Sacarla en la guitarra trozo a trozo (puedes ralentizar el audio sin cambiar el tono si va rápido).',
            'Paso 3 — Analizarla teóricamente: ¿sobre qué acorde suena? ¿qué grados del arpegio o escala está tocando? (ej. «entra en la 3ª de G7 con aproximación cromática»).',
            'Paso 4 — Transportarla a otras tonalidades y modificar su ritmo o final para hacerla tuya.',
          ],
        },
        { type: 'heading', text: 'La Curva del Olvido y los repasos espaciados (p. 325)', page: 'p. 325' },
        {
          type: 'paragraph',
          text: 'Los estudios de memoria (Hermann Ebbinghaus) demuestran que si aprendes un arpegio o frase nueva y no la repasas, a los 20 minutos ya has olvidado casi la mitad (solo retienes ~58%), a la hora ~44% y al día siguiente apenas ~34%. La solución científica es el repaso espaciado: volver a tocar brevemente lo aprendido a los 5 min, 20 min, 1 hora, 8 horas y los días siguientes.',
        },
        { type: 'forgettingCurve' },
      ],
      practiceTips: [
        'No hace falta transcribir solos enteros de 3 minutos: transcribe hoy una sola frase de 2 compases de B.B. King o Miles Davis y analízala.',
        'Al acabar una sesión, vuelve a coger la guitarra 2 minutos una hora después para repasar la nueva digitación: multiplicarás tu retención.',
      ],
      commonMistakes: [
        'Copiar licks de memoria mirando tablaturas sin analizar nunca sobre qué acorde ni qué grados funcionan.',
      ],
    },

    // L4.4
    {
      id: 'l-4-4',
      moduleId: 'mod-4',
      code: '4.4',
      title: 'Estrategias de improvisación: Simplificar, Sustituir y Variar (Ej. 93)',
      shortTitle: 'Estrategias y Variaciones',
      bookPages: 'pp. 326–329',
      summary:
        'Cómo simplificar progresiones complejas a Dominantes y Tónicas (consejo de Joe Pass), introducir sustituciones y multiplicar cualquier frase con variaciones (desplazamiento de octava).',
      suggestedBpm: 95,
      blocks: [
        { type: 'heading', text: '1. Simplificar a Dominantes y Tónicas (el truco de Joe Pass)', page: 'p. 326' },
        {
          type: 'paragraph',
          text: 'Cuando te enfrentes a un estándar de jazz lleno de acordes rápidos, no entres en pánico: reduce mentalmente la armonía a dos sensaciones: momentos de TENSIÓN (Dominantes V7, donde puedes experimentar con alteraciones y cromatismos) y momentos de REPOSO (Tónicas I, donde resuelves limpiamente en una nota del acorde).',
        },
        { type: 'heading', text: '2. Pensar en otras progresiones y 3. Multiplicar tus frases (Ej. 93)', page: 'pp. 327–329' },
        {
          type: 'bullets',
          title: '4 formas instantáneas de multiplicar cualquier frase o arpegio que ya sepas',
          items: [
            'No empezar en la fundamental: arranca tu idea desde la 3ª, la 5ª o la 7ª.',
            'Desplazamiento de octava (Ejemplo 93): sube o baja una octava la mitad de las notas de una frase para crear saltos frescos y melódicos.',
            'Cambiar el tiempo de inicio: muévela medio tiempo o un tiempo hacia delante/atrás (síncopa).',
            'Invertir la dirección: si la frase sube y baja, prueba a tocarla bajando y luego subiendo.',
          ],
        },
        {
          type: 'tablature',
          data: {
            exampleNum: 'Ejemplo 93',
            title: 'Desplazamiento de octava: transformando una línea lineal en una frase con saltos',
            subtitle: 'Compás 1: línea original en C mayor. Compás 2: mismas notas desplazando dos notas una octava aguda.',
            bpm: 95,
            swing: true,
            measures: [
              { chord: 'Cmaj7 (Frase original)', roman: 'Lineal', beats: [
                { notes: [{ string: 4, fret: 10 }], duration: 0.5, label: 'C' },
                { notes: [{ string: 3, fret: 7 }], duration: 0.5, label: 'D' },
                { notes: [{ string: 3, fret: 9 }], duration: 0.5, label: 'E' },
                { notes: [{ string: 2, fret: 8 }], duration: 0.5, label: 'G' },
                { notes: [{ string: 2, fret: 10 }], duration: 1, label: 'A' },
                { notes: [{ string: 1, fret: 7 }], duration: 1, label: 'B' },
              ]},
              { chord: 'Cmaj7 (Desplazamiento octava)', roman: 'Variación', beats: [
                { notes: [{ string: 4, fret: 10 }], duration: 0.5, label: 'C' },
                { notes: [{ string: 1, fret: 10 }], duration: 0.5, label: 'D↑8ª!' },
                { notes: [{ string: 3, fret: 9 }], duration: 0.5, label: 'E' },
                { notes: [{ string: 1, fret: 15 }], duration: 0.5, label: 'G↑8ª!' },
                { notes: [{ string: 2, fret: 10 }], duration: 1, label: 'A' },
                { notes: [{ string: 1, fret: 7 }], duration: 1, label: 'B' },
              ]},
            ],
          },
        },
      ],
      practiceTips: [
        'Toma un único motivo de 4 notas hoy e intenta improvisar 12 compases enteros de blues usando SOLO variaciones rítmicas y de octava de ese motivo.',
      ],
      commonMistakes: [
        'Tocar una idea diferente cada compás sin desarrollo temático: los grandes solos construyen frases repitiendo y variando motivos cortos.',
      ],
    },

    // L4.5
    {
      id: 'l-4-5',
      moduleId: 'mod-4',
      code: '4.5',
      title: 'Referencia Armónica Completa: Intervalos, 23 Acordes, Terceras y Dominantes',
      shortTitle: 'Tablas Maestras de Armonía',
      bookPages: 'pp. 329–339',
      summary:
        'Todas las tablas de consulta rápida del apéndice: intervalos en semitonos, construcción de los 23 tipos de acordes, secuencia por terceras, comparativa de las 4 escalas y opciones sobre dominantes.',
      blocks: [
        { type: 'heading', text: '1. Tabla completa de Intervalos (pp. 329–331)', page: 'pp. 329–331' },
        {
          type: 'table',
          data: {
            title: 'Intervalos musicales desde la fundamental (ejemplo desde C)',
            headers: ['Semitonos', 'Intervalo', 'Cifrado', 'Ejemplo desde C', 'Regla de uso'],
            rows: [
              ['0', 'Unísono / Fundamental', '1', 'C', 'Misma nota'],
              ['1', '2ª menor / 9ª menor', 'b2 / b9', 'Db', 'Sonido frigio / dominante b9'],
              ['2', '2ª mayor / 9ª mayor', '2 / 9', 'D', 'Tensión disponible habitual'],
              ['3', '3ª menor / #9', 'b3 / #9', 'Eb / D#', 'Define acorde menor (o #9 hendrixiano en dom.)'],
              ['4', '3ª mayor', '3', 'E', 'Define acorde mayor y dominante'],
              ['5', '4ª justa / 11ª', '4 / 11', 'F', 'Tensión en m7; evitar reposar en maj7/7'],
              ['6', '4ª aum. / 5ª dism. (Tritono)', '#4 / #11 / b5', 'F# / Gb', 'Lidio (#4), m7b5 (b5), blue note'],
              ['7', '5ª justa', '5', 'G', 'Power chord, máxima estabilidad'],
              ['8', '5ª aum. / 6ª menor', '#5 / b6 / b13', 'G# / Ab', 'Aumentado, menor natural, dominante b13'],
              ['9', '6ª mayor / 13ª / bb7', '6 / 13 / bb7', 'A / Bbb', 'Dórico (6), dominante 13, dim7 (bb7)'],
              ['10', '7ª menor', 'b7', 'Bb', 'Dominante 7, m7 y m7b5'],
              ['11', '7ª mayor', '7', 'B', 'Acorde maj7 y mMaj7'],
              ['12', 'Octava justa', '8 (1)', 'C', 'Misma nota al doble de frecuencia'],
            ],
          },
        },
        { type: 'heading', text: '2. Tabla maestra de los 23 tipos de acordes (p. 334)', page: 'pp. 332–335' },
        {
          type: 'table',
          data: {
            title: 'Fórmulas de construcción de los 23 acordes esenciales',
            headers: ['Acorde', 'Fórmula', 'Ejemplo C', 'Acorde', 'Fórmula', 'Ejemplo C'],
            rows: [
              ['Mayor', '1-3-5', 'C-E-G', '7 (Dom)', '1-3-5-b7', 'C-E-G-Bb'],
              ['Menor (m)', '1-b3-5', 'C-Eb-G', '9', '1-3-5-b7-9', 'C-E-G-Bb-D'],
              ['sus2', '1-2-5', 'C-D-G', '13', '1-3-5-b7-9-13', 'C-E-G-Bb-D-A'],
              ['sus4', '1-4-5', 'C-F-G', '7sus4', '1-4-5-b7', 'C-F-G-Bb'],
              ['5 (Power)', '1-5', 'C-G', '7b9', '1-3-5-b7-b9', 'C-E-G-Bb-Db'],
              ['Aumentado (+)', '1-3-#5', 'C-E-G#', '7#9', '1-3-5-b7-#9', 'C-E-G-Bb-D#'],
              ['Disminuido', '1-b3-b5', 'C-Eb-Gb', '7#11', '1-3-5-b7-#11', 'C-E-G-Bb-F#'],
              ['6', '1-3-5-6', 'C-E-G-A', '7alt', '1-3-b7-(b9/#9/#11/b13)', 'C-E-Bb-Db-Ab'],
              ['m6', '1-b3-5-6', 'C-Eb-G-A', 'm7', '1-b3-5-b7', 'C-Eb-G-Bb'],
              ['maj7 (Δ)', '1-3-5-7', 'C-E-G-B', 'm9', '1-b3-5-b7-9', 'C-Eb-G-Bb-D'],
              ['maj9', '1-3-5-7-9', 'C-E-G-B-D', 'mMaj7', '1-b3-5-7', 'C-Eb-G-B'],
              ['m7b5 (ø)', '1-b3-b5-b7', 'C-Eb-Gb-Bb', 'dim7 (º7)', '1-b3-b5-bb7', 'C-Eb-Gb-A'],
            ],
          },
        },
        {
          type: 'callout',
          variant: 'truco',
          title: 'Secuencia mágica de notas por terceras (pp. 335–337): C – E – G – B – D – F – A – C',
          text: 'Memoriza esa cadena de 7 letras como si fuera un número de teléfono. Para saber las letras de CUALQUIER acorde al instante, empieza en su raíz y coge 4 letras seguidas (luego ajusta sostenidos/bemoles): ¿Fm7b5? → F-A-C-E → ajustas b3, b5, b7 → F-Ab-Cb(B)-Eb. ¿Db7? → D-F-A-C → Db-F-Ab-Cb(B).',
        },
        { type: 'heading', text: '3. Comparativa de las 4 escalas y Opciones sobre Dominantes (pp. 338–339)', page: 'pp. 338–339' },
        {
          type: 'table',
          data: {
            title: 'Armonización comparada de las 4 grandes escalas (p. 338)',
            headers: ['Escala', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
            rows: [
              ['Mayor', 'Imaj7', 'iim7', 'iiim7', 'IVmaj7', 'V7', 'vim7', 'viim7b5'],
              ['Menor Natural', 'im7', 'iim7b5', 'bIIImaj7', 'ivm7', 'vm7', 'bVImaj7', 'bVII7'],
              ['Menor Armónica', 'imMaj7', 'iim7b5', 'bIIImaj7#5', 'ivm7', 'V7(b9b13)', 'bVImaj7', 'viidim7'],
              ['Menor Melódica', 'imMaj7', 'iim7', 'bIIImaj7#5', 'IV7(#11)', 'V7(b13)', 'vim7b5', 'vii7alt'],
            ],
          },
        },
        {
          type: 'table',
          data: {
            title: 'Mapa definitivo: Opciones de improvisación sobre un acorde Dominante V7 (p. 339)',
            headers: ['Contexto del Dominante', 'Escalas y recursos ideales', 'Ejemplo sobre G7'],
            rows: [
              ['Estándar / Blues / Funk (reposado)', 'Arpegio 7 · Mixolidia · Mixolidia Bebop · Escala de Blues', 'G7 · G Mixolidia · G Mixolidia Bebop'],
              ['Resuelve a acorde Mayor (V7 → Imaj7)', 'Mixolidia Bebop · Alterada · Disminuida h-w · Sust. Tritonal', 'G Mix. Bebop · Ab men. mel. · G h-w · Db7'],
              ['Resuelve a acorde Menor (V7 → im7)', 'Mixolidia b9 b13 · Alterada · Arpegio dim7 desde 3ª', 'C menor armónica (Bb Mix.) · Ab men. mel. · Bº7'],
              ['Dominante sustituto / Backdoor (bII7, bVII7, IV7)', 'Lidia Dominante (4º modo menor melódica)', 'Sobre Db7 → Ab men. mel. · Sobre G7#11 → D men. mel.'],
            ],
          },
        },
      ],
      practiceTips: [
        'Guarda esta lección como «chuleta de atril»: cada vez que te encuentres un acorde raro en un Real Book, consulta aquí su fórmula y escala exacta.',
      ],
      commonMistakes: [
        'Intentar memorizar todas las tablas de golpe sin tocar los sonidos en la guitarra.',
      ],
    },

    // L4.6
    {
      id: 'l-4-6',
      moduleId: 'mod-4',
      code: '4.6',
      title: 'Tonalidades, Círculo de Quintas Interactivo y Mini Progresiones',
      shortTitle: 'Círculo de Quintas Interactivo',
      bookPages: 'pp. 340–348',
      summary:
        'Las 30 tonalidades (15 mayores y 15 menores), el orden de sostenidos (F-C-G-D-A-E-B) y bemoles (B-E-A-D-G-C-F), y nuestro Círculo de Quintas SVG interactivo para transportar progresiones.',
      blocks: [
        { type: 'heading', text: 'Orden de sostenidos y bemoles', page: 'pp. 340–341' },
        {
          type: 'paragraph',
          text: 'Las alteraciones en la armadura siempre aparecen en el mismo orden inmutable: Sostenidos (♯) = F – C – G – D – A – E – B («Fa-Do-Sol-Re-La-Mi-Si»). Bemoles (♭) = exactamente al revés: B – E – A – D – G – C – F («Si-Mi-La-Re-Sol-Do-Fa»). En el Círculo de Quintas, cada paso hacia la derecha (sentido horario) suma un sostenido (o quita un bemol) y sube una 5ª justa; cada paso hacia la izquierda suma un bemol.',
        },
        { type: 'circleOfFifths' },
        { type: 'heading', text: 'Cómo ver los 7 acordes de cualquier tonalidad y transportar «Mini Progresiones»', page: 'pp. 343–348' },
        {
          type: 'callout',
          variant: 'truco',
          title: 'La regla del semicírculo en el Círculo de Quintas',
          text: 'Haz clic en cualquier tonalidad del círculo superior: su vecino a la izquierda es SIEMPRE el grado IV, y su vecino a la derecha es el grado V. En el anillo interior tienes justo debajo sus tres grados menores diatónicos (ii debajo de IV, vi debajo de I, iii debajo de V). ¡Con un solo vistazo ves los 6 acordes principales y puedes transportar cualquier I–IV–V, ii–V–I o vi–ii–V–I (por ejemplo de C a D) girando la rueda!',
        },
        {
          type: 'table',
          data: {
            title: 'Resumen de las tonalidades más frecuentes en guitarra',
            headers: ['Armadura', 'Tonalidad Mayor', 'Relativa Menor', 'Alteraciones exactas'],
            rows: [
              ['0', 'C mayor', 'A menor', 'Ninguna'],
              ['1♯', 'G mayor', 'E menor', 'F#'],
              ['2♯', 'D mayor', 'B menor', 'F#, C#'],
              ['3♯', 'A mayor', 'F# menor', 'F#, C#, G#'],
              ['4♯', 'E mayor', 'C# menor', 'F#, C#, G#, D#'],
              ['5♯', 'B mayor', 'G# menor', 'F#, C#, G#, D#, A#'],
              ['1♭', 'F mayor', 'D menor', 'Bb'],
              ['2♭', 'Bb mayor', 'G menor', 'Bb, Eb'],
              ['3♭', 'Eb mayor', 'C menor', 'Bb, Eb, Ab'],
              ['4♭', 'Ab mayor', 'F menor', 'Bb, Eb, Ab, Db'],
              ['5♭', 'Db mayor', 'Bb menor', 'Bb, Eb, Ab, Db, Gb'],
            ],
          },
        },
      ],
      practiceTips: [
        'Juega con el Círculo de Quintas interactivo de arriba: elige tonalidades de jazz habituales con bemoles (F, Bb, Eb, Ab) y escucha su ii–V–I.',
        'Practica los arpegios del Módulo 2 recorriendo el círculo en sentido antihorario (C → F → Bb → Eb → Ab → Db...): ¡es el clásico ciclo de cuartas usado por todos los grandes músicos!',
      ],
      commonMistakes: [
        'Practicar siempre en Do, Sol, La y Mi y quedarse en blanco el día que una banda toca un blues en Bb o un estándar en Eb.',
      ],
    },

    // L4.7
    {
      id: 'l-4-7',
      moduleId: 'mod-4',
      code: '4.7',
      title: 'Vídeos oficiales de Improvisación para Muñones y Cierre del Curso',
      shortTitle: 'Vídeos oficiales (p. 349)',
      bookPages: 'pp. 349–353',
      summary:
        'Acceso directo a los 11 vídeos oficiales grabados por Luis Ángel Rico («Ociosu») para complementar cada capítulo del libro y consejos finales para tu camino musical.',
      blocks: [
        { type: 'heading', text: 'Los 11 Vídeos Oficiales del Curso (p. 349)', page: 'p. 349' },
        {
          type: 'paragraph',
          text: 'Para ver y escuchar al propio autor demostrando los conceptos clave con la guitarra en mano, aquí tienes el índice íntegro de los 11 vídeos oficiales incluidos al final del libro:',
        },
        {
          type: 'videoList',
          videos: [
            { number: '00', title: 'Introducción', url: 'https://youtu.be/8fiafF6qa5E', topic: 'Presentación del enfoque y cómo estudiar el método (Módulo 1).' },
            { number: '01', title: 'Arpegio dominante (7)', url: 'https://youtu.be/tGIVWGDWc38', topic: 'Digitaciones, blues en G y práctica de las 12 vueltas (Módulo 2.5–2.6).' },
            { number: '02', title: 'Arpegio menor séptima (m7)', url: 'https://youtu.be/QQUiRT4kN0w', topic: 'Arpegio m7 y aplicación al blues menor en C (Módulo 2.7).' },
            { number: '03', title: 'Arpegio séptima mayor (maj7)', url: 'https://youtu.be/U_vf_jTXyUU', topic: 'Arpegio maj7 y progresión ii–V–I (Módulo 2.8).' },
            { number: '04', title: 'Arpegio semidisminuido (m7b5)', url: 'https://youtu.be/OwRpdSmPWUI', topic: 'Arpegio m7b5 y progresión ii–V–i menor (Módulo 2.9).' },
            { number: '05', title: 'Modos de la escala mayor', url: 'https://youtu.be/GpMklV35C-8', topic: 'Los 7 modos explicados de forma práctica en la guitarra (Módulo 3.2).' },
            { number: '06', title: 'Escala mixolidia bebop', url: 'https://youtu.be/uxYNpUbsxN4', topic: 'La nota de paso de 7ª mayor y fraseo sobre blues (Módulo 3.4).' },
            { number: '07', title: 'Mixolidia b9 b13', url: 'https://youtu.be/VAGA9KToeAs', topic: 'Escala menor armónica aplicada al V7 en menor (Módulo 3.10).' },
            { number: '08', title: 'Escala menor melódica', url: 'https://youtu.be/lMQ7g_-XNsI', topic: 'Escala alterada, lidia dominante y bloques de 4 notas (Módulo 3.11).' },
            { number: '09', title: 'Arpegio y escala disminuida', url: 'https://youtu.be/VWrYi588PdI', topic: 'Simetría cada 3 trastes, dominante 7b9 y escala h-w (Módulo 3.12).' },
            { number: '10', title: 'Escala pentatónica', url: 'https://youtu.be/t9jceGNmzQs', topic: 'Patrones avanzados y superposición de pentatónicas (Módulo 3.8).' },
          ],
        },
        {
          type: 'callout',
          variant: 'memoriza',
          title: '¡Enhorabuena! El viaje empieza ahora',
          text: 'Has recorrido las 353 páginas completas de Improvisación para Muñones. Recuerda la gran lección de todo el curso: disfruta tocando cada día, trabaja pocas cosas en profundidad, escucha con atención la armonía y haz música con cada nota. ¡Nos vemos en el mástil!',
        },
      ],
      practiceTips: [
        'Vuelve periódicamente a los módulos 2 y 3 eligiendo un único recurso por semana (ej. semana 1: enclosures en blues en G; semana 2: mixolidia bebop; semana 3: superposición pentatónica en ii-V-I).',
        'Grábate con el móvil improvisando 2 minutos al mes sobre el mismo blues: será la mejor prueba de cuánto has avanzado.',
      ],
      commonMistakes: [
        'Creer que al terminar la última página ya se domina todo: este curso es una guía de referencia para acompañarte durante meses y años de disfrute con la guitarra.',
      ],
    },
  ],
};
