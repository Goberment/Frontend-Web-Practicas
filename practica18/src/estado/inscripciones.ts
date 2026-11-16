import { create } from 'zustand';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';
import type { Inscripcion } from '../tipos.ts';

interface EstadoInscripciones {
  lista: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}

export const useInscripciones = create<EstadoInscripciones>()((set) => ({
  lista: [],
  cargando: true,
  error: null,

  cargar: async () => {
    set({ cargando: true, error: null });
    try {
      set({ lista: await traerMisInscripciones() });
    } catch (e) {
      set({ error: mensajeDeError(e, 'No se pudieron cargar tus inscripciones.') });
    } finally {
      set({ cargando: false });
    }
  },

  vaciar: () => set({ lista: [], cargando: false, error: null }),
}));
