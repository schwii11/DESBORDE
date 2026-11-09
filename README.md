# DESBORDE — El cuerpo no tiene una forma definitiva

**Plataforma publicada:** https://schwii11.github.io/touch-me/

**Repositorio:** https://github.com/schwii11/touch-me

## Concepto

DESBORDE es una plataforma audiovisual donde el tacto construye materia alrededor de un cuerpo. La mano no activa botones aislados: su posición, trayectoria, duración, cantidad de dedos y fuerza aproximada modifican simultáneamente la imagen y el sonido. Deslizar tensa familias de filamentos, mantener acumula volumen, tocar con dos dedos abre membranas plisadas y soplar mueve las capas más livianas.

Cada intervención permanece en la escena y pasa a formar parte de una memoria sonora. El resultado no es una figura prediseñada, sino un archivo irrepetible del contacto. La obra propone entender el cuerpo como algo que se construye, se deforma y desborda según las fuerzas que recibe.

## Funcionamiento

### Conexión del teléfono

1. Abre la plataforma publicada en un computador y presiona **Toca para transformarlo**.
2. Selecciona **Conectar teléfono**.
3. Escanea el código QR con la cámara del teléfono.
4. Espera hasta que ambas pantallas indiquen que están conectadas.
5. Elige **Filamento**, **Volumen** o **Membrana** y toca la superficie. El botón inferior permite activar el soplido cuando el navegador solicite permiso.
6. Después de crear al menos tres huellas se habilita **Revelar**, que recorre la pieza y presenta su archivo final.

Computador y teléfono comparten una sala aleatoria mediante MQTT sobre WSS. Los temas se mantienen dentro de `tacto/desborde/{sala}/#`, por lo que un usuario autorizado solamente para `tacto/#` puede operar la obra. El teléfono transmite solamente números asociados al gesto; nunca envía grabaciones, imágenes, nombres, ubicación ni contenido del micrófono.

### Tabla de conexiones

| Gesto o dato | Transformación visual | Transformación sonora | Sentido dentro del concepto |
|---|---|---|---|
| Posición X/Y y deslizamiento | Traza hilos sobre la zona recorrida del cuerpo | Hilo suave ascendente y paneo según la posición horizontal | El recorrido deja una huella espacial |
| Deslizamiento rápido o intenso | El hilo aumenta su espesor y tensión | Hilo tenso, más brillante y ascendente | La fuerza vuelve visible la tensión |
| Toque breve | Deposita un fragmento pequeño | Ataque corto y seco | Incluso un contacto mínimo deja materia |
| Mantener presionado | Genera un volumen que crece | Pulso grave sostenido | La duración produce acumulación |
| Dos dedos | Abre una membrana translúcida | Fricción de velo | La suma de contactos expande el cuerpo |
| Soplido al micrófono | Agita las membranas y desplaza capas | Ruido de aire filtrado | Una fuerza invisible también transforma la materia |
| Revelar | Ilumina y recorre la escultura terminada | Permite reproducir la memoria de los eventos | La acumulación se convierte en archivo |

### Sonidos y autoría

La plataforma utiliza ocho identidades sonoras: **hilo suave, hilo tenso, fragmento, volumen, resonancia, velo, aire y ruptura**. Todas fueron programadas específicamente para DESBORDE con Web Audio API mediante osciladores, ruido sintetizado, filtros, envolventes, paneo, compresión y retardo. Son de autoría propia y no utilizan grabaciones ni muestras externas.

La intensidad, duración y posición del gesto modifican frecuencia, timbre, amplitud y ubicación estéreo. De esta manera el sonido no funciona como acompañamiento, sino como otra manifestación de la misma acción táctil.

### Datos del teléfono utilizados

- Posición X e Y.
- Duración del contacto.
- Velocidad del desplazamiento.
- Presión cuando el dispositivo la entrega; en equipos sin presión se aproxima mediante duración y velocidad.
- Cantidad de dedos.
- Intensidad numérica del soplido, calculada localmente sin transmitir audio.

### Colaboración, revelación y exportación

Cada teléfono recibe un identificador efímero y puede elegir cualquiera de los tres materiales. El computador mantiene la escultura principal, recibe eventos de varios participantes, rechaza secuencias duplicadas y retira de la cuenta los dispositivos que dejan de enviar presencia. La paleta permanece unificada en negro, carmesí, plata y blanco para que la autoría colectiva no fragmente la composición.

La obra evoluciona gradualmente por **Contención**, **Tensión** y **Desborde**. La revelación final se organiza en cuatro actos verificables: Silencio, Revelación, Memoria y Archivo. Puede omitirse y repetirse.

Las exportaciones disponibles son reales: una imagen PNG del lienzo WebGL y un archivo JSON con sesión, participantes, recuentos y eventos cronológicos. La exportación WAV todavía no está implementada y por eso no aparece como botón.

### Sistema tridimensional, validación y rendimiento

