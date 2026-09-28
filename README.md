# Copiar un curso de Google Classroom con Google Apps Script

Este proyecto permite copiar contenido de un curso de **Google Classroom** a otro mediante **Google Apps Script**.

El script copia:

- Temas.
- Tareas.
- Preguntas.
- Cuestionarios.
- Materiales.
- Archivos adjuntos de Google Drive.
- Opcionalmente, anuncios del tablón.

Por defecto:

- Los contenidos se crean como **borradores**.
- No se copian las fechas de entrega.
- No se copian los anuncios.
- Los archivos adjuntos se duplican en el curso de destino.

> [!IMPORTANT]
> **Recomendación:** antes de utilizar el script con un curso real, crea un curso vacío de prueba y realiza una primera ejecución sobre él.
>
> El script no modifica ni elimina contenido del curso de origen, pero hacer una prueba previa permite comprobar que los temas, tareas, materiales y adjuntos se copian como esperas.

---

# Requisitos

Para poder utilizar este script necesitas:

1. Una cuenta de Google.
2. Ser **profesor/a** del curso de origen.
3. Ser **profesor/a** del curso de destino.
4. Tener acceso a Google Classroom.
5. Crear un proyecto en Google Apps Script.
6. Activar el servicio avanzado **Google Classroom API**.

No es necesario tener conocimientos de programación.

---

# 1. Crear el curso de destino

Antes de ejecutar el script debes tener:

- Un curso de Google Classroom que actuará como **curso de origen**.
- Otro curso de Google Classroom que actuará como **curso de destino**.

El curso de destino puede estar vacío.

El script copiará allí los contenidos del curso de origen.

---

# 2. Abrir Google Apps Script

Accede a:

https://script.google.com

Inicia sesión con tu cuenta de Google.

Es importante utilizar la misma cuenta con la que eres profesor/a de los dos cursos de Google Classroom.

Pulsa:

**Nuevo proyecto**

---

# 3. Copiar el código del script

En este repositorio encontrarás el archivo:

`script.gs`

Abre el archivo y copia todo su contenido.

En Google Apps Script aparecerá normalmente un archivo llamado:

`Código.gs`

Borra el contenido que aparece por defecto:

```javascript
function myFunction() {

}
```

y pega en su lugar todo el contenido de `script.gs`.

---

# 4. Guardar el proyecto

Pulsa el botón **Guardar** o utiliza:

```text
Ctrl + S
```

Puedes poner al proyecto un nombre fácil de identificar, por ejemplo:

```text
Copiar curso de Google Classroom
```

---

# 5. Activar Google Classroom API

Este paso es obligatorio.

El script utiliza la API de Google Classroom para leer y crear temas, tareas y materiales.

En la barra lateral izquierda de Google Apps Script busca:

**Servicios**

Pulsa el botón:

**+**

Aparecerá una lista de servicios disponibles.

Busca:

**Google Classroom API**

Selecciónalo y pulsa:

**Añadir**

Cuando termine, debería aparecer un nuevo servicio llamado aproximadamente:

```text
Classroom
```

en el apartado de servicios del proyecto.

> Si no se añade este servicio, el script mostrará errores relacionados con `Classroom`.

---

# 6. Obtener las URL de los cursos

Abre el curso de origen en Google Classroom.

Copia la URL que aparece en el navegador.

Será parecida a:

```text
https://classroom.google.com/u/1/c/ODc4MDUwNDgzMTMz
```

Después abre el curso de destino y copia también su URL.

---

# 7. Indicar los cursos en el script

Al principio del archivo encontrarás estas dos líneas:

```javascript
const CURSO_ORIGEN  = 'https://classroom.google.com/u/1/c/ODc4MDUwNDgzMTMz';
const CURSO_DESTINO = 'https://classroom.google.com/u/1/c/ODc4NDExOTAyOTA2';
```

Sustituye las direcciones por las URL de tus cursos.

Por ejemplo:

```javascript
const CURSO_ORIGEN  = 'URL_DEL_CURSO_ORIGEN';
const CURSO_DESTINO = 'URL_DEL_CURSO_DESTINO';
```

No modifiques las comillas simples `'`.

El resultado debe quedar de forma similar a:

```javascript
const CURSO_ORIGEN  = 'https://classroom.google.com/u/0/c/123456789';
const CURSO_DESTINO = 'https://classroom.google.com/u/0/c/987654321';
```

---

# 8. Configurar qué quieres copiar

Debajo de las URL encontrarás:

```javascript
const OPCIONES = {
  copiarAdjuntos: true,
  publicar:       false,
  copiarFechas:   false,
  copiarAnuncios: false,
};
```

En principio se recomienda **no modificar estas opciones**.

## copiarAdjuntos

```javascript
copiarAdjuntos: true
```

Si está en `true`, el script intenta crear una copia de los archivos de Google Drive en el curso de destino.

Es la opción recomendada.

Si se cambia a:

```javascript
copiarAdjuntos: false
```

el curso de destino utilizará los archivos originales.

---

## publicar

```javascript
publicar: false
```

Es la opción recomendada.

Todo el contenido se crea como **borrador**.

Así podrás revisar las tareas antes de publicarlas para los alumnos.

Si se cambia a:

```javascript
publicar: true
```

el script intentará publicar directamente los contenidos.

---

## copiarFechas

```javascript
copiarFechas: false
```

Las fechas de entrega del curso anterior normalmente no tienen sentido en el nuevo curso.

Por eso se recomienda dejarlo en `false`.

---

## copiarAnuncios

```javascript
copiarAnuncios: false
```

Por defecto no se copian las publicaciones del tablón.

