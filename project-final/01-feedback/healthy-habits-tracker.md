# Retroalimentación · Fase 0 (Alcance y separación)

**Proyecto:** Healthy Habits Tracker (team `healthy-habits-tracker`)
**Integrantes:** Juan José Horta Vanegas y Daniel Felipe Fernández Rojas (Javier Esteban Ortiz López se retiró del proyecto)
**Revisión:** viernes 30 de octubre de 2026 · Docente Jesús Ariel González Bonilla

La app tiene una interfaz bien pensada: ocho pantallas, componentes reutilizables y un tablero con métricas. Pero hoy **todo es una maqueta**: no hay API, no hay base de datos y el inicio de sesión deja entrar a cualquiera. Además, los repositorios nuevos están vacíos y falta la ficha del proyecto. Los puntos siguientes son para resolver antes del cierre de la Fase 0 (domingo 1 de noviembre, 23:59) y de la Fase 1 (domingo 8 de noviembre, 23:59).

## 1. Lo que ya está bien

- **La interfaz está completa en pantallas:** inicio de sesión, registro, tablero, hábitos, metas, registros, historial y nuevo registro, con navegación por pestañas.
- **Buenos componentes base:** `Card`, `StatCard`, `Badge`, `ChipSelector`, `EmptyState` y `WeekChart`, con un tema de colores centralizado.
- **El modelo de datos está muy trabajado:** seis entidades (Usuario, CategoriaHabito, Habito, Meta, RegistroDiario y Racha), con restricciones, llaves foráneas, baja lógica e índices, y consultas para comprobar que el documento coincide con la base.
- **El contrato de la API existe:** `api-contract.md` define 13 endpoints (E-01 a E-13).
- **Registraron el cambio de equipo** en `00-governance` (29 de octubre), respetando la autoría de lo que ya hizo Esteban. Así se hace.

## 2. Fase 0: lo que pide la guía y cómo está

| Requisito de la Fase 0 | Estado |
|---|---|
| Ficha del proyecto (sección 5 de la guía) al inicio del README del `-docs` | **No está.** El README sigue siendo el del marco genérico, y su primera línea dice «Full-stack web app… built with NestJS, Next.js», que no es su stack |
| Repositorios `-app`, `-api` e `-infra` creados | **Creados el 29 de octubre, pero vacíos:** `habits-tracker-app`, `habits-tracker-api` y `habits-tracker-infra` no tienen ni un commit |
| Código repartido desde el repositorio actual, con historial | **No.** `healthy-habits-tracker` sigue igual que el 7 de septiembre |
| Integrantes como colaboradores | **Incompleto.** En los tres repositorios nuevos solo está Juan José. Daniel no tiene acceso ni a ellos ni a `healthy-habits-tracker`, y en el team de GitHub solo aparece Juan José |
| Repositorios en el team del proyecto | **No.** Los tres repositorios nuevos no están asociados al team `healthy-habits-tracker` |

Pasos:

1. Copiar la ficha de la sección 5 de la guía al inicio del README de `habits-tracker-docs` y llenarla: funcionalidades (lista cerrada con su historia de usuario), pantallas, entidades, **dos roles como mínimo**, regla de negocio propia, endpoints, plugin o almacenamiento local, tecnologías, enlaces a los repositorios y responsable de cada uno. Corrijan también la primera línea del README.
2. Agregar a Daniel como colaborador de todos los repositorios y asociar los tres nuevos al team.
3. Llevar el código de `healthy-habits-tracker` a `habits-tracker-app` **con su historial** (`git subtree split` o `git filter-repo`), no copiándolo a mano.
4. Empezar `habits-tracker-api` y `habits-tracker-infra` desde cero: hoy no existe nada de backend (ver punto 4).
5. Decidir qué pasa con el acceso de Esteban, que sigue como administrador de `habits-tracker-docs` y `healthy-habits-tracker`.

## 3. Primero la documentación, después el código

La regla del curso es que nada se construye sin estar especificado antes en el `-docs`.

| Momento | Qué pasó | ¿Se cumplió? |
|---|---|---|
| Corte 1 (septiembre) | El código de la app se subió el 7 de septiembre («Entrega inicial MVP») y una copia en `05-release/` del `-docs` ese mismo día. Las pantallas, los ADR, el contrato y el modelo de datos se escribieron **después**, entre el 19 y el 25 de septiembre. | **No:** primero se hizo el código y después se documentó |
| Corte 3 (octubre) | No hay especificación nueva: solo el registro del cambio de equipo. El PR #12 con las fichas de endpoint E-01 a E-13 sigue abierto desde el 25 de septiembre, sin fusionar. | **Pendiente** |

