import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decoradores/roles.decorator';
import { PayloadJwt, Rol } from '../dominio/usuario';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const permitidos = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (!permitidos || permitidos.length === 0) return true;

    const req = contexto.switchToHttp().getRequest<{ user?: PayloadJwt }>();

    if (!req.user || !permitidos.includes(req.user.rol)) {
      throw new ForbiddenException('No tienes permiso para esta accion');
    }
    return true;
  }
}
