import estilos from './tarjeta-producto.css?inline';
import type { DetalleAgregar } from './tipos';
import './boton-app';

const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export class TarjetaProducto extends HTMLElement {
  static observedAttributes = ['producto-id', 'nombre', 'precio', 'imagen', 'existencia'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.pintar();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.pintar();
  }

  private pintar() {
    const id = this.getAttribute('producto-id') ?? '';
    const nombre = this.getAttribute('nombre') ?? '';
    const precio = Number(this.getAttribute('precio'));
    const imagen = this.getAttribute('imagen') ?? '';
    const existencia = Number(this.getAttribute('existencia'));
    const agotado = existencia === 0;

    this.shadowRoot!.innerHTML = `
      <style>${estilos}</style>
      <article class="tarjeta">
        <img src="${imagen}" alt="${nombre}">
        <div class="cuerpo">
          <h3>${nombre}</h3>
          <p class="precio">${pesos.format(precio)}</p>
          <p class="existencia ${agotado ? 'agotado' : ''}">
            ${agotado ? 'Agotado' : `${existencia} disponibles`}
          </p>
          <boton-app ${agotado ? 'deshabilitado' : ''}>Agregar al carrito</boton-app>
        </div>
      </article>
    `;

    this.shadowRoot!.querySelector('boton-app')!.addEventListener('click', () => {
      if (agotado) return;
      const detalle: DetalleAgregar = { id, nombre, precio };
      this.dispatchEvent(
        new CustomEvent('agregar', {
          detail: detalle,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
}

customElements.define('tarjeta-producto', TarjetaProducto);
