
# TechFlow – Task Management Dashboard  
Hackathon #2 – Desarrollo Basado en Plataformas (DBP)  
Equipo: Rafael Choque, Sebastián Loli, Isabella Castillo

---

## Descripción del Proyecto

TechFlow es un dashboard web para la gestión de proyectos y tareas dentro de equipos de trabajo.  
Permite registrar usuarios, visualizar estadísticas en tiempo real, administrar proyectos y manejar tareas con filtros avanzados.  

Este frontend consume la API oficial de TechFlow (Railway), implementando autenticación segura mediante JWT y siguiendo buenas prácticas de React + TypeScript + Tailwind CSS.

---

## Tecnologías Utilizadas

### Frontend
- React 18+
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios  
- JSON Web Tokens (JWT)

### Backend (solo consumo)
API oficial:  
https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1

---

## Instalación del Proyecto

Clonar el repositorio:

```bash
git clonehttps://github.com/RafaCH1906/HACK2.git
cd HACK2
````

Instalar dependencias:

```bash
npm install
```

---

## Correr el Proyecto Localmente

```bash
npm run dev
```

Luego abrir en el navegador:

```
http://localhost:5173
```

---

## Deploy

Enlace del deploy:
[Agregar aquí el link del deploy]

---

## Credenciales de Prueba (si aplica)

```
email: test@example.com  
password: 123456
```

---

## Features Implementadas

### 1. Autenticación

* Registro de usuarios
* Inicio de sesión
* Almacenamiento del token JWT
* Rutas protegidas
* Cierre de sesión
* Página de perfil

### 2. Dashboard

* Estadísticas generales (total de tareas, completadas, pendientes, vencidas)
* Acciones rápidas (crear tarea, ver proyectos)
* Actividad reciente del equipo

### 3. Gestión de Proyectos

* Listado de proyectos con paginación
* Creación de nuevos proyectos
* Visualización de detalles del proyecto
* Edición de proyecto
* Eliminación con confirmación
* Búsqueda y filtro por nombre o estado

Estados soportados: ACTIVE, COMPLETED, ON_HOLD

### 4. Gestión de Tareas

* Listado de tareas
* Filtros avanzados:

    * Estado: TODO, IN_PROGRESS, COMPLETED
    * Prioridad: LOW, MEDIUM, HIGH, URGENT
    * Proyecto
    * Usuario asignado
* Creación de tareas
* Actualización de información
* Asignación de tareas a miembros
* Eliminación de tareas
* Marcar tarea como completada
* Detalle de tarea

---

## Estructura del Proyecto

```
src/
├── components/
├── pages/
├── services/
├── context/
├── hooks/
├── types/
└── utils/
```

---

## Configuración de API

Todas las peticiones utilizan:


---

## Equipo

* Rafael Choque
* Sebastián Loli
* Isabella Castillo

---

## Licencia

Proyecto desarrollado únicamente con fines académicos para la Hackathon #2 del curso DBP.

```

