export function leer<T>(clave: string, valorDefecto: T): T {
  try {
    const item = localStorage.getItem(clave);
    return item ? (JSON.parse(item) as T) : valorDefecto;
  } catch (error) {
    console.error(`Error al leer de LocalStorage [${clave}]:`, error);
    return valorDefecto;
  }
}

export function guardar<T>(clave: string, valor: T): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error(`Error al guardar en LocalStorage [${clave}]:`, error);
  }
}
