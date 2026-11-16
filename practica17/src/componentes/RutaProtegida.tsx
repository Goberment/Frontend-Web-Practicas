import { Navigate, Outlet, useLocation } from 'react-router';
import { useSesion } from '../sesion/SesionContext.tsx';

export function RutaProtegida() {
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ desde: ubicacion.pathname }} />;
  }

  return <Outlet />;
}
