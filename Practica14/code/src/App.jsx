import { useState } from 'react';
import { useProductos } from './hooks/useProductos';
import Layout from './components/Layout';
import Encabezado from './components/Encabezado';
import Filtros from './components/Filtros';
import Catalogo from './components/Catalogo';
import PiePagina from './components/PiePagina';
import Cargando from './components/Cargando';
import Error from './components/Error';
import FormularioPago from './components/FormularioPago';

export default function App() {
  const { productos, cargando, error, recargar } = useProductos();

  const [carrito, setCarrito] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [confirmacion, setConfirmacion] = useState(null);

  const agregar = (id) => {
    setConfirmacion(null);
    setCarrito((actual) => [...actual, id]);
  };
  const vaciar = () => setCarrito([]);

  const precioDe = (id) => productos.find((p) => p.id === id)?.precio ?? 0;
  const total = carrito.reduce((suma, id) => suma + precioDe(id), 0);

  const renglones = [...new Set(carrito)].map((id) => ({
    id,
    nombre: productos.find((p) => p.id === id)?.nombre ?? id,
    cantidad: carrito.filter((x) => x === id).length,
  }));

  const categorias = ['todos', ...new Set(productos.map((p) => p.categoria))];
  const visibles = categoria === 'todos' ? productos : productos.filter((p) => p.categoria === categoria);

  function alPagar(pedido) {
    setConfirmacion(pedido);
    vaciar();
    recargar();
  }

  return (
    <>
      <Encabezado cantidad={carrito.length} />
      <Layout>
        <div className="portada">
          <h1>Tienda deportiva</h1>
          <p>Productos que vienen de nuestra propia API.</p>
        </div>

        {cargando && <Cargando />}
        {!cargando && error && <Error mensaje={error} onReintentar={recargar} />}
        {!cargando && !error && (
          <>
            <Filtros categorias={categorias} activa={categoria} onCambiar={setCategoria} />
            <Catalogo productos={visibles} onAgregar={agregar} />
          </>
        )}

        {confirmacion && (
          <p className="confirmacion">
            ¡Pedido confirmado! Folio: {confirmacion.folio} · Total: ${confirmacion.total}
          </p>
        )}

        {carrito.length > 0 && (
          <FormularioPago productos={carrito} total={total} onPagado={alPagar} />
        )}
      </Layout>
      <PiePagina cantidad={carrito.length} total={total} renglones={renglones} onVaciar={vaciar} />
    </>
  );
}
