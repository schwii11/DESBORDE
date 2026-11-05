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

La versión actual permite interacción directa y una segunda interfaz móvil accesible mediante QR. Computador y teléfono comparten una sala aleatoria bajo `desborde/v1/{sala}` y se comunican mediante MQTT sobre WSS. El teléfono envía coordenadas, duración, intensidad aproximada, cantidad de dedos, inclinación e intensidad derivada del micrófono; nunca transmite audio. Utiliza un broker público para el prototipo académico, por lo que no se envían nombres, imágenes, ubicación ni credenciales. Para una publicación definitiva se debe sustituir por un despliegue privado con autorización limitada al prefijo del proyecto.

La inclinación y el soplido están implementados, pero sus permisos y sensibilidad permanecen pendientes de validación física en Android y Safari iOS.

El sonido se genera originalmente en tiempo real con Web Audio API; no utiliza grabaciones externas. La armonía se limita a una escala oscura común para que acciones diferentes formen una composición relacionada.

## Reflexión

Traducir el tacto en materia permite entender que tocar no es activar un botón: implica lugar, duración, trayectoria, tensión y acumulación. La persistencia transforma la escena en memoria. La interfaz no puede reproducir temperatura, humedad, resistencia real, textura ni intención afectiva; la presión basada en duración será siempre una aproximación cuando el dispositivo no entregue fuerza fiable.

Las siguientes mejoras concretas son incorporar MQTT con salas privadas y construir una malla corporal continua con deformación por vértices. También se deben validar rendimiento, permisos, multitáctil, orientación y micrófono en teléfonos Android y Safari iOS antes de afirmar compatibilidad.

## Ejecutar

Sirve esta carpeta mediante un servidor local, por ejemplo Live Server. Three.js se carga como módulo ES desde jsDelivr, por lo que la primera ejecución necesita conexión a internet. Para GitHub Pages basta publicar estos archivos en la raíz del repositorio.
