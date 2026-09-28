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
