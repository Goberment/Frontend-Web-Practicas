import cliente, { URL_API } from './cliente';

function mensajeDeError(error) {
  if (error.response) {
    const mensaje = error.response.data?.message;
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
    return `La API respondió con el error ${error.response.status}.`;
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'La API tardó demasiado en responder.';
  }
  if (error.request) {
    return `No se pudo conectar con la API (${URL_API}). Revisa que esté encendida.`;
  }
  return `Error inesperado: ${error.message}`;
}

export async function obtenerProductos() {
  let respuesta;
  try {
    respuesta = await cliente.get('/productos');
  } catch (error) {
    throw new Error(mensajeDeError(error));
  }
  const lista = respuesta.data?.data;
  if (!Array.isArray(lista)) {
    throw new Error(`La respuesta de ${URL_API}/productos no tiene la forma { data, meta }. ¿Es el puerto correcto?`);
  }
  return lista;
}

export async function crearPedido({ correo, telefono, productos }) {
  let respuesta;
  try {
    respuesta = await cliente.post('/pedidos', { correo, telefono, productos });
  } catch (error) {
    throw new Error(mensajeDeError(error));
  }
  return respuesta.data.data;
}
