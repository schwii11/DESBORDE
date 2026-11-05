# ENTRE VIÑETAS

## 1. Concepto

ENTRE VIÑETAS explora la posibilidad de tocar una imagen normalmente encerrada dentro del lenguaje gráfico del manga. Cuando la mano atraviesa la viñeta, el dibujo deja de ser una imagen fija y se convierte en una materia que puede sentirse y escucharse. La obra utiliza ilustraciones originales en blanco, negro y rojo carmín; no contiene personajes, páginas ni fotogramas de obras existentes.

Las tres viñetas enfatizan materias distintas: **papel**, **tinta** y **límite**. Deslizar arrastra la tinta, mantener expande una mancha, separar dos dedos abre una grieta, acercarlos comprime las líneas, inclinar desplaza capas y soltar libera gradualmente la tensión. Algunas huellas desaparecen y otras quedan como memoria persistente del contacto.

## 2. Funcionamiento

La pantalla principal crea una sala aleatoria y muestra un QR. El teléfono abre `control.html?sala=...` y publica datos reales mediante MQTT sobre WSS. Por defecto intenta `wss://test.mosquitto.org:8081` y, si no responde, utiliza `wss://broker.emqx.io:8084/mqtt`. No se sustituye MQTT con almacenamiento local ni BroadcastChannel.

| Gesto | Datos capturados | Imagen | Sonido |
|---|---|---|---|
| Deslizar | X/Y, velocidad, presión o duración | Arrastra tinta y trazo | Pincel sobre papel |
| Mantener | Tiempo y presión disponible | Expande mancha y vibración | Pulso grave creciente |
| Separar dos dedos | Distancia entre `pointerId` | Abre grietas | Papel rasgado |
| Acercar dos dedos | Distancia entre `pointerId` | Comprime líneas | Papel doblado/crujido |
| Inclinar | Gamma y beta | Parallax y dirección de partículas | Viento espacializado |
| Soltar | Fin del contacto | Relajación temporal | Resonancia |

El panel **Mapa del tacto** permite consultar las conexiones y cambiar el sonido y la intensidad de seis asociaciones sin impedir el uso directo de la obra. El teléfono limita mensajes a aproximadamente 30 Hz. Si la presión no es fiable, duración y velocidad construyen la intensidad. La orientación necesita permiso explícito en iOS.

### Sonidos y autoría

Los ocho archivos WAV fueron sintetizados específicamente para este proyecto mediante `scripts/generate-sounds.mjs`; no contienen grabaciones ni muestras externas. Se entregan para uso académico dentro del proyecto.

| Archivo | Materia sonora |
|---|---|
| `brush.wav` | pincel sobre papel |
| `fold.wav` | papel doblado |
| `tear.wav` | papel rasgado |
| `drop.wav` | gota de tinta interpretada |
| `breath.wav` | respiración abstracta sintetizada |
| `pulse.wav` | pulso grave |
| `wind.wav` | viento |
| `resonance.wav` | resonancia y liberación |

### Ejecutar y publicar

```bash
pnpm install
pnpm sounds
pnpm dev
pnpm build
```

Vite utiliza `base: './'`, por lo que `dist/` puede publicarse en GitHub Pages dentro de un repositorio de proyecto. La experiencia requiere HTTPS para sensores en teléfonos.

### Comprobaciones físicas pendientes

- [ ] Conexión entre computador y teléfono mediante redes distintas.
- [ ] Multitouch real de dos dedos en Android y Safari iOS.
- [ ] Permiso y rango de orientación en ambos sistemas.
- [ ] Diferencias reales de presión entre dispositivos.
- [ ] Superposición de los ocho audios sin cortes.
- [ ] Rendimiento de partículas en un teléfono y computador de gama media.
- [ ] Descarga PNG en navegadores móviles y de escritorio.

## 3. Reflexión

La traducción propuesta vuelve visibles la posición, duración, cantidad de contactos y orientación, y convierte esos datos en deformación, rastro y sonido. El sistema no reproduce temperatura, textura real, resistencia ni fuerza muscular; tampoco puede garantizar una medición uniforme de presión entre teléfonos. Por eso la duración funciona como alternativa declarada, no como si fuera presión física.

Como mejoras se podría incorporar un modelo de papel con malla elástica ligera para que las grietas respondan con mayor continuidad y un motor de audio granular que transforme los WAV sin multiplicar reproducciones. También sería importante probar la pieza con participantes reales para ajustar sensibilidad, legibilidad y cansancio, y desarrollar perfiles de rendimiento que reduzcan partículas automáticamente. Estas son propuestas de diseño: todavía no se afirman resultados de pruebas con usuarios.
