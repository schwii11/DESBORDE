import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = process.cwd();
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.glb':'model/gltf-binary', '.png':'image/png' };

createServer(async (request,response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    const data = await readFile(join(root,pathname));
    response.writeHead(200,{'Content-Type':mime[extname(pathname)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(data);
  } catch {
    response.writeHead(404); response.end('404');
  }
}).listen(8081,'127.0.0.1',() => console.log('DESBORDE: http://127.0.0.1:8081'));
