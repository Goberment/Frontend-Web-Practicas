import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

import { PrestamoService } from '../src/servicios/prestamo.service.js';
import { InMemoryPrestamoRepository } from '../src/infra/in-memory-prestamo.repository.js';
import { aPrestamoResponseDto } from '../contratos/prestamo.dto.js';
import type { ErrorResponseDto } from '../contratos/prestamo.dto.js';
import { validarCrearPrestamo, middlewareErrores } from './validar.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositorio = new InMemoryPrestamoRepository();
const servicio = new PrestamoService(repositorio);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'publico')));

app.get('/api/prestamos', async (req, res) => {
  const libroId = req.query.libroId;

  if (typeof libroId !== 'string' || libroId.trim() === '') {
    const cuerpo: ErrorResponseDto = { error: 'El parametro libroId es obligatorio' };
    res.status(400).json(cuerpo);
    return;
  }

  const prestamos = await servicio.listarPorLibro(libroId);
  res.status(200).json(prestamos.map(aPrestamoResponseDto));
});

app.post('/api/prestamos', async (req, res) => {
  const dto = validarCrearPrestamo(req.body);
  const prestamo = await servicio.crear(dto);

  res
    .status(201)
    .location(`/api/prestamos/${prestamo.folio}`)
    .json(aPrestamoResponseDto(prestamo));
});

app.use(middlewareErrores);

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
