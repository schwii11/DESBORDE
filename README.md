# DESBORDE — El cuerpo no tiene una forma definitiva

**Plataforma publicada:** https://schwii11.github.io/touch-me/

**Repositorio:** https://github.com/schwii11/touch-me

## Concepto

DESBORDE es una plataforma audiovisual donde el tacto construye materia alrededor de un cuerpo. La mano no activa botones aislados: su posición, trayectoria, duración, cantidad de dedos y fuerza aproximada modifican simultáneamente la imagen y el sonido. Deslizar tensa fibras, mantener acumula volumen, tocar con dos dedos abre membranas, inclinar desestabiliza el cuerpo y soplar mueve las capas más livianas.

Cada intervención permanece en la escena y pasa a formar parte de una memoria sonora. El resultado no es una figura prediseñada, sino un archivo irrepetible del contacto. La obra propone entender el cuerpo como algo que se construye, se deforma y desborda según las fuerzas que recibe.

## Funcionamiento

### Conexión del teléfono

1. Abre la plataforma publicada en un computador y presiona **Toca para transformarlo**.
2. Selecciona **Conectar teléfono**.
3. Escanea el código QR con la cámara del teléfono.
4. Espera hasta que ambas pantallas indiquen que están conectadas.
5. Desliza uno o dos dedos sobre la superficie táctil. Los botones inferiores permiten activar la inclinación y el soplido cuando el navegador solicite permiso.
6. Después de crear al menos tres huellas se habilita **Revelar**, que recorre la pieza y presenta su archivo final.

Computador y teléfono comparten una sala aleatoria mediante MQTT sobre WSS. El canal utilizado tiene la forma `desborde/v1/{sala}`. El teléfono transmite solamente números asociados al gesto; nunca envía grabaciones, imágenes, nombres, ubicación ni contenido del micrófono.

### Tabla de conexiones

| Gesto o dato | Transformación visual | Transformación sonora | Sentido dentro del concepto |
|---|---|---|---|
| Posición X/Y y deslizamiento | Traza hilos sobre la zona recorrida del cuerpo | Hilo suave ascendente y paneo según la posición horizontal | El recorrido deja una huella espacial |
| Deslizamiento rápido o intenso | El hilo aumenta su espesor y tensión | Hilo tenso, más brillante y ascendente | La fuerza vuelve visible la tensión |
| Toque breve | Deposita un fragmento pequeño | Ataque corto y seco | Incluso un contacto mínimo deja materia |
| Mantener presionado | Genera un volumen que crece | Pulso grave sostenido | La duración produce acumulación |
| Dos dedos | Abre una membrana translúcida | Fricción de velo | La suma de contactos expande el cuerpo |
| Inclinación del teléfono | Gira y desequilibra la figura | Modifica la percepción espacial del conjunto | El cuerpo pierde su estabilidad frente al movimiento |
| Soplido al micrófono | Agita las membranas y desplaza capas | Ruido de aire filtrado | Una fuerza invisible también transforma la materia |
| Revelar | Ilumina y recorre la escultura terminada | Permite reproducir la memoria de los eventos | La acumulación se convierte en archivo |

### Sonidos y autoría

La plataforma utiliza seis identidades sonoras: **hilo suave, hilo tenso, fragmento, volumen, velo y aire**. Todas fueron programadas específicamente para DESBORDE con Web Audio API mediante osciladores, ruido sintetizado, filtros, envolventes, paneo, compresión y retardo. Son de autoría propia y no utilizan grabaciones ni muestras externas.

La intensidad, duración y posición del gesto modifican frecuencia, timbre, amplitud y ubicación estéreo. De esta manera el sonido no funciona como acompañamiento, sino como otra manifestación de la misma acción táctil.

### Datos del teléfono utilizados

- Posición X e Y.
- Duración del contacto.
- Velocidad del desplazamiento.
- Presión cuando el dispositivo la entrega; en equipos sin presión se aproxima mediante duración y velocidad.
- Cantidad de dedos.
- Inclinación en los ejes beta y gamma.
- Intensidad numérica del soplido, calculada localmente sin transmitir audio.

## Reflexión

Traducir el tacto en materia permite entender que tocar no es simplemente presionar una interfaz. Cada contacto tiene lugar, duración, trayectoria, intensidad y relación con contactos anteriores. Cuando las huellas permanecen, el gesto deja de ser instantáneo y se transforma en memoria.

El sistema también muestra sus límites. Una pantalla no reproduce temperatura, humedad, resistencia, textura ni intención afectiva. Además, no todos los teléfonos entregan presión real, por lo que parte de la fuerza debe inferirse mediante la duración y velocidad. El soplido tampoco transmite el audio: solo se transforma en un valor de intensidad para proteger la privacidad.

Dos mejoras futuras serían utilizar un broker MQTT privado con permisos limitados a cada sala y reemplazar la figura formada por piezas por una malla corporal continua que pueda deformarse directamente en sus vértices. También sería útil incorporar retroalimentación háptica variable para que la persona no solo vea y escuche la resistencia, sino que pueda sentirla en el teléfono.

## Compatibilidad y privacidad

La experiencia necesita conexión a internet y funciona mejor en versiones recientes de Chrome, Edge y Safari. En iPhone o iPad, la inclinación y el micrófono requieren permiso explícito y deben activarse mediante los botones del control. El prototipo académico utiliza un broker MQTT público y una sala aleatoria; no transmite información personal. Para una exhibición permanente se recomienda migrar a un broker privado con autenticación y permisos restringidos.

## Video de entrega — guion de 30 a 60 segundos

1. **0–5 s:** mostrar el título DESBORDE en el computador.
2. **5–10 s:** abrir el panel, mostrar el QR y escanearlo con el teléfono.
3. **10–25 s:** deslizar un dedo y mantenerlo para mostrar hilos y volumen junto con sus sonidos.
4. **25–35 s:** usar dos dedos, inclinar el teléfono y activar el soplido.
5. **35–50 s:** mostrar la figura acumulada y presionar **Revelar**.
6. **50–60 s:** enseñar el archivo final y la opción **Reproducir memoria**.

Graba el teléfono y el computador en el mismo encuadre para demostrar que el control remoto transforma la experiencia en tiempo real.

## Ejecutar localmente

Sirve esta carpeta con Live Server o cualquier servidor HTTP. Three.js se carga como módulo ES desde jsDelivr, por lo que la primera ejecución necesita conexión a internet. Para GitHub Pages, publica los archivos en la raíz del repositorio.
