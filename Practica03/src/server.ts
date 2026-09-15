// =====================================================================
//  src/server.ts   —   el servidor HTTP (checkpoint 5)
// =====================================================================
//  Este era el archivo que faltaba: expone por HTTP el mismo
//  PrestamoService que main.ts usa por consola, para que
//  publico/cliente.ts (el frontend) pueda hablar con el backend.
//
//  Se usa el modulo nativo `node:http`: no hace falta instalar
//  Express ni ningun otro framework para esta practica.
// =====================================================================

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { InMemoryPrestamoRepository } from './infra/in-memory-prestamo.repository.js';
import { PrestamoService } from './servicios/prestamos.service.js';
import { aResponseDto } from './dto/prestamo-response.dto.js';
import { EjemplarPrestadoError } from './errores/ejemplar-prestado.error.js';
import type {
  CrearPrestamoRequestDto,
  ErrorResponseDto,
} from '../contratos/prestamo.dto.js';

const PUERTO = Number(process.env.PORT ?? 3000);

// Carpeta con los archivos estaticos que se sirven al navegador.
const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const PUBLICO = join(RAIZ, 'publico');
const CLIENTE_COMPILADO = join(RAIZ, 'dist-cliente', 'publico', 'cliente.js');

const TIPOS_MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

// La UNICA linea que cambia para usar otra base de datos.
const repositorio = new InMemoryPrestamoRepository();
const servicio = new PrestamoService(repositorio);

function enviarJson(res: import('node:http').ServerResponse, codigo: number, cuerpo: unknown): void {
  const texto = JSON.stringify(cuerpo);
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(texto);
}

function enviarError(res: import('node:http').ServerResponse, codigo: number, error: ErrorResponseDto): void {
  enviarJson(res, codigo, error);
}

async function leerCuerpo(req: import('node:http').IncomingMessage): Promise<string> {
  const partes: Buffer[] = [];
  for await (const parte of req) partes.push(parte as Buffer);
  return Buffer.concat(partes).toString('utf-8');
}

function validarSolicitud(valor: unknown): valor is CrearPrestamoRequestDto {
  if (typeof valor !== 'object' || valor === null) return false;
  const v = valor as Record<string, unknown>;
  return (
    typeof v['libroId'] === 'string' &&
    v['libroId'].length > 0 &&
    typeof v['socioId'] === 'string' &&
    v['socioId'].length > 0 &&
    Array.isArray(v['ejemplares']) &&
    v['ejemplares'].length > 0 &&
    v['ejemplares'].every((e) => typeof e === 'number')
  );
}

async function manejarCrearPrestamo(
  req: import('node:http').IncomingMessage,
  res: import('node:http').ServerResponse,
): Promise<void> {
  let cuerpoCrudo: unknown;
  try {
    cuerpoCrudo = JSON.parse(await leerCuerpo(req));
  } catch {
    enviarError(res, 400, { error: 'JSON invalido' });
    return;
  }

  if (!validarSolicitud(cuerpoCrudo)) {
    enviarError(res, 400, {
      error: 'Solicitud invalida',
      detalle: 'Se esperaba { libroId, socioId, ejemplares: number[] } no vacios',
    });
    return;
  }

  try {
    const creado = await servicio.crear(cuerpoCrudo);
    enviarJson(res, 201, aResponseDto(creado));
  } catch (e) {
    if (e instanceof EjemplarPrestadoError) {
      enviarError(res, 409, { error: 'Ejemplar prestado', detalle: e.message });
    } else {
      enviarError(res, 500, { error: 'Error interno' });
    }
  }
}

async function manejarListarPrestamos(
  libroId: string | null,
  res: import('node:http').ServerResponse,
): Promise<void> {
  if (libroId === null || libroId.length === 0) {
    enviarError(res, 400, { error: 'Falta el parametro libroId' });
    return;
  }
  const prestamos = await servicio.listarPorLibro(libroId);
  enviarJson(res, 200, prestamos.map(aResponseDto));
}

async function servirEstatico(ruta: string, res: import('node:http').ServerResponse): Promise<void> {
  const archivo =
    ruta === '/' || ruta === '' ? join(PUBLICO, 'index.html')
    : ruta === '/cliente.js' ? CLIENTE_COMPILADO
    : join(PUBLICO, ruta);

  try {
    const contenido = await readFile(archivo);
    const tipo = TIPOS_MIME[extname(archivo)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
}

const servidor = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PUERTO}`);

  if (url.pathname === '/api/prestamos' && req.method === 'POST') {
    void manejarCrearPrestamo(req, res);
    return;
  }

  if (url.pathname === '/api/prestamos' && req.method === 'GET') {
    void manejarListarPrestamos(url.searchParams.get('libroId'), res);
    return;
  }

  if (req.method === 'GET') {
    void servirEstatico(url.pathname, res);
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Metodo no permitido');
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  console.log('Recuerda compilar el cliente antes: npm run build:cliente');
});
