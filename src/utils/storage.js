export function leer(clave, porDefecto) {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? JSON.parse(raw) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
