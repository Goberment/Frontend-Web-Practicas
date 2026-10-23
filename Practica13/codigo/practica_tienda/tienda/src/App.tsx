import { useState } from "react";
import { productos, type Producto } from "./datos.ts";
import { Layout } from "./Layout.tsx";
import { Encabezado } from "./Encabezado.tsx";
import { PiePagina } from "./PiePagina.tsx";
import { Filtros } from "./Filtros.tsx";
import { Catalogo } from "./Catalogo.tsx";

const categorias = ["todas", ...new Set(productos.map(p => p.categoria))];

export default function App() {
  // Estados
  const [categoria, setCategoria] = useState("todas");
  const [carrito, setCarrito] = useState<Producto[]>([]);

  // Derivados
  const visibles = categoria === "todas" ? productos : productos.filter(p => p.categoria === categoria);
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  // Evento
 function agregar(producto: Producto) {
  carrito.push(producto);
  console.log("Piezas en el arreglo:", carrito.length);
}

  return (
    <Layout encabezado={<Encabezado piezas={carrito.length} />} pie={<PiePagina piezas={carrito.length} total={total} />}>
      <section className="portada">
        <h1>Catálogo de Temporada</h1>
        <p>{visibles.length} productos disponibles</p>
        <Filtros categorias={categorias} activa={categoria} onCambiar={setCategoria} />
        <Catalogo productos={visibles} onAgregar={agregar} />
      </section>
    </Layout>
  )
}