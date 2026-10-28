export default function Filtros({ categorias, activa, onCambiar }) {
  return (
    <div className="filtros">
      {categorias.map((c) => (
        <button
          key={c}
          className={c === activa ? 'filtros__boton filtros__boton--activo' : 'filtros__boton'}
          onClick={() => onCambiar(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
