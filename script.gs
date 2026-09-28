/**
 * Copia temas, tareas y materiales de un curso de Google Classroom a otro.
 *
 * REQUISITO: la cuenta que ejecuta este script debe ser PROFESORA
 * de los dos cursos (el de origen y el de destino).
 *
 * Uso:
 *   1) Abre cada clase en el navegador y copia la URL (o solo el trozo tras /c/).
 *   2) Pégalas en CURSO_ORIGEN y CURSO_DESTINO.
 *   3) Ejecuta copiarCurso().
 */

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────

// Pega aquí lo que veas en la barra de direcciones al abrir cada clase.
// Vale la URL entera  → 'https://classroom.google.com/c/NjM0OTk5MTIzNDU'
// o solo el código     → 'NjM0OTk5MTIzNDU'
// (si alguna vez tienes el ID numérico directamente, también lo acepta)

const CURSO_ORIGEN  = 'https://classroom.google.com/u/1/c/ODc4MDUwNDgzMTMz';
const CURSO_DESTINO = 'https://classroom.google.com/u/1/c/ODc4NDExOTAyOTA2';

const ORIGEN  = idDeUrl_(CURSO_ORIGEN,  'de origen');
const DESTINO = idDeUrl_(CURSO_DESTINO, 'de destino');

const OPCIONES = {
  copiarAdjuntos: true,   // true = duplica los archivos de Drive en el curso destino
                          // false = enlaza los archivos originales (más rápido, pero
                          //         si pierdes la cuenta vieja los alumnos se quedan sin nada)
  publicar:       false,  // false = todo llega como BORRADOR (recomendado)
  copiarFechas:   false,  // las fechas de entrega del curso anterior rara vez sirven
  copiarAnuncios: false,  // publicaciones del tablón
};

// ─────────────────────────────────────────────────────────────
// Descodificación del código de la URL
// ─────────────────────────────────────────────────────────────

/**
 * Convierte lo que hay en la URL de Classroom en el ID numérico que usa la API.
 * Acepta la URL completa, solo el código Base64, o ya el ID numérico.
 */
