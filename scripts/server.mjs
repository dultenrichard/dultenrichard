import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
const root = resolve(process.cwd());
const port=Number(process.env.PORT||3000);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{
  let route;
  try {route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}
  catch {res.writeHead(400);res.end('Bad request');return;}
  const requested=resolve(root,'.'+route);
  if((requested!==root&&!requested.startsWith(root+sep))||route.split('/').some(p=>p.startsWith('.')&&p!=='.')){
    res.writeHead(403);res.end('Forbidden');return;
  }
  try {
    let target=requested;
    const info=await stat(target);
    if(info.isDirectory())target=join(target,'index.html');
    const bytes=await readFile(target);
    res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow','X-Content-Type-Options':'nosniff'});
    res.end(bytes);
  }catch(e){
    const body=await readFile(join(root,'404.html')).catch(()=>Buffer.from('Not found'));
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex,nofollow'});res.end(body);
  }
}).listen(port,'0.0.0.0',()=>console.log('Site preview on http://localhost:'+port));
