import { useState } from 'react';
import { crearPedido } from '../api/tienda';

export default function FormularioPago({ productos, total, onPagado }) {
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const nuevos = {};
    if (!correo.includes('@')) nuevos.correo = 'El correo debe tener @';
    if (!/^\d{10}$/.test(telefono)) nuevos.telefono = 'El teléfono debe tener 10 dígitos';
    return nuevos;
  }

  async function manejarEnvio(e) {
    e.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    setErrorApi('');
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      const pedido = await crearPedido({ correo: correo.trim(), telefono, productos });
      onPagado(pedido);
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="pago" onSubmit={manejarEnvio} noValidate>
      <h2>Pago simulado · ${total}</h2>

      <label>
        Correo
        <input
          type="text"
          inputMode="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="karla@itson.edu.mx"
        />
      </label>
      {errores.correo && <p className="pago__error">{errores.correo}</p>}

      <label>
        Teléfono
        <input
          type="text"
          inputMode="numeric"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="6441234567"
        />
      </label>
      {errores.telefono && <p className="pago__error">{errores.telefono}</p>}

      {errorApi && <p className="pago__error">{errorApi}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Procesando…' : 'Pagar'}
      </button>
    </form>
  );
}
