import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository';
// Se conecta en la Practica 9.
// import { InscripcionPrismaRepository } from './infra/inscripcion-prisma.repository';
import { INSCRIPCION_REPOSITORY } from './inscripciones.tokens';

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    {
      provide: INSCRIPCION_REPOSITORY,
      useClass: InscripcionMemoriaRepository,
    },
  ],
})
export class InscripcionesModule {}
