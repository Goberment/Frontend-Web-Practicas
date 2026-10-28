export default function Layout({ children }) {
  return (
    <div className="tienda">
      <main className="contenido">{children}</main>
    </div>
  );
}
