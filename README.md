# DESBORDE — El cuerpo no tiene una forma definitiva

**Plataforma publicada:** https://schwii11.github.io/DESBORDE/

**Repositorio:** https://github.com/schwii11/DESBORDE

## Concepto

DESBORDE es una plataforma audiovisual donde el tacto construye materia alrededor de un cuerpo. La mano no activa botones aislados: su posición, trayectoria, ritmo, cantidad de dedos y fuerza aproximada modifican simultáneamente la imagen y el sonido. Deslizar un dedo tensa filamentos, tocar tres veces rápido acumula volumen 3D, dos dedos abren membranas y el soplido mueve y recolorea la materia.

Cada intervención permanece en la escena y pasa a formar parte de una memoria sonora. El resultado no es una figura prediseñada, sino un archivo irrepetible del contacto. La obra propone entender el cuerpo como algo que se construye, se deforma y desborda según las fuerzas que recibe.

## Funcionamiento

### Conexión del teléfono

1. Abre la plataforma publicada en un computador y presiona **Entrar en la experiencia**.
2. Selecciona **Conectar teléfono**.
3. Escanea el código QR con la cámara del teléfono.
4. Espera hasta que ambas pantallas indiquen que están conectadas.
5. Desliza para registrar filamentos, toca tres veces rápido para registrar volumen y usa dos dedos para registrar membranas. El botón inferior activa el soplido y guarda un futuro cambio cromático.
6. Después de crear al menos tres huellas se habilita **Revelar**, que reconstruye la pieza completa como un timelapse audiovisual y presenta su archivo final.

Computador y teléfono comparten una sala aleatoria mediante MQTT sobre WSS. Los temas se mantienen dentro de `tacto/desborde/{sala}/#`, por lo que un usuario autorizado solamente para `tacto/#` puede operar la obra. El teléfono transmite solamente números asociados al gesto; nunca envía grabaciones, imágenes, nombres, ubicación ni contenido del micrófono.

### Tabla de conexiones

| Gesto o dato | Transformación visual | Transformación sonora | Sentido dentro del concepto |
|---|---|---|---|
| Posición X/Y y deslizamiento | Registra hilos sobre la zona recorrida del cuerpo | Hilo suave ascendente | El recorrido deja una huella espacial |
| Deslizamiento rápido o intenso | El hilo aumenta su espesor y tensión | Hilo tenso, más brillante y ascendente | La fuerza vuelve visible la tensión |
| Deslizar un dedo | Dibuja filamentos curvos | Tono agudo y tenso | Un contacto individual deja una trayectoria |
| Tres toques rápidos | Genera un volumen tridimensional | Pulso grave sostenido | La repetición transforma el contacto en acumulación |
| Dos dedos | Abre una membrana translúcida | Fricción de velo | La suma de dos contactos expande el cuerpo |
| Soplido al micrófono | Produce un pulso y cambia claramente el color de la materia presente y de los elementos posteriores del timelapse | Ruido de aire filtrado | Una fuerza invisible altera y mantiene un nuevo estado cromático |
| Gestos simultáneos de dos teléfonos | Une las posiciones mediante un filamento celeste compartido | Tono ascendente de vínculo | La colaboración produce una forma que ninguna persona genera sola |
| Revelar | Reconstruye cada huella en orden y con máxima visibilidad | Reproduce el sonido asociado a cada evento | La acumulación se convierte en memoria y archivo |

### Sonidos y autoría

La plataforma utiliza siete respuestas sonoras: **filamento suave**, **filamento tenso**, **volumen grave**, **membrana**, **soplido**, **vínculo colaborativo** y una señal ascendente de **revelación**. Los dos estados del filamento pertenecen a una misma familia dinámica, pero se perciben de forma diferente según la velocidad e intensidad. Todas fueron programadas específicamente para DESBORDE con Web Audio API mediante osciladores, ruido sintetizado, filtros y envolventes. Son de autoría propia y no utilizan grabaciones ni muestras externas.

La intensidad, duración y posición del gesto modifican frecuencia, timbre, amplitud y ubicación estéreo. De esta manera el sonido no funciona como acompañamiento, sino como otra manifestación de la misma acción táctil.

### Datos del teléfono utilizados

- Posición X e Y.
- Duración del contacto.
- Velocidad del desplazamiento.
- Presión cuando el dispositivo la entrega; en equipos sin presión se aproxima mediante duración y velocidad.
- Cantidad de dedos.
- Intensidad numérica del soplido, calculada localmente sin transmitir audio.
- Respuesta háptica local para diferenciar contacto, filamento, volumen, membrana y soplido. Android utiliza patrones de vibración; cuando el navegador no ofrece vibración, como ocurre en Safari para iPhone, la plataforma activa automáticamente un pulso visual de color y una señal sonora breve en el teléfono.

### Colaboración y revelación

Cada teléfono recibe un identificador efímero. La trayectoria, el ritmo de los toques y la cantidad de dedos deciden el material, de modo que no es necesario cambiar de herramienta. El computador mantiene la escultura principal, recibe eventos de varios participantes, rechaza secuencias duplicadas y retira de la cuenta los dispositivos que dejan de enviar presencia. Cuando dos teléfonos gesticulan dentro del mismo intervalo, el sistema registra un filamento celeste entre ambas posiciones y un sonido de vínculo. Así, colaborar modifica realmente el resultado en vez de limitarse a sumar gestos individuales. La paleta parte en negro, carmesí, plata y blanco, y el soplido introduce variaciones cromáticas compartidas.

