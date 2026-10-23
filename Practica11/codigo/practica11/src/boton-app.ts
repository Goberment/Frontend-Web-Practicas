import estilos from './boton-app.css?inline';

export class BotonApp extends HTMLElement {
  static observedAttributes = ['variante', 'deshabilitado'];

  private boton: HTMLButtonElement;

  constructor() {
    super();

    const sombra = this.attachShadow({ mode: 'open' });

    sombra.innerHTML = `
      <style>${estilos}</style>
      <button class="secundario"><slot>Vaciar</slot></button>
    `;
    this.boton = sombra.querySelector('button')!;
  }

  connectedCallback() {
    this.pintar();
  }

  attributeChangedCallback() {
    this.pintar();
  }

  private pintar() {
    this.boton.className = this.getAttribute('variante') ?? 'primario';
    this.boton.disabled = this.hasAttribute('deshabilitado');
  }
}

customElements.define('boton-app', BotonApp);
