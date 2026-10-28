import { useEffect, useState } from 'react';
import { obtenerProductos } from '../api/tienda';

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    setCargando(true);
    setError(null);

    obtenerProductos()
      .then((lista) => {
        if (!cancelado) setProductos(lista);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    //Eso se cambuio 
      return () => {
      cancelado = true;
    };
  }, [intento]);
 
   
    //Por esto
    /*return () => {
     cancelado = true;
       };
   });*/

  const recargar = () => setIntento((n) => n + 1);

  return { productos, cargando, error, recargar };
}
