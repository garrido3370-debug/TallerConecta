'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { URL } = require('node:url');
const PUBLIC = path.join(__dirname, 'public');
const DEFAULT_FILE = path.join(__dirname, 'data', 'solicitudes.json');

function createApp({ dataFile = process.env.DATA_FILE || DEFAULT_FILE } = {}) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  let records = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, 'utf8')) : [];
  const persist = () => {
    const tmp = `${dataFile}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(records, null, 2));
    fs.renameSync(tmp, dataFile);
  };
  const json = (res, status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(payload));
  };
  const readBody = async req => {
    let text = '';
    for await (const chunk of req) {
      text += chunk;
      if (text.length > 10000) throw Error('Solicitud demasiado grande');
    }
    try { return JSON.parse(text); } catch { throw Error('JSON incorrecto'); }
  };
  const handler = async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathname = url.pathname;
      if (pathname === '/api/solicitudes' && req.method === 'GET') {
        return json(res, 200, records.map(({id, matricula, descripcion, precioCent, estado, creadoEn, decididoEn}) => ({ id, matricula, descripcion, precioCent, estado, creadoEn, decididoEn })));
      }
      if (pathname === '/api/solicitudes' && req.method === 'POST') {
        const body = await readBody(req);
        const matricula = String(body.matricula ?? '').trim().toUpperCase();
        const descripcion = String(body.descripcion ?? '').trim();
        const price = body.precioCent;
        if (!/^[A-Z0-9 -]{4,14}$/.test(matricula) || descripcion.length < 8 || descripcion.length > 500 || !Number.isSafeInteger(price) || price < 1 || price > 100000000) {
          return json(res, 400, { error: 'Revisa matrícula, descripción (8–500 caracteres) y precio total.' });
        }
        const record = { id: randomBytes(20).toString('hex'), matricula, descripcion, precioCent: price, estado: 'pendiente', creadoEn: new Date().toISOString(), decididoEn: null };
        records.unshift(record);
        persist();
        return json(res, 201, record);
      }
      const match = pathname.match(/^\/api\/cliente\/([a-f0-9]{40})(?:\/decision)?$/);
      if (match) {
        const record = records.find(x => x.id === match[1]);
        if (!record) return json(res, 404, { error: 'Solicitud no encontrada' });
        if (pathname.endsWith('/decision') && req.method === 'POST') {
          const body = await readBody(req);
          if (!['aprobado', 'rechazado'].includes(body.estado)) return json(res, 400, { error: 'Decisión no válida' });
          if (record.estado !== 'pendiente') return json(res, 409, { error: 'Esta solicitud ya fue respondida', estado: record.estado });
          record.estado = body.estado;
          record.decididoEn = new Date().toISOString();
          persist();
          return json(res, 200, record);
        }
        if (req.method === 'GET' && !pathname.endsWith('/decision')) return json(res, 200, record);
      }
      if (req.method !== 'GET') return json(res, 404, {error: 'Ruta no encontrada'});
      const route = pathname === '/' ? 'index.html' : pathname === '/cliente' ? 'cliente.html' : pathname.slice(1);
      if (!['index.html', 'cliente.html', 'styles.css', 'app.js', 'cliente.js'].includes(route)) return json(res, 404, {error: 'Archivo no encontrado'});
      const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8'};
      res.writeHead(200, {'Content-Type':types[path.extname(route)], 'X-Content-Type-Options':'nosniff'});
      return fs.createReadStream(path.join(PUBLIC, route)).pipe(res);
    } catch (err) {
      return json(res, err.message.includes('incorrecto') || err.message.includes('grande') ? 400 : 500, { error: err.message.includes('incorrecto') || err.message.includes('grande') ? err.message : 'Error interno' });
    }
  };
  return http.createServer(handler);
}
if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, '0.0.0.0', () => console.log(`TallerConecta en http://localhost:${port}`));
}
module.exports = {createApp};