La obra evoluciona gradualmente por **Contención**, **Tensión** y **Desborde**. Durante la construcción la imagen permanece oculta: el sistema guarda posiciones, gestos, sonidos y soplidos sin dibujar la composición. Al revelar, reconstruye por primera vez todos los eventos en orden, incluidos los cambios cromáticos, con imagen y sonido claros. Este timelapse puede omitirse y repetirse desde el archivo final.

Al terminar, la pantalla permite reproducir nuevamente la memoria del proceso, volver a la obra sin borrar lo construido o comenzar una composición completamente nueva. Se eliminaron las exportaciones experimentales porque no representaban de forma fiel la experiencia audiovisual.

### Sistema visual e interacción

La obra utiliza un sistema visual 2.5D por capas. Durante la captura el maniquí y la materia permanecen ocultos. Deslizar registra filamentos curvos, tres toques rápidos registran volumen 3D y dos dedos registran membranas. La posición del contacto determina la ubicación y cada aparición alterna forma, recorte, escala y orientación. Soplar registra un cambio cromático que aparece en su momento correspondiente durante la revelación.

Durante la revelación, los materiales se mueven lentamente después de aparecer para que no se perciban pegados. El soplido produce un pulso y modifica el color de la composición. El panel **Materia** permite elegir qué respuesta registrar con el mouse y borrar la memoria sin recargar la página.

El mismo panel incluye controles de **tamaño**, **presencia** y **sensibilidad**. Tamaño y presencia se guardan con los nuevos eventos y se aplican cuando estos aparecen en la revelación; sensibilidad regula la intensidad y frecuencia con que se registra el recorrido. Los volúmenes y membranas nacen en la coordenada del contacto, mientras sus variantes cambian de forma, escala y orientación.

El sonido se genera en tiempo real con Web Audio. Los filamentos producen tonos agudos y tensos; los volúmenes, sonidos graves; y las membranas combinan tono y aire filtrado. El audio se desbloquea al entrar o con el primer contacto, como exigen los navegadores móviles.

## Reflexión

Traducir el tacto en materia permite entender que tocar no es simplemente presionar una interfaz. Cada contacto tiene lugar, duración, trayectoria, intensidad y relación con contactos anteriores. Cuando las huellas permanecen, el gesto deja de ser instantáneo y se transforma en memoria.

El sistema también muestra sus límites. Una pantalla no reproduce temperatura, humedad, resistencia, textura ni intención afectiva. Además, no todos los teléfonos entregan presión real, por lo que parte de la fuerza debe inferirse mediante la duración y velocidad. El soplido tampoco transmite el audio: solo se transforma en un valor de intensidad para proteger la privacidad.

Dos mejoras futuras serían crear credenciales temporales distintas para cada exhibición e incorporar nuevas familias visuales de membranas y volúmenes. También sería útil utilizar la inclinación del teléfono para desplazar la materia revelada y ampliar la respuesta háptica con intensidades basadas en presión real cuando el dispositivo la entregue.

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

La experiencia necesita conexión a internet y funciona mejor en versiones recientes de Chrome, Edge y Safari. En iPhone o iPad, el micrófono requiere permiso explícito y se activa mediante el botón del control. La configuración recomendada utiliza EMQX Cloud mediante WSS/TLS, una sala aleatoria y un usuario limitado a `tacto/#`. No transmite información personal.

La contraseña guardada en `config.js` puede ser leída por quien inspeccione la página publicada. Por eso debe ser exclusiva del broker, tener permisos mínimos y eliminarse al terminar el curso. Si se filtra, cambia o elimina primero el usuario en EMQX; borrarla de GitHub no invalida una clave que alguien ya copió.

## Video de entrega — guion de 30 a 60 segundos

1. **0–5 s:** mostrar el título DESBORDE en el computador.
2. **5–10 s:** abrir el panel, mostrar el QR y escanearlo con el teléfono.
3. **10–25 s:** deslizar, tocar tres veces rápido y usar dos dedos para construir filamentos, volúmenes y membranas.
4. **25–35 s:** activar el soplido y mostrar en el teléfono que el gesto fue registrado, mientras la obra continúa oculta.
5. **35–50 s:** presionar **Revelar** y mostrar el timelapse audiovisual de todas las huellas.
6. **50–60 s:** enseñar el archivo final y la opción **Reproducir memoria**.

Graba el teléfono y el computador en el mismo encuadre para demostrar que el control remoto transforma la experiencia en tiempo real.

## Créditos visuales

- Capas interactivas de maniquí, membranas y volumen: creaciones originales generadas con OpenAI ImageGen para este proyecto, basadas en la dirección visual desarrollada por la autora.

## Ejecutar localmente

Ejecuta `node dev-server.mjs` y abre `http://127.0.0.1:8077`, o sirve la carpeta con Live Server. Para GitHub Pages, publica los archivos en la raíz del repositorio.
