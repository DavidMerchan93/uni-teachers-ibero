# UniProject — Registro de Docentes

Aplicación web para registrar, consultar, editar y eliminar docentes universitarios. Desarrollada como actividad del Módulo 1 de Análisis y Diseño de Sistemas.

## Tecnologías

| Capa       | Tecnología                  |
|------------|-----------------------------|
| Frontend   | React                       |
| Backend    | Node.js + Express           |
| Base de datos | MySQL (via mysql2)       |

## Estructura del proyecto

```
UniProject/
├── client/   # Aplicación React (frontend)
└── server/   # API REST con Express (backend)
```

## Requisitos previos

- Node.js v18+
- MySQL corriendo localmente

## Configuración

1. Clona el repositorio.
2. Crea el archivo `server/.env` con las credenciales de tu base de datos:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_de_datos
```

3. Crea la tabla en MySQL:

```sql
CREATE TABLE docentes (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100) NOT NULL,
  correo            VARCHAR(100) NOT NULL,
  telefono          VARCHAR(20)  NOT NULL,
  titulo            VARCHAR(50)  NOT NULL,
  area_academica    VARCHAR(100) NOT NULL,
  dedicacion        VARCHAR(50)  NOT NULL,
  anios_experiencia INT          NOT NULL
);
```

## Instalación y ejecución

**Backend** (puerto 4000 por defecto):

```bash
cd server
npm install
npm run dev
```

**Frontend** (puerto 3000 de React):

```bash
cd client
npm install
npm start
```

## Endpoints de la API

| Método | Ruta             | Descripción               |
|--------|------------------|---------------------------|
| GET    | /docentes        | Listar todos los docentes |
| GET    | /docentes/:id    | Obtener un docente por ID |
| POST   | /docentes        | Crear un nuevo docente    |
| PUT    | /docentes/:id    | Actualizar un docente     |
| DELETE | /docentes/:id    | Eliminar un docente       |
