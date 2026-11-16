import { Outlet } from 'react-router';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';

export function Layout() {
  return (
    <div className="disposicion">
      <Encabezado />
      <main className="disposicion__contenido">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
}
