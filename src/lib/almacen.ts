"use client";

import { get, set } from "idb-keyval";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATALOGO_INICIAL, type Catalogo } from "./tipos";

const CLAVE = "catalogo-urbano-flowers";

export function useCatalogo() {
  const [catalogo, setCatalogo] = useState<Catalogo>(CATALOGO_INICIAL);
  const [listo, setListo] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    get<Catalogo>(CLAVE)
      .then((guardado) => {
        if (guardado) setCatalogo(fusionar(CATALOGO_INICIAL, guardado));
      })
      .finally(() => setListo(true));
  }, []);

  useEffect(() => {
    if (!listo) return;
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      set(CLAVE, catalogo);
    }, 400);
  }, [catalogo, listo]);

  const editar = useCallback((fn: (borrador: Catalogo) => void) => {
    setCatalogo((previo) => {
      const copia = structuredClone(previo);
      fn(copia);
      return copia;
    });
  }, []);

  const reiniciar = useCallback(() => setCatalogo(CATALOGO_INICIAL), []);

  return { catalogo, editar, reiniciar, listo };
}

// Un catálogo guardado con una versión anterior puede no tener campos nuevos.
function fusionar(base: Catalogo, guardado: Catalogo): Catalogo {
  return {
    tema: { ...base.tema, ...guardado.tema },
    portada: { ...base.portada, ...guardado.portada },
    signature: { ...base.signature, ...guardado.signature },
    colecciones: { ...base.colecciones, ...guardado.colecciones },
    masDisenos: { ...base.masDisenos, ...guardado.masDisenos },
  };
}
