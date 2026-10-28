export default function PiePagina({ cantidad, total, renglones, onVaciar }) {
  return (
    <footer className="pie">
      <div>
        <div className="pie__resumen">
          {cantidad} {cantidad === 1 ? 'artículo' : 'artículos'} · Total{' '}
          <span className="pie__total">${total}</span>
        </div>
        <ul className="pie__lista">
          {renglones.map((r) => (
            <li key={r.id}>
              {r.cantidad} × {r.nombre}
            </li>
          ))}
        </ul>
      </div>
      <button className="pie__boton" onClick={onVaciar} disabled={cantidad === 0}>
        Vaciar carrito
      </button>
    </footer>
  );
}
