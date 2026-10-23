import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global(): se importa una sola vez en AppModule y ya esta
// disponible para inyectar en cualquier otro modulo. Por eso los
// modulos de Clases, Horarios, Miembros e Inscripciones NO tienen que
// importar nada: solo cambian su useClass.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