El cuerpo es ahora un modelo humano continuo GLB con material físico de cristal. Los gestos se vinculan a anclajes anatómicos locales: hombros, brazos, torso, cintura, espalda, caderas y muslos. Los filamentos utilizan tubos sobre curvas Catmull–Rom; los volúmenes son mallas deformadas de crecimiento direccional; las membranas son superficies subdivididas con pliegues procedurales, inercia y respuesta al soplido.

El panel **Materia / Calidad** incluye cinco vistas de validación: A maniquí, B filamentos, C volúmenes, D membranas y E composición completa. También permite revisar frontal, tres cuartos, perfil y espalda. La cámara orbital tiene amortiguación, zoom limitado y rotación automática lenta después de siete segundos sin interacción. El indicador FPS mide el rendimiento real del navegador.

El maniquí utiliza el modelo `Xbot.glb` de los ejemplos oficiales de Three.js, integrado localmente y reinterpretado mediante un material de cristal propio para esta obra.

## Reflexión

Traducir el tacto en materia permite entender que tocar no es simplemente presionar una interfaz. Cada contacto tiene lugar, duración, trayectoria, intensidad y relación con contactos anteriores. Cuando las huellas permanecen, el gesto deja de ser instantáneo y se transforma en memoria.

El sistema también muestra sus límites. Una pantalla no reproduce temperatura, humedad, resistencia, textura ni intención afectiva. Además, no todos los teléfonos entregan presión real, por lo que parte de la fuerza debe inferirse mediante la duración y velocidad. El soplido tampoco transmite el audio: solo se transforma en un valor de intensidad para proteger la privacidad.

Dos mejoras futuras serían crear credenciales temporales distintas para cada exhibición e incorporar poses editoriales adicionales mediante animaciones del esqueleto del modelo. También sería útil incorporar retroalimentación háptica variable para que la persona no solo vea y escuche la resistencia, sino que pueda sentirla en el teléfono.

## Configurar EMQX Cloud

DESBORDE admite un broker privado sin modificar `app.js` ni `mobile.js`. Los dos dispositivos leen la misma configuración desde `config.js`.

1. Crea un despliegue **Serverless** en EMQX Cloud y espera hasta que indique **Running**.
2. Copia la dirección **WebSocket over TLS/SSL** y forma una URL como `wss://TU-DIRECCION:8084/mqtt`.
3. Crea un usuario con una contraseña nueva de al menos doce caracteres, utilizada solamente para este broker.
4. Activa el modo de autorización por lista blanca.
5. Autoriza a ese usuario con **Publish & Subscribe / Allow** únicamente sobre `tacto/#`.
6. Añade para **All Users** la regla **Publish & Subscribe / Deny** sobre `#`.
7. Comprueba con MQTTX que `tacto/prueba` funciona y que `otro/tema` es rechazado.
8. Abre `config.js` en tu computador y completa `broker`, `username` y `password`. No envíes esos valores por chat ni los muestres en capturas.
9. Publica la actualización. La interfaz debe indicar **EMQX PRIVADO** tanto en el computador como en el teléfono.

Si `config.js` queda vacío, la obra conserva temporalmente el broker público y lo indica claramente en pantalla. Esa modalidad sirve para pruebas, no para una entrega con información sensible.

## Compatibilidad y privacidad

La experiencia necesita conexión a internet y funciona mejor en versiones recientes de Chrome, Edge y Safari. En iPhone o iPad, la inclinación y el micrófono requieren permiso explícito y deben activarse mediante los botones del control. La configuración recomendada utiliza EMQX Cloud mediante WSS/TLS, una sala aleatoria y un usuario limitado a `tacto/#`. No transmite información personal.

La contraseña guardada en `config.js` puede ser leída por quien inspeccione la página publicada. Por eso debe ser exclusiva del broker, tener permisos mínimos y eliminarse al terminar el curso. Si se filtra, cambia o elimina primero el usuario en EMQX; borrarla de GitHub no invalida una clave que alguien ya copió.

## Video de entrega — guion de 30 a 60 segundos

1. **0–5 s:** mostrar el título DESBORDE en el computador.
2. **5–10 s:** abrir el panel, mostrar el QR y escanearlo con el teléfono.
3. **10–25 s:** deslizar un dedo y mantenerlo para mostrar hilos y volumen junto con sus sonidos.
4. **25–35 s:** usar dos dedos y activar el soplido.
5. **35–50 s:** mostrar la figura acumulada y presionar **Revelar**.
6. **50–60 s:** enseñar el archivo final y la opción **Reproducir memoria**.

Graba el teléfono y el computador en el mismo encuadre para demostrar que el control remoto transforma la experiencia en tiempo real.

## Ejecutar localmente

Ejecuta `node dev-server.mjs` y abre `http://127.0.0.1:8081`, o sirve la carpeta con Live Server. Three.js se carga como módulo ES desde jsDelivr, por lo que la primera ejecución necesita conexión a internet. Para GitHub Pages, publica los archivos en la raíz del repositorio.
