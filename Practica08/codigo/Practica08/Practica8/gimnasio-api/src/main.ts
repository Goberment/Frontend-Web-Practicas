// Primera linea, antes que cualquier otro import: carga el .env en
// process.env. `prisma.config.ts` hace lo mismo, pero eso solo aplica
// al CLI de Prisma (migrate, studio). La aplicacion cuando corre con
// `npm run start:dev` necesita cargarlo por su cuenta, o PrismaService
// no encuentra DATABASE_URL.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
