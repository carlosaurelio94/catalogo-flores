"use client";

import { get, set } from "idb-keyval";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATALOGO_INICIAL,
  type Catalogo,
  type Encaje,
  type Foto,
} from "./tipos";

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

// Un catálogo guardado con una versión anterior puede no tener campos nuevos,
// o tener una estructura vieja. Todo lo que no encaje vuelve al valor inicial.
function fusionar(base: Catalogo, guardado: Partial<Catalogo>): Catalogo {
  const colecciones = Array.isArray(guardado.colecciones)
    ? guardado.colecciones.map((col, i) => ({
        ...(base.colecciones[i] ?? base.colecciones[0]),
        ...col,
        foto: conEncaje(col?.foto, "entero"),
        arreglos: Array.isArray(col?.arreglos)
          ? col.arreglos.map((arr) => ({
              ...arr,
              foto: conEncaje(arr?.foto, "cubrir"),
            }))
          : [],
      }))
    : base.colecciones;

  return {
    moneda: guardado.moneda ?? base.moneda,
    tema: { ...base.tema, ...guardado.tema },
    marca: { ...base.marca, ...guardado.marca },
    portada: {
      ...base.portada,
      ...guardado.portada,
      foto: conEncaje(guardado.portada?.foto, "cubrir"),
    },
    nosotros: {
      ...base.nosotros,
      ...guardado.nosotros,
      foto: conEncaje(guardado.nosotros?.foto, "entero"),
      datos: guardado.nosotros?.datos ?? base.nosotros.datos,
    },
    indice: { ...base.indice, ...guardado.indice },
    colecciones: colecciones.length > 0 ? colecciones : base.colecciones,
  };
}

// El campo "encaje" es posterior a las primeras versiones guardadas.
function conEncaje(f: Foto | undefined, porDefecto: Encaje): Foto {
  return {
    src: f?.src ?? null,
    pos: f?.pos ?? 50,
    encaje: f?.encaje ?? porDefecto,
  };
}
