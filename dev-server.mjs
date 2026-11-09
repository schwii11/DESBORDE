import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = process.cwd();
const preferredPort = Number(process.env.DESBORDE_PORT || 8077);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.glb':'model/gltf-binary', '.png':'image/png' };

const server = createServer(async (request,response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    const data = await readFile(join(root,pathname));
    response.writeHead(200,{'Content-Type':mime[extname(pathname)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(data);
  } catch {
    response.writeHead(404); response.end('404');
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
    console.error(`El puerto ${preferredPort} no está disponible.`);
    console.error('Prueba: $env:DESBORDE_PORT=8090; node dev-server.mjs');
    process.exit(1);
  }
  throw error;
});

server.listen(preferredPort, '0.0.0.0', () => {
  console.log(`DESBORDE abierto en: http://localhost:${preferredPort}`);
  console.log(`En este computador también puedes usar: http://127.0.0.1:${preferredPort}`);
});
