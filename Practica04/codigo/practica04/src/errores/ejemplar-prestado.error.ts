export class EjemplarPrestadoError extends Error {
  constructor(public readonly ejemplar: number) {
    super(`El ejemplar ${ejemplar} ya esta prestado`);
    this.name = 'EjemplarPrestadoError';
  }
}
