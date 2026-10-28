export default function TarjetaProducto({ producto, onAgregar }) {
  const agotado = producto.existencia === 0;

  return (
    <article className="tarjeta">
      <img className="tarjeta__imagen" src={producto.imagen} alt={producto.nombre} />
      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__nombre">{producto.nombre}</h3>
        <p className="tarjeta__precio">${producto.precio}</p>
        <p className={agotado ? 'tarjeta__existencia tarjeta__existencia--agotado' : 'tarjeta__existencia'}>
          {agotado ? 'Agotado' : `Existencia: ${producto.existencia}`}
        </p>
        <button className="tarjeta__boton" disabled={agotado} onClick={() => onAgregar(producto.id)}>
          {agotado ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
