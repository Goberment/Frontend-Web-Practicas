// Primera linea, antes que cualquier otro import: carga el .env en
// process.env. `prisma.config.ts` hace lo mismo, pero eso solo aplica
// al CLI de Prisma (migrate, studio). La aplicacion cuando corre con
// `npm run start:dev` necesita cargarlo por su cuenta, o PrismaService
// no encuentra DATABASE_URL.
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { ErrorDominioFilter } from './comun/error-dominio.filter';

// Los unicos dos origenes (frontends de desarrollo) autorizados.
const ORIGENES_PERMITIDOS = ['http://localhost:5173', 'http://localhost:4200'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Un identificador por peticion, para poder rastrearla. Se manda en la
  // cabecera X-Request-Id (CORS la expone mas abajo).
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Request-Id', randomUUID());
    next();
  });

  // Validacion en la frontera: lo que no cumple el DTO nunca llega al Service.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta los campos que el DTO no declara...
      forbidNonWhitelisted: true, // ...y en vez de descartarlos en silencio, responde 400
      transform: true, // convierte el cuerpo en una instancia de la clase DTO
      forbidUnknownValues: true, // rechaza objetos sin decoradores en vez de dejarlos pasar
    }),
  );

  // Traduccion centralizada: errores de dominio -> 404 / 409.
  app.useGlobalFilters(new ErrorDominioFilter());

  app.enableCors({
    origin: ORIGENES_PERMITIDOS,
    // Sin esto el JavaScript de un navegador NO puede leer estas cabeceras
    // aunque lleguen en la respuesta.
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
