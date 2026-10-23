import { copyFileSync, rmSync } from 'node:fs';

copyFileSync('build-cliente/publico/cliente.js', 'publico/cliente.js');
rmSync('build-cliente', { recursive: true, force: true });
