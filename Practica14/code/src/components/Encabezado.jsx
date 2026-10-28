export default function Encabezado({ cantidad }) {
  return (
    <header className="encabezado">
      <div className="encabezado__marca">🛍️ Tienda</div>
      <div className="encabezado__carrito">
        Carrito: <strong>{cantidad}</strong>
      </div>
    </header>
  );
}
