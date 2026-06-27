# PrediGoal AI — Mundial FIFA 2026

Plataforma web de predicciones inteligentes para el Mundial FIFA 2026.  
**Stack:** Vue 3 + Vite · Express.js · Mock ML Service

---

## Estructura del proyecto

```
PrediGoal AI/
├── backend/          # API Express.js
│   ├── config/       # Configuración (puerto, etc.)
│   ├── routes/       # Rutas: health, teams, matches, predictions
│   ├── controllers/  # Lógica de negocio
│   └── data/         # teams.json (48 equipos), matches.json (72 partidos)
└── frontend/         # App Vue 3 + Vite
    └── src/
        ├── components/   # NavBar, TeamCard
        ├── composables/  # useFavorites (localStorage)
        ├── pages/        # HomePage, TeamPage, MatchesPage
        ├── router/       # Vue Router
        └── services/     # Cliente API (axios)
```

## Levantar el proyecto

**Backend:**
```bash
cd backend
npm install
npm run dev     # puerto 3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev     # puerto 5173
```

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/teams` | 48 equipos del Mundial 2026 |
| GET | `/api/teams/:id` | Detalle de un equipo |
| GET | `/api/matches` | 72 partidos fase de grupos |
| GET | `/api/matches/team/:id` | Partidos de un equipo |
| GET | `/api/predict?home=:id&away=:id` | Predicción IA del partido |

## Sprint 1 — Historias completadas

| # | Historia | Estado |
|---|----------|--------|
| 1 | Definir requerimientos iniciales | ✅ |
| 3 | Cargar lista de equipos participantes | ✅ |
| 4 | Crear estructura del backend | ✅ |
| 5 | Crear estructura del frontend | ✅ |
| 6 | Crear diseño inicial de la aplicación | ✅ |
| 16 | Realizar revisión del Sprint 1 | ✅ |

## Sprint 2 — Historias completadas

| # | Historia | Estado |
|---|----------|--------|
| 7 | Cargar calendario de partidos | ✅ |
| 8 | Mostrar equipos en la página de inicio | ✅ |
| 9 | Seleccionar equipo favorito | ✅ |
| 10 | Crear página individual del equipo | ✅ |
| 15 | Probar funcionalidades principales | ✅ |
| 21 | Mejorar diseño visual | ✅ |
| 22 | Crear filtro por grupo o confederación | ✅ |
| 16b | Realizar revisión del Sprint 2 | ✅ |