Si quieres copiarlas puedes cambiarlo a:

```javascript
copiarAnuncios: true
```

---

# 9. Ejecutar el script

En la parte superior de Google Apps Script encontrarás un desplegable con las funciones disponibles.

Selecciona:

```text
copiarCurso
```

Después pulsa:

**▶ Ejecutar**

---

# 10. Autorizar el script

La primera vez que ejecutes el programa Google solicitará permisos.

Esto es normal.

El script necesita permisos para acceder a:

- Google Classroom.
- Google Drive.

Pulsa:

**Revisar permisos**

Selecciona tu cuenta de Google.

---

# 11. Si aparece "Google no ha verificado esta aplicación"

En algunos casos Google puede mostrar un aviso similar a:

> Google no ha verificado esta aplicación

Esto puede ocurrir porque se trata de un script creado internamente y no de una aplicación publicada en Google Marketplace.

Pulsa:

**Configuración avanzada**

Después pulsa:

**Ir a [nombre del proyecto] (no seguro)**

La expresión **"no seguro"** es el mensaje estándar que utiliza Google para aplicaciones que no han pasado por su proceso público de verificación.

Después revisa los permisos y pulsa:

**Permitir**

---

# 12. Ejecutar nuevamente

Después de conceder los permisos es posible que tengas que volver a pulsar:

**▶ Ejecutar**

Comprueba que sigue seleccionada la función:

```text
copiarCurso
```

---

# 13. Comprobar el progreso

En la parte inferior de Google Apps Script aparecerá el:

**Registro de ejecución**

Durante el proceso pueden aparecer mensajes como:

```text
Curso origen: Desarrollo Web
Curso destino: Desarrollo Web 2026-2027
Tema creado: Docker
Tema creado: AWS
OK  Actividad Docker
OK  Práctica AWS
OK (material)  Introducción a Kubernetes
```

Cuando termine aparecerá:

```text
— Terminado —
```

y Google Apps Script indicará que la ejecución ha finalizado.

---

# 14. Revisar Google Classroom

Abre el curso de destino.

En **Trabajo de clase** deberías encontrar:

- Los temas.
- Las tareas.
- Los cuestionarios.
- Los materiales.

Como el script está configurado por defecto con:

```javascript
publicar: false
```

los contenidos aparecerán como **borradores**.

Esto permite revisar:

- Fechas.
- Instrucciones.
- Puntuaciones.
- Adjuntos.
- Orden de los temas.

antes de publicarlos para los alumnos.

---

# ¿Qué ocurre con los archivos de Google Drive?

Por defecto:

```javascript
copiarAdjuntos: true
```

El script intenta duplicar los archivos de Google Drive.

De esta forma, el nuevo curso no depende de los archivos del curso anterior.

Si algún archivo no puede copiarse, el script intentará utilizar el archivo original y mostrará un mensaje en el registro de ejecución.

---

# ¿Qué ocurre con Google Forms?

La API de Google Classroom no permite copiar un formulario exactamente como un archivo normal.

Cuando el script encuentra un Google Form, lo incorpora al nuevo curso como **enlace al formulario original**.

Por tanto, es recomendable revisar manualmente los formularios después de realizar la copia.

---

# Evitar duplicados

El script intenta evitar que se vuelvan a copiar contenidos que ya existen.

Para las tareas y materiales compara principalmente sus títulos.

Por ejemplo, si en el curso de destino ya existe:

```text
Actividad Docker
```

el script puede mostrar:

```text
· Ya existía, la salto: Actividad Docker
```

y no volverá a crearla.

---

# Si aparece un error

Puedes consultar el **Registro de ejecución** en Google Apps Script.

Algunos errores habituales son:

## No existe el servicio Classroom

Ejemplo:

```text
Classroom is not defined
```

Solución:

Ve a:

**Servicios → + → Google Classroom API → Añadir**

---

## No se puede acceder al curso

Puede aparecer un mensaje parecido a:

```text
No puedo acceder al curso de origen
```

Comprueba:

- Que la URL del curso es correcta.
- Que estás utilizando la cuenta correcta.
- Que eres profesor/a del curso.

---

## No se puede copiar un archivo

Puede aparecer:

```text
No pude duplicar "archivo.pdf"
```

Normalmente significa que tu cuenta no tiene permisos suficientes sobre ese archivo.

El script intentará enlazar el archivo original.

---

# Resumen rápido

Si ya conoces el proceso, estos son los pasos principales:

1. Crear el curso de destino en Google Classroom.
2. Entrar en `script.google.com`.
3. Crear un nuevo proyecto.
4. Copiar `script.gs`.
5. Pegar el código en Google Apps Script.
6. Añadir **Google Classroom API** en `Servicios`.
7. Cambiar `CURSO_ORIGEN`.
8. Cambiar `CURSO_DESTINO`.
9. Guardar.
10. Seleccionar `copiarCurso`.
11. Pulsar **Ejecutar**.
12. Autorizar los permisos la primera vez.
13. Esperar a que finalice.
14. Revisar los borradores en el curso de destino.

---

# Configuración recomendada

Para la mayoría de profesores se recomienda dejar:

```javascript
const OPCIONES = {
  copiarAdjuntos: true,
  publicar:       false,
  copiarFechas:   false,
  copiarAnuncios: false,
};
```

Es la configuración más segura porque:

- Duplica los archivos.
- Deja las actividades como borradores.
- No reutiliza fechas antiguas.
- No llena el tablón con anuncios de cursos anteriores.

---

# Importante

Este script **no elimina contenido** del curso de origen.

El curso original permanece intacto.

El script únicamente lee sus contenidos y crea nuevos elementos en el curso de destino.
