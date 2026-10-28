export default function Error({ mensaje, onReintentar }) {
  return (
    <div className="error" role="alert">
      <p>{mensaje}</p>
      <button onClick={onReintentar}>Reintentar</button>
    </div>
  );
}
