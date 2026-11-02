# Instrucciones persistentes para agentes — TallerConecta

## Misión
Construir un MVP web para el taller de Don Ramiro (4 mecánicos), priorizando rapidez en móviles, claridad para clientes y evidencia de aprobación/rechazo de reparaciones adicionales.

## Alcance del ejercicio (clase 2)
Implementar **solo** el feature descrito en `specs/aprobacion-presupuestos.md`. No implementar inventario, facturación, pasarelas de pago ni gestión completa de órdenes.

## Reglas de producto
- El mecánico debe poder generar una solicitud de autorización en pocos pasos desde móvil.
- El cliente puede abrir un enlace sin crear cuenta y aprobar o rechazar una sola vez.
- Mostrar descripción, matrícula, precio **total en EUR**, y estado inequívoco.
- Registrar hora UTC y decisión. Nunca cambiar una decisión final mediante el enlace público.
- Usar español claro. Interfaces táctiles: botones grandes, contraste suficiente, diseño accesible.
- La interfaz no debe afirmar validez legal garantizada: este MVP no verifica identidad, firma ni consentimiento reforzado.

## Reglas técnicas
- Stack pequeño y sin dependencias externas: Node.js 20+, HTML, CSS, JS.
- Servidor HTTP y almacenamiento JSON local para demo; no exponerlo como producto listo para producción.
- Validar entradas en servidor, escapar contenido mediante `textContent`, evitar HTML inyectado.
- No registrar datos personales innecesarios. Usar identificadores aleatorios difíciles de adivinar.
- Todas las modificaciones deben respetar los criterios de aceptación de la SPEC.
- Si el software no cumple un criterio, corregir **primero la SPEC cuando la definición sea errónea**; corregir código cuando el defecto esté en la implementación. No cambiar criterios para ocultar fallos.
- Ejecutar `npm test` antes de entregar. Documentar límites y pasos de ejecución en README.

## Estilo
Seguir `skills/diseno-marca/SKILL.md` y usar los colores y componentes allí descritos.
