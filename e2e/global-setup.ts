import { limpiarDatosDePrueba } from "./helpers/db";

// Corre una vez antes de toda la corrida. Limpia antes de empezar, no solo
// al final: si una corrida anterior se cortó a la mitad (proceso matado,
// timeout) y su globalTeardown nunca llegó a ejecutarse, esto asegura que
// cada corrida arranca desde una base limpia igual.
export default async function globalSetup() {
  await limpiarDatosDePrueba();
}
