# Retroalimentación · Fase 0 (Alcance y separación)

**Proyecto:** Health Track (team `h-tracker`)
**Integrantes:** Juan Camilo Bernal Gordillo, Laura Marcela Quintero Poveda, Cristian Andrés Muñoz Montenegro y Carlos Andrés Zuluaga Acuña (los cuatro presentaron)
**Revisión:** viernes 30 de octubre de 2026 · Docente Jesús Ariel González Bonilla

La documentación está muy bien trabajada y el reparto entre los cuatro es parejo. Lo que falta, y es lo más importante según las reglas del proyecto, es **separar el código**. Los puntos siguientes son para resolver antes del cierre de la Fase 0 (domingo 1 de noviembre, 23:59) y de la Fase 1 (domingo 8 de noviembre, 23:59).

## 1. Lo que ya está bien

- **La ficha del proyecto está completa** en el README de `healt-track-docs`: 13 historias, 9 pantallas, 4 entidades con sus relaciones, 2 roles, 21 endpoints y la regla de negocio de una sola sesión activa por estudiante, garantizada en la base de datos. Es un buen contrato.
- **El cambio de tecnología está justificado.** El ADR-012 explica por qué siguen con React Native y Expo en lugar de Ionic React, y cómo resuelven el arranque en el navegador. La guía lo acepta si hay ADR, y aquí lo hay.
- **El plan de separación está escrito.** El ADR-009 define los repositorios y propone `git subtree split` para conservar el historial, que es justo lo que pide la guía.
- **Trabajo en equipo visible.** Desde el 26 de octubre cada integrante tiene 12 commits en `healt-track-docs`, y los cambios entran por PR.

## 2. Lo urgente: la separación de repositorios (regla obligatoria)

La guía es clara: **un repositorio de código único con todo dentro no cumple la separación obligatoria**, y el proyecto de aula es precondición del corte 3.

Hoy la separación solo existe en el papel:

- `healt-track-app`, `healt-track-api`, `healt-track-db` y `healt-track-infra` **no existen** en la organización. Los enlaces de la ficha y de la tabla de repositorios del README llevan a una página de error.
- `h-tracker` sigue siendo el monorepo del corte 1, con `backend/` y `mobile/` juntos. Su último cambio fue el 7 de septiembre.

Pasos, en este orden:

1. Crear en `code-corhuila` los repositorios **privados** `healt-track-app`, `healt-track-api` y `healt-track-infra` (y `healt-track-db`, si mantienen la decisión del ADR-009), asociarlos al team `h-tracker` y agregar a los cuatro integrantes como colaboradores.
2. Llevar `mobile/` a `healt-track-app` y `backend/` a `healt-track-api` con `git subtree split --prefix=<carpeta>`, para que cada commit anterior conserve su autor y su fecha. No copien las carpetas a mano: el código aparecería como un solo commit y se perdería el historial.
3. Armar `healt-track-infra` con el `docker-compose.yml` (base de datos y API), el `.env.example` y el manual de implementación en el README. En infra no va ninguna línea de DDL: el esquema vive en las migraciones de Prisma, dentro de la API.
4. Archivar `h-tracker` en GitHub cuando la separación esté hecha, como dice su propio README.
5. Verificar que los enlaces de la ficha abran.

## 3. Pendiente de la revisión del corte 1

En la revisión del corte 1 se pidió sacar el código del MVP de `05-release/` en `healt-track-docs`. **Sigue ahí:** `05-release/mvp/` tiene 65 archivos de código (`backend/` y `mobile/`). Ese código ya vive en `h-tracker` y pronto estará en app y api. Retírenlo del repositorio de documentación y dejen en `05-release/` solo los registros de release.

Las otras dos recomendaciones de esa revisión quedaron resueltas: la política de ramas ya está definida en el README y en `00-governance/git-conventions.md`, y la sección 03 volvió a las fichas de endpoint y de entidad.

## 4. Distancia entre la ficha y el código

La ficha es el contrato, y lo que se califica es que el código la cumpla. Hoy el código cubre una parte pequeña:

| | Ficha (contrato) | Código actual (`h-tracker`) |
|---|---|---|
| Historias | 13 (HU1 a HU13) | 3 (HU5, HU6 y HU7: inicio de sesión, listar y crear estudiantes) |
| Entidades | 4 (`User`, `Student`, `Session`, `MuscleGroup`) | 2 (`Trainer` y `Student`) |
| Endpoints | 21 | Los de autenticación y estudiantes |
| Roles | ADMIN y TRAINER | Solo entrenador |

Para el domingo 8 de noviembre todas las funcionalidades de la ficha deben funcionar contra la API real, y `docker compose up` debe levantar la base de datos y la API. Es bastante trabajo para una semana: repártanlo ya, por repositorio y por historia, según los responsables que declararon en la ficha.

## 5. Aporte de cada integrante en el código

Todo el código actual está en un solo commit de una sola cuenta (`feat(mvp)`, 6 de septiembre). El `subtree split` conserva eso tal cual. Desde ahora, el aporte de Laura, Cristian y Carlos tiene que verse **en los commits** de app, api e infra, no solo en la documentación: en la sustentación (lunes 9 de noviembre) se pregunta a cualquiera de los cuatro por cualquier parte del código.

## 6. Detalles para revisar

- **Sesión en el navegador.** El ADR-012 guarda el token en `localStorage` cuando la app corre en web, porque `expo-secure-store` no funciona ahí. Es aceptable para el arranque en navegador; déjenlo explícito en el manual de uso y en la sección de seguridad.
- **Etiqueta `v1.0.0`.** Se evalúa en la rama `main` de cada repositorio de código. Si trabajan con `develop` y `qa`, planeen el paso a `main` antes del domingo 15 de noviembre.
- **Secretos.** Al separar, revisen que ningún `.env` real viaje en el historial. Solo debe quedar el `.env.example`.
