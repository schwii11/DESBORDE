# TOUCH ME — ¿Cómo suena tu tacto?

## 1. Concepto

Touch Me es una experiencia audiovisual donde un pequeño cuerpo transparente descubre sensaciones y emociones mediante el contacto humano. Cada toque produce una huella visual persistente, una interpretación emocional y una nota musical. El personaje comienza casi transparente y en silencio; termina lleno de colores, sonidos y memorias.

El personaje fue construido directamente con Canvas 2D como una criatura gelatinosa con orejas de conejo. No depende de una imagen estática: cuerpo, orejas, ojos, respiración, deformación, transparencia y huellas se dibujan por capas. Las emociones no diagnostican a las personas ni entregan puntos; son reglas poéticas mediante las cuales Touch Me expresa curiosidad, alegría, tranquilidad, confianza, sorpresa, incomodidad y saturación.

## 2. Funcionamiento

La pantalla del computador crea una sala única, muestra un QR y recibe a varios teléfonos mediante MQTT por WebSockets seguros. Cada teléfono conserva un identificador y color de borde; el interior de cada huella representa la sensación. Las fotografías, el audio del micrófono y datos privados no se transmiten. El micrófono envía únicamente intensidad derivada del sonido.

| Entrada | Datos | Respuesta visual | Respuesta sonora |
|---|---|---|---|
| Caricia | X/Y, velocidad lenta, duración | Estela rosa difusa | Mi, timbre suave |
| Toque corto | X/Y, duración breve | Círculo amarillo | Sol, nota juguetona |
| Presión sostenida | Duración y presión disponible | Mancha violeta creciente | Re largo y tenso |
| Movimiento brusco | Velocidad alta | Marca concentrada y sobresalto | La/Si♭ repentino |
| Varios dedos | `pointerId` y cantidad | Huellas simultáneas | Notas superpuestas |
| Soplido | Intensidad y duración derivadas | Ondas celestes y temblor | Fa aireado |
| Inclinación | Gamma y beta | Desplazamiento blando | Modificación espacial |

La presión no existe o no es fiable en muchos teléfonos. Cuando el valor es inexistente o fijo, la interfaz declara `estimada` y usa duración y velocidad; no presenta esa estimación como fuerza física. En iOS, movimiento y micrófono se activan mediante botones para solicitar permiso.

### Memoria

Cada evento conserva participante, zona, posición, gesto, intensidad, duración, emoción, nota y momento. Las huellas nunca desaparecen durante la sesión. Al finalizar se presenta el cuerpo coloreado, zona más tocada, emoción principal, participantes, cronología musical y una frase generada mediante reglas. La memoria visual se descarga como PNG y la secuencia sintetizada como WAV.

### MQTT

La plataforma no contiene brokers públicos ni credenciales escritas en el código. Al abrirla, la pantalla solicita la dirección WSS, el usuario temporal y una clave exclusiva de EMQX. La clave vive solo en memoria durante la pestaña, se borra del formulario al conectar y nunca entra al QR, a la URL, a `localStorage` ni al repositorio. El teléfono recibe por QR únicamente la dirección WSS, el usuario y la sala; la clave se escribe manualmente.

Los temas se organizan bajo `tacto/{usuario}/touch-me/{sala}/#`. Los mensajes no se retienen y contienen solamente un identificador aleatorio de sesión y números del gesto: posición, intensidad, duración, velocidad, dedos, presión e inclinación. El micrófono se analiza localmente y transmite una intensidad numérica, nunca audio. No se envían nombres, fotografías, ubicación, contactos ni datos del dispositivo.

#### Configuración segura en EMQX Cloud

1. Crear un despliegue temporal y copiar su dirección **WebSocket seguro (WSS/TLS)**.
2. Crear un usuario exclusivo para la sesión con una clave aleatoria que no se use en correo ni en otras cuentas.
3. En autorización, permitir a ese usuario publicar y suscribirse únicamente a `tacto/{usuario}/#`.
4. Activar el modo de lista blanca. Si el plan no ofrece ese interruptor, añadir después de la regla anterior una regla para **All Users** que deniegue publicar y suscribirse a `#`.
5. Probar que `tacto/{usuario}/touch-me/prueba/#` funciona y que un tema ajeno es rechazado.
6. Antes de compartir capturas, tapar dirección, usuario, clave y códigos QR activos.
7. Al terminar la presentación, borrar el usuario y el despliegue temporal.

Nunca se debe pegar la clave dentro de los archivos ni publicarla en GitHub Pages. El navegador necesita conocerla para conectarse, por eso una persona debe ingresarla en cada dispositivo durante la sesión.

### Sonidos y licencia

Los ocho WAV fueron sintetizados originalmente para este proyecto con `scripts/generate-sounds.mjs`. No contienen grabaciones humanas ni muestras externas. Se entregan para uso académico dentro del proyecto.

| Archivo | Función |
|---|---|
| `soft.wav` | contacto suave |
| `gel.wav` | deformación gelatinosa |
| `pop.wav` | sorpresa/toque breve |
| `tension.wav` | presión prolongada |
| `air.wav` | soplido interpretado |
| `flutter.wav` | cosquillas y orejas |
| `limit.wav` | incomodidad y límite |
| `memory.wav` | resonancia de memoria |

Las notas musicales se producen en tiempo real con Web Audio API y cambian según gesto, zona corporal, posición e intensidad.

### Ejecutar y publicar

```bash
pnpm install
pnpm sounds
pnpm dev
pnpm build
```

Vite utiliza rutas relativas (`base: './'`) y genera `dist/`, compatible con GitHub Pages. La experiencia publicada necesita HTTPS para micrófono y sensores.

### Pruebas físicas pendientes

- [ ] Dos o más teléfonos conectados simultáneamente desde redes distintas.
- [ ] Multitouch y presión real/estimada en Android y Safari iOS.
- [ ] Permiso de orientación en iPhone.
- [ ] Micrófono sin transmisión de audio y umbral adecuado para soplidos.
- [ ] Superposición y paneo de notas sin saturación audible.
- [ ] Rendimiento después de cientos de huellas.
- [ ] Descargas PNG y WAV en navegadores de escritorio y móviles.

## 3. Reflexión

Touch Me permite observar que un contacto digital no es solamente una coordenada: también tiene duración, velocidad, repetición, simultaneidad y una historia previa. La misma cosquilla puede producir alegría al comienzo e incomodidad después de repetirse. La memoria acumulativa vuelve visible que tocar modifica un cuerpo y que ese cuerpo puede expresar límites.

Quedan fuera la temperatura real, textura, humedad, resistencia, intención y contexto afectivo. El micrófono tampoco mide frío o calor: los representa simbólicamente mediante intensidad y duración del aire. Las emociones del personaje son decisiones de diseño, no inferencias psicológicas sobre quienes participan.

Como mejoras se debería calibrar la interacción mediante pruebas físicas consentidas en varios teléfonos y desarrollar umbrales de micrófono adaptativos al ruido ambiental. También sería útil guardar sesiones en almacenamiento persistente con consentimiento, incorporar una síntesis granular más expresiva y mejorar la deformación mediante una malla elástica ligera. No se inventan resultados de pruebas que todavía no se han realizado.
