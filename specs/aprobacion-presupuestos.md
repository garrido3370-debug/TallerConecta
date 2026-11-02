# SPEC 001 — Aprobación digital de reparaciones adicionales

**Estado:** Implementada para demo local | **Prioridad:** Alta | **Usuario principal:** mecánico y cliente

## Problema
Don Ramiro dirige un taller de cuatro mecánicos. Durante una reparación pueden aparecer trabajos adicionales. El taller detiene la intervención para solicitar autorización telefónica; el cliente puede tardar en contestar y luego negar haber aprobado el coste. Las llamadas interrumpen el trabajo.

## Objetivo
Permitir que el taller emita una solicitud de presupuesto adicional y que el cliente responda desde un enlace móvil, guardando un registro con fecha y hora.

## Solución y flujo
1. El mecánico abre el panel del taller e introduce matrícula, descripción del trabajo y coste total con IVA (EUR).
2. El sistema crea una solicitud **pendiente** con ID aleatorio y un enlace de cliente copiable.
3. El cliente abre el enlace, revisa los datos y pulsa **Aprobar presupuesto** o **Rechazar presupuesto**.
4. Antes de enviar su decisión, confirma la acción. El sistema registra la decisión y su hora (UTC).
5. El panel muestra el estado actualizado al pulsar **Actualizar estados**. Una solicitud resuelta no acepta nuevas decisiones.

## Criterios de aceptación verificables
- **CA1 — Creación:** dados matrícula, descripción y precio total válidos, al crear la solicitud se registra como `pendiente` y se genera un enlace de cliente con identificador aleatorio.
- **CA2 — Visibilidad:** al abrir el enlace, el cliente puede ver matrícula, descripción y precio total con IVA, incluso en pantalla de móvil.
- **CA3 — Decisión:** al aprobar o rechazar una solicitud pendiente, se guarda el estado correspondiente y un sello temporal UTC; la interfaz informa de la decisión.
- **CA4 — Inmutabilidad:** una segunda decisión sobre una solicitud ya resuelta es rechazada por el servidor (HTTP 409) y el estado original permanece sin cambios.
- **CA5 — Validación y persistencia:** el servidor rechaza matrícula, descripción o precio inválidos, y las solicitudes siguen disponibles tras reiniciar el proceso usando el mismo archivo de datos.

## No incluido
- Autenticación de trabajadores, identidad verificable del cliente, firma electrónica avanzada, envío automático por WhatsApp/SMS/email, privacidad/regulación y políticas de retención, adjuntos, múltiples talleres, inventario, producción, base de datos, sincronización en tiempo real.

## Restricciones y riesgos
- Los enlaces funcionan entre dispositivos **solo** si el servidor es alcanzable desde ambos, por ejemplo conectados a la misma red local o desplegado externamente.
- El enlace es un token de acceso; cualquiera que lo tenga puede decidir. No usar para operaciones comerciales reales sin autenticación, seguridad, trazabilidad y asesoramiento legal adecuados.
- La persistencia JSON es adecuada para una demo local de pocos usuarios, no para concurrencia/producción.

## Verificación
Ejecutar `npm test` para CA1, CA3, CA4 y CA5, e inspeccionar manualmente CA2 en una pantalla móvil. Probar que el panel muestra cambios con «Actualizar estados».
