import type {
  PrestamoResponseDto,
  CrearPrestamoRequestDto,
  ErrorResponseDto,
} from '../contratos/prestamo.dto.js';

const $ = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (el === null) throw new Error(`Falta el elemento #${id}`);
  return el;
};

const form = $('form-prestamo') as HTMLFormElement;
const inputLibro = $('libroId') as HTMLInputElement;
const inputSocio = $('socioId') as HTMLInputElement;
const inputEjemplares = $('ejemplares') as HTMLInputElement;
const salida = $('salida');
const lista = $('lista');

function mostrarEstado(codigo: number, cuerpo: unknown): void {
  const clase = codigo < 300 ? 'ok' : codigo < 500 ? 'aviso' : 'mal';
  salida.className = clase;
  salida.textContent = `HTTP ${codigo}\n\n${JSON.stringify(cuerpo, null, 2)}`;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();

  const cuerpo: CrearPrestamoRequestDto = {
    libroId: inputLibro.value,
    socioId: inputSocio.value,
    ejemplares: inputEjemplares.value
      .split(',')
      .map((t) => Number(t.trim()))
      .filter((n) => !Number.isNaN(n)),
  };

  const res = await fetch('/api/prestamos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });


  if (res.status === 201) {
    const creado = (await res.json()) as PrestamoResponseDto;
    mostrarEstado(201, creado);
    await recargarLista(creado.libroId);
  } else {
    const error = (await res.json()) as ErrorResponseDto;
    mostrarEstado(res.status, error);
  }
});


async function recargarLista(libroId: string): Promise<void> {
  const res = await fetch(`/api/prestamos?libroId=${encodeURIComponent(libroId)}`);
  if (!res.ok) {
    lista.innerHTML = '<li class="vacio">No se pudo consultar</li>';
    return;
  }

  const prestamos = (await res.json()) as PrestamoResponseDto[];

  if (prestamos.length === 0) {
    lista.innerHTML = '<li class="vacio">Sin prestamos para ese libro</li>';
    return;
  }

  lista.innerHTML = prestamos
    .map(
      (p) => `<li>
        <strong>${p.folio}</strong>
        <span class="chip ${p.estado}">${p.estado}</span>
        ejemplares ${p.ejemplares.join(', ')} &middot; socio ${p.socioId}
      </li>`,
    )
    .join('');
}

$('btn-consultar').addEventListener('click', () => {
  void recargarLista(inputLibro.value);
});

void recargarLista(inputLibro.value);
