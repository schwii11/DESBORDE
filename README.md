# DESBORDE — El cuerpo no tiene una forma definitiva

## Concepto

DESBORDE es una plataforma audiovisual donde el tacto construye materia alrededor de un cuerpo. Deslizar tensa fibras, mantener genera volumen y la combinación de gestos abre membranas translúcidas. Cada acción queda en la escena y en una memoria sonora: el resultado no es una prenda prediseñada, sino un archivo irrepetible del contacto.

## Funcionamiento — primera versión

| Gesto | Imagen | Sonido |
|---|---|---|
| Deslizar | Hilos tubulares tensados entre puntos corporales | Cuerda sintética ascendente |
| Mantener | Volumen orgánico que crece sobre el cuerpo | Pulso grave sostenido |
| Toque breve | Fragmento escultórico pequeño | Ataque breve |
| Secuencia de gestos | Membrana translúcida orientada en profundidad | Fricción triangular |
| Revelar | Recorrido cinematográfico, cambio de luz y archivo final | Reproducción de memoria disponible |

La versión actual utiliza interacción de mouse o pantalla táctil directamente sobre la escena. La siguiente fase incorpora la segunda interfaz móvil, MQTT por WSS, inclinación, multitáctil y micrófono. Esos sensores permanecen pendientes de validación física y no se declaran probados.

El sonido se genera originalmente en tiempo real con Web Audio API; no utiliza grabaciones externas. La armonía se limita a una escala oscura común para que acciones diferentes formen una composición relacionada.

## Reflexión

Traducir el tacto en materia permite entender que tocar no es activar un botón: implica lugar, duración, trayectoria, tensión y acumulación. La persistencia transforma la escena en memoria. La interfaz no puede reproducir temperatura, humedad, resistencia real, textura ni intención afectiva; la presión basada en duración será siempre una aproximación cuando el dispositivo no entregue fuerza fiable.

Las siguientes mejoras concretas son incorporar MQTT con salas privadas y construir una malla corporal continua con deformación por vértices. También se deben validar rendimiento, permisos, multitáctil, orientación y micrófono en teléfonos Android y Safari iOS antes de afirmar compatibilidad.

## Ejecutar

Sirve esta carpeta mediante un servidor local, por ejemplo Live Server. Three.js se carga como módulo ES desde jsDelivr, por lo que la primera ejecución necesita conexión a internet. Para GitHub Pages basta publicar estos archivos en la raíz del repositorio.