function idDeUrl_(valor, etiqueta) {
  let s = String(valor || '').trim();

  if (s.indexOf('/c/') !== -1) s = s.split('/c/')[1];   // URL completa
  s = s.split(/[/?#]/)[0];                              // quita /t/all, ?hl=es, etc.

  if (/^\d+$/.test(s)) return s;                        // ya era el ID numérico

  s = s.replace(/-/g, '+').replace(/_/g, '/');          // variante "web safe"
  s += '='.repeat((4 - s.length % 4) % 4);              // relleno que la URL omite

  let id;
  try {
    id = Utilities.newBlob(Utilities.base64Decode(s)).getDataAsString().trim();
  } catch (e) {
    throw new Error(`No pude descodificar el código del curso ${etiqueta}: "${valor}". `
      + 'Copia la URL tal cual aparece al abrir la clase.');
  }

  if (!/^\d+$/.test(id)) {
    throw new Error(`El código del curso ${etiqueta} no da un ID válido (salió "${id}"). `
      + 'Asegúrate de copiar el trozo que va justo después de /c/ en la URL.');
  }
  return id;
}

// ─────────────────────────────────────────────────────────────
// La copia
// ─────────────────────────────────────────────────────────────

function copiarCurso() {
  comprobarAcceso_();
  const mapaTemas = copiarTemas_();
  copiarTareas_(mapaTemas);
  copiarMateriales_(mapaTemas);
  if (OPCIONES.copiarAnuncios) copiarAnuncios_();
  console.log('\n— Terminado —');
}

function comprobarAcceso_() {
  [['origen', ORIGEN], ['destino', DESTINO]].forEach(([etiqueta, id]) => {
    try {
      const c = Classroom.Courses.get(id);
      console.log(`Curso ${etiqueta}: ${c.name}  (id ${id})`);
    } catch (e) {
      throw new Error(`No puedo acceder al curso ${etiqueta} (${id}). `
        + 'Comprueba que el ID es correcto y que esta cuenta es profesora del curso. '
        + 'Detalle: ' + e.message);
    }
  });
}

// ── Temas ────────────────────────────────────────────────────

function copiarTemas_() {
  const mapa = {};
  const existentes = {};

  listarTodo_(t => Classroom.Courses.Topics.list(DESTINO, { pageSize: 100, pageToken: t }), 'topic')
    .forEach(tp => existentes[tp.name] = tp.topicId);

  listarTodo_(t => Classroom.Courses.Topics.list(ORIGEN, { pageSize: 100, pageToken: t }), 'topic')
    .forEach(tp => {
      if (existentes[tp.name]) {          // el tema ya existe: lo reutilizo
        mapa[tp.topicId] = existentes[tp.name];
        return;
      }
      const nuevo = Classroom.Courses.Topics.create({ name: tp.name }, DESTINO);
      mapa[tp.topicId] = nuevo.topicId;
      console.log('Tema creado: ' + tp.name);
      Utilities.sleep(300);
    });

  return mapa;
}

// ── Tareas, preguntas y cuestionarios ────────────────────────

function copiarTareas_(mapaTemas) {
  const yaEstan = {};
  listarTodo_(
    t => Classroom.Courses.CourseWork.list(DESTINO,
         { pageSize: 100, pageToken: t, courseWorkStates: ['PUBLISHED', 'DRAFT'] }),
    'courseWork'
  ).forEach(cw => yaEstan[cw.title] = true);

  const origen = listarTodo_(
    t => Classroom.Courses.CourseWork.list(ORIGEN,
         { pageSize: 100, pageToken: t, courseWorkStates: ['PUBLISHED', 'DRAFT'], orderBy: 'updateTime asc' }),
    'courseWork'
  );

  console.log(`\n${origen.length} tareas en el curso de origen.`);

  origen.forEach(cw => {
    if (yaEstan[cw.title]) {
      console.log('· Ya existía, la salto: ' + cw.title);
      return;
    }

    const nueva = {
      title: cw.title,
      description: cw.description,
      workType: cw.workType,
      state: OPCIONES.publicar ? 'PUBLISHED' : 'DRAFT',
      assigneeMode: 'ALL_STUDENTS',
      materials: convertirMateriales_(cw.materials),
    };

    if (cw.maxPoints) nueva.maxPoints = cw.maxPoints;
    if (cw.submissionModificationMode) nueva.submissionModificationMode = cw.submissionModificationMode;
    if (cw.topicId && mapaTemas[cw.topicId]) nueva.topicId = mapaTemas[cw.topicId];
    if (cw.workType === 'MULTIPLE_CHOICE_QUESTION' && cw.multipleChoiceQuestion) {
      nueva.multipleChoiceQuestion = cw.multipleChoiceQuestion;
    }
    if (OPCIONES.copiarFechas && cw.dueDate && cw.dueTime) {
      nueva.dueDate = cw.dueDate;
      nueva.dueTime = cw.dueTime;
    }

    try {
      Classroom.Courses.CourseWork.create(nueva, DESTINO);
      console.log('OK  ' + cw.title);
    } catch (e) {
      console.log('ERROR  ' + cw.title + ' → ' + e.message);
    }
    Utilities.sleep(500);   // para no chocar con los límites de la API
  });
}

// ── Materiales ───────────────────────────────────────────────

function copiarMateriales_(mapaTemas) {
  const yaEstan = {};
  listarTodo_(
    t => Classroom.Courses.CourseWorkMaterials.list(DESTINO,
         { pageSize: 100, pageToken: t, courseWorkMaterialStates: ['PUBLISHED', 'DRAFT'] }),
    'courseWorkMaterial'
  ).forEach(m => yaEstan[m.title] = true);

  listarTodo_(
    t => Classroom.Courses.CourseWorkMaterials.list(ORIGEN,
         { pageSize: 100, pageToken: t, courseWorkMaterialStates: ['PUBLISHED', 'DRAFT'] }),
    'courseWorkMaterial'
  ).forEach(m => {
    if (yaEstan[m.title]) return;

    const nuevo = {
      title: m.title,
      description: m.description,
      state: OPCIONES.publicar ? 'PUBLISHED' : 'DRAFT',
      assigneeMode: 'ALL_STUDENTS',
      materials: convertirMateriales_(m.materials),
    };
    if (m.topicId && mapaTemas[m.topicId]) nuevo.topicId = mapaTemas[m.topicId];

    try {
      Classroom.Courses.CourseWorkMaterials.create(nuevo, DESTINO);
      console.log('OK (material)  ' + m.title);
    } catch (e) {
      console.log('ERROR (material)  ' + m.title + ' → ' + e.message);
    }
    Utilities.sleep(500);
  });
}

// ── Tablón ───────────────────────────────────────────────────

function copiarAnuncios_() {
  listarTodo_(
    t => Classroom.Courses.Announcements.list(ORIGEN,
         { pageSize: 100, pageToken: t, announcementStates: ['PUBLISHED', 'DRAFT'], orderBy: 'updateTime asc' }),
    'announcements'
  ).forEach(a => {
    try {
      Classroom.Courses.Announcements.create({
        text: a.text,
        materials: convertirMateriales_(a.materials),
        state: OPCIONES.publicar ? 'PUBLISHED' : 'DRAFT',
        assigneeMode: 'ALL_STUDENTS',
      }, DESTINO);
      console.log('OK (anuncio)');
    } catch (e) {
      console.log('ERROR (anuncio) → ' + e.message);
    }
    Utilities.sleep(400);
  });
}

// ── Adjuntos ─────────────────────────────────────────────────

function convertirMateriales_(materiales) {
  if (!materiales) return [];
  const salida = [];

  materiales.forEach(m => {
    if (m.link) {
      salida.push({ link: { url: m.link.url } });

    } else if (m.youtubeVideo) {
      salida.push({ youtubeVideo: { id: m.youtubeVideo.id } });

    } else if (m.form) {
      // La API no permite adjuntar un formulario como tal: se adjunta como enlace.
      salida.push({ link: { url: m.form.formUrl } });
      console.log('  · Formulario adjuntado como enlace: ' + (m.form.title || m.form.formUrl));

    } else if (m.driveFile) {
      const df = m.driveFile.driveFile;
      const modo = m.driveFile.shareMode || 'VIEW';
      let id = df.id;

      if (OPCIONES.copiarAdjuntos) {
        try {
          id = DriveApp.getFileById(df.id).makeCopy(df.title, carpetaDestino_()).getId();
        } catch (e) {
          console.log('  · No pude duplicar "' + df.title + '" (' + e.message + '). Enlazo el original.');
        }
      }
      salida.push({ driveFile: { driveFile: { id: id }, shareMode: modo } });
    }
  });

  return salida;
}

let _carpeta = null;
function carpetaDestino_() {
  if (_carpeta) return _carpeta;
  const c = Classroom.Courses.get(DESTINO);
  _carpeta = (c.teacherFolder && c.teacherFolder.id)
    ? DriveApp.getFolderById(c.teacherFolder.id)
    : DriveApp.getRootFolder();
  return _carpeta;
}

// ── Utilidad de paginación ───────────────────────────────────

function listarTodo_(fn, campo) {
  const out = [];
  let token = null;
  do {
    const r = fn(token);
    (r[campo] || []).forEach(x => out.push(x));
    token = r.nextPageToken;
  } while (token);
  return out;
}
