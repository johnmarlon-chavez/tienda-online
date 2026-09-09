import { limpiarDatosDePrueba } from "./helpers/db";

// Corre una vez después de toda la corrida, incluso si algún test falló.
export default async function globalTeardown() {
  await limpiarDatosDePrueba();
}
