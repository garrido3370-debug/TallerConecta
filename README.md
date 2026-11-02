# TallerConecta — Entrega clase 2: de prompt a especificación

MVP académico para que el taller de Don Ramiro genere solicitudes de autorización de reparaciones adicionales y el cliente las apruebe o rechace desde el móvil.

## Ejecutar
Requisitos: **Node.js 20 o superior**. Sin instalaciones de dependencias.

```bash
npm start
```

Abre **http://localhost:3000** para el panel. Crea una solicitud, copia el enlace del cliente y ábrelo en el navegador. Para pruebas con otros móviles en la misma red, utiliza `http://IP_LOCAL_DEL_ORDENADOR:3000` como dirección de acceso al panel (no `localhost`) y genera el enlace desde esa dirección; puede requerir permitir el puerto en el firewall.

## Probar

```bash
npm test
```

También verifica manualmente en un móvil (360–430 px) que se ven matrícula, descripción y precio con IVA, y que los botones son cómodos.

## Estructura de la tarea
- `AGENTS.md`: contexto persistente.
- `specs/aprobacion-presupuestos.md`: especificación de un solo feature y 5 criterios verificables.
- `skills/diseno-marca/SKILL.md`: skill de identidad visual.
- `server.js` y `public/`: implementación web.
- `tests/feature.test.js`: pruebas automáticas.

## Aviso importante
**No es un servicio listo para producción**. No hay autenticación para el taller ni verificación de la identidad del cliente, el registro es un JSON local, no existe envío automático de mensajes ni garantías de firma electrónica. Quien posea el enlace puede aprobar/rechazar; usar solo datos ficticios para el ejercicio. Para uso real: HTTPS, cuentas y roles, validación de identidad, auditoría robusta, protección de datos y almacenamiento transaccional.

## Publicar / entregar
Sube la carpeta completa a un repositorio GitHub o a Google Drive. Introduce esa URL en el formulario del curso. La URL de demo pública es opcional y **no** se incluye: ejecutar localmente no equivale a desplegar el servicio en Internet.

## Rediseño visual 2.0

La versión de entrega incorpora un sistema visual propio documentado en `skills/diseno-marca/SKILL.md`, con identidad azul noche y turquesa, nueva interfaz de taller y portal de cliente responsive. El pie de ambas vistas incluye `by garrido 337`. El rediseño afecta exclusivamente a `public/index.html`, `public/cliente.html` y `public/styles.css`; se mantienen intactos los scripts y el servidor de la aplicación.

Para comprobar el diseño, ejecuta `npm start` y abre `http://localhost:3000`. Para comprobar los criterios de aceptación, ejecuta `npm test`.
