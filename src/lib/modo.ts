"use client";

// El script en layout.tsx aplica la clase antes del primer pintado; acá solo
// la alternamos. Por eso el estado vive en el DOM y no en React.
export const CLAVE_MODO = "modo-editor";

const oyentes = new Set<() => void>();

export function alternarModo() {
  const oscuro = document.documentElement.classList.toggle("oscuro");
  localStorage.setItem(CLAVE_MODO, oscuro ? "oscuro" : "claro");
  oyentes.forEach((avisar) => avisar());
}

export function suscribirModo(oyente: () => void) {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

export function esOscuro() {
  return document.documentElement.classList.contains("oscuro");
}
