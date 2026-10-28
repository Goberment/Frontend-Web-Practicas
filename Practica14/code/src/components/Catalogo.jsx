import TarjetaProducto from './TarjetaProducto';

export default function Catalogo({ productos, onAgregar }) {
  return (
    <section className="catalogo">
      {productos.map((p) => (
        <TarjetaProducto key={p.id} producto={p} onAgregar={onAgregar} />
      ))}
    </section>
  );
}