Para la Fase 1 inviertan el orden: primero la ficha, los endpoints y la regla de negocio en el `-docs` (y fusionen o cierren el PR #12), y después el código de la API.

## 4. Control de validación: cuánto del documento ya existe en el código

| Elemento | Documentado | En el código | Cumplimiento |
|---|---|---|---|
| Pantallas | 8 | 8 (con datos de prueba en memoria) | 100 % en interfaz, 0 % conectado |
| Endpoints | 13 (E-01 a E-13) | 0: no hay API | 0 % |
| Entidades en base de datos | 6 | 0: no hay base de datos; todo sale de `mockData.ts` | 0 % |
| Roles | Ninguno definido (la guía pide al menos dos) | Ninguno | 0 % |
| Inicio de sesión con token | Documentado (`authentication.md`, E-01) | Simulado (ver punto 5) | 0 % |
| Persistencia | ADR-004 | Los datos se pierden al cerrar la app | 0 % |
| Arranque con `docker compose up` | — | No hay `-infra` | 0 % |

Es el equipo con más camino por recorrer para el domingo 8 de noviembre: tienen que construir la API, la base de datos y la infraestructura completas, y conectar la app. Repártanlo ya. Por ejemplo: Daniel en la API y la base, Juan José en conectar la app y en infra, y los dos revisando los PR del otro.

## 5. El inicio de sesión y el token

Hoy **no hay token**. En `AppContext.tsx` la función `iniciarSesion` acepta **cualquier correo y contraseña que no estén vacíos** y entra como el usuario de prueba («Sin backend todavia: cualquier credencial no vacia entra como usuario demo»). El registro tampoco guarda nada.

Además:

- **Las pantallas privadas no están protegidas.** La navegación arranca en `Login`, pero `Tabs` está registrada en el mismo stack sin ninguna condición de sesión. Protejan las rutas en un solo lugar, según si hay sesión o no.
- **La sesión no se conserva:** al cerrar la app se pierde.
- **El endpoint E-13 `GET /dashboard/usuario/:usuarioId` recibe el id del usuario en la ruta.** Así cualquiera podría pedir el tablero de otro cambiando el número. El usuario debe salir del token (`GET /dashboard`), no de la URL.

Lo que tiene que existir para la Fase 1:

1. `POST /auth/login` en la API: valida contra la base, con la contraseña guardada con hash (bcrypt), y devuelve un **JWT** que incluya el id y el **rol** del usuario.
2. Un middleware en la API que exija `Authorization: Bearer <token>` y responda **401** sin token o con token inválido, y **403** con el rol equivocado.
3. En la app, un solo cliente HTTP que agregue el token a cada petición, lo guarde de forma segura (y con respaldo para web, porque la app debe arrancar en el navegador) y cierre la sesión ante un 401.
4. Pruebas de esos casos: sin token, token vencido y rol equivocado.

## 6. Las tarjetas: mejorar la visualización

Ya tienen una buena base con `Card` y `StatCard` (franja de color, métrica grande, etiqueta). Para que la app se vea mejor y comunique más:

- **Tarjeta de hábito:** nombre, categoría como chip, **progreso del día frente a la meta** (por ejemplo, un anillo o barra «6 de 8 vasos»), racha actual con un indicador visible y un botón de registro rápido.
- **Tarjeta de meta:** valor objetivo, avance acumulado y estado (activa, cumplida o pausada) con color.
- **Tablero:** las `StatCard` con datos reales de la API (hábitos cumplidos hoy, mejor racha, porcentaje semanal) y el `WeekChart` alimentado por `GET /registros`.
- **Estados en la misma tarjeta:** cada pantalla que consulte la API debe mostrar carga (esqueleto con la forma de la tarjeta), vacío (`EmptyState`) y error con un botón de reintentar.

Documenten primero estas tarjetas en `02-code-and-ui/components/` (punto 3).

## 7. Pendientes de la revisión del corte 1

| Recomendación del corte 1 | Estado hoy |
|---|---|
| Completar la tabla de estados de las 8 pantallas, con el estado sin conexión | **Pendiente:** solo 3 de 8 pantallas mencionan estados o el modo sin conexión |
| Sacar el proyecto Expo de `05-release/` del `-docs` | **Pendiente:** `05-release/healthy-habits-tracker/` sigue con el código de la app |
| Retirar o enlazar las fichas sueltas de `endpoints/` y `entities/` | **Pendiente:** siguen `endpoint-post-auth-login.md`, `endpoint-post-registro.md` y `entity-registros.md`, y el PR #12 con las fichas nuevas no se ha fusionado |

## 8. Tecnología y aporte de cada integrante

- **La app usa React Native con Expo, y el énfasis del curso es Ionic React.** La guía lo acepta si un ADR lo justifica, pero el ADR-002 no compara con Ionic React ni explica cómo cumplen el arranque en el navegador con un comando. Actualícenlo o escriban un ADR nuevo que lo reemplace.
- **Aporte:** todo el código actual es de Juan José (un commit del 7 de septiembre). Daniel ha aportado en la documentación (modelo de datos, DoR), pero desde ahora su trabajo tiene que verse **en los commits** de la API y la base de datos. En la sustentación (lunes 9 de noviembre) se le puede preguntar a cualquiera de los dos por cualquier parte del código.
