import { Module } from '@nestjs/common';
import { ClasesController } from './clases.controller';
import { ClasesService } from './clases.service';
import { ClasePrismaRepository } from './infra/clase-prisma.repository';
// La implementacion vieja sigue ahi, intacta. Para volver a memoria
// basta cambiar el useClass de abajo:
// import { ClaseMemoriaRepository } from './infra/clase-memoria.repository';
import { CLASE_REPOSITORY } from './clases.tokens';

@Module({
  controllers: [ClasesController],
  providers: [
    ClasesService,
    {
      provide: CLASE_REPOSITORY,
      useClass: ClasePrismaRepository,
      //         ^^^^^^^^^^^^^^^^^^^^^
      // ESTA es la unica linea que cambia. Ni el Service ni el
      // Controller se enteran de que ahora hay un MySQL detras.
    },
  ],
})
export class ClasesModule {}
