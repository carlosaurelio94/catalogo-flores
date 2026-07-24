"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { Editor } from "@/components/editor";
import { PAGINAS, Pagina } from "@/components/paginas";
import { useCatalogo } from "@/lib/almacen";
import { alternarModo, esOscuro, suscribirModo } from "@/lib/modo";
import { descargar, pdfDePagina, pdfDeVarias, puedeCompartir } from "@/lib/pdf";

const ANCHO = 794;
const ALTO = 1123;

const sinSuscripcion = () => () => {};

// Ref de callback y no useEffect: la caja se monta recién cuando termina de
// cargar el catálogo, y un efecto con dependencias vacías nunca la vería.
function useEscala(ajustar: (ancho: number, alto: number) => number) {
  const [escala, setEscala] = useState(0.25);
  const medir = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      const observador = new ResizeObserver(() =>
        setEscala(ajustar(el.clientWidth, el.clientHeight)),
      );
      observador.observe(el);
      return () => observador.disconnect();
    },
    [ajustar],
  );
  return [medir, escala] as const;
}

function BotonModo() {
  const oscuro = useSyncExternalStore(suscribirModo, esOscuro, () => false);
  return (
    <button
      type="button"
      onClick={alternarModo}
      title={oscuro ? "Pasar a modo claro" : "Pasar a modo oscuro"}
      aria-label={oscuro ? "Pasar a modo claro" : "Pasar a modo oscuro"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 oscuro:border-stone-700 oscuro:text-stone-300"
    >
      {oscuro ? <IconoSol /> : <IconoLuna />}
    </button>
  );
}

function IconoSol() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((grados) => (
        <line
          key={grados}
          x1="12"
          y1="1.8"
          x2="12"
          y2="4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${grados} 12 12)`}
        />
      ))}
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const { catalogo, editar, reiniciar, listo } = useCatalogo();
  const [pagina, setPagina] = useState(0);
  const [pestana, setPestana] = useState<"contenido" | "diseno">("contenido");
  const [expandido, setExpandido] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const comparte = useSyncExternalStore(
    sinSuscripcion,
    () => !!navigator.share,
    () => false,
  );

  const exportables = useRef<(HTMLDivElement | null)[]>([]);

  const ajusteCompleto = useCallback(
    (w: number, h: number) => Math.min((w - 24) / ANCHO, (h - 24) / ALTO),
    [],
  );
  const ajusteAncho = useCallback((w: number) => (w - 24) / ANCHO, []);

  const [medirPreview, escala] = useEscala(ajusteCompleto);
  const [medirExpandida, escalaGrande] = useEscala(ajusteAncho);

  async function generarCatalogo() {
    const nodos = exportables.current.filter(
      (nodo): nodo is HTMLDivElement => !!nodo,
    );
    const blob = await pdfDeVarias(nodos, (i) =>
      setMensaje(`Generando ${PAGINAS[i].titulo}…`),
    );
    return new File([blob], "catalogo.pdf", { type: "application/pdf" });
  }

  async function conProgreso(tarea: () => Promise<void>) {
    if (ocupado) return;
    setOcupado(true);
    try {
      await tarea();
    } catch (error) {
      console.error(error);
      setMensaje("Hubo un problema al generar el PDF.");
    } finally {
      setOcupado(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  }

  const descargarUna = () =>
    conProgreso(async () => {
      const nodo = exportables.current[pagina];
      if (!nodo) return;
      setMensaje(`Generando ${PAGINAS[pagina].titulo}…`);
      const nombre = `${PAGINAS[pagina].archivo}.pdf`;
      descargar(await pdfDePagina(nodo), nombre);
      setMensaje(`Descargado: ${nombre}`);
    });

  const descargarCatalogo = () =>
    conProgreso(async () => {
      const archivo = await generarCatalogo();
      descargar(archivo, archivo.name);
      setMensaje("Listo: catálogo completo, 4 páginas en un PDF.");
    });

  const compartirCatalogo = () =>
    conProgreso(async () => {
      const archivo = await generarCatalogo();
      if (!puedeCompartir([archivo])) {
        setMensaje("Este navegador no puede compartir archivos. Descargalo.");
        return;
      }
      setMensaje(null);
      await navigator.share({ files: [archivo], title: "Catálogo" });
    });

  if (!listo) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-stone-400">
        Cargando…
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col lg:flex-row">
      <main className="flex min-h-0 flex-1 flex-col lg:order-2">
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-3 py-2 oscuro:border-stone-800 oscuro:bg-stone-900">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {PAGINAS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPagina(i)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${
                  pagina === i
                    ? "bg-stone-800 text-white oscuro:bg-stone-100 oscuro:text-stone-900"
                    : "bg-stone-100 text-stone-500 oscuro:bg-stone-800 oscuro:text-stone-400"
                }`}
              >
                {i + 1}. {p.titulo}
              </button>
            ))}
          </div>
          <BotonModo />
          <button
            type="button"
            onClick={() => setExpandido(true)}
            className="shrink-0 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-500 oscuro:border-stone-700 oscuro:text-stone-300"
          >
            Ampliar
          </button>
        </div>

        <div
          ref={medirPreview}
          className="flex min-h-[38dvh] flex-1 items-center justify-center overflow-hidden bg-stone-200/60 p-3 oscuro:bg-black"
        >
          <div
            style={{ width: ANCHO * escala, height: ALTO * escala }}
            className="shadow-[0_10px_40px_rgba(60,40,35,0.18)]"
          >
            <div
              style={{
                transform: `scale(${escala})`,
                transformOrigin: "top left",
              }}
            >
              <Pagina indice={pagina} catalogo={catalogo} />
            </div>
          </div>
        </div>
      </main>

      <aside className="flex min-h-0 flex-1 flex-col border-t border-stone-200 bg-stone-50 oscuro:border-stone-800 oscuro:bg-stone-950 lg:order-1 lg:w-[430px] lg:flex-none lg:border-t-0 lg:border-r">
        <div className="flex gap-1 border-b border-stone-200 bg-white px-3 pt-2 oscuro:border-stone-800 oscuro:bg-stone-900">
          {(
            [
              ["contenido", "Contenido"],
              ["diseno", "Diseño"],
            ] as const
          ).map(([id, texto]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPestana(id)}
              className={`rounded-t-lg px-4 py-2 text-sm transition ${
                pestana === id
                  ? "border-b-2 border-stone-800 font-medium text-stone-800 oscuro:border-stone-100 oscuro:text-stone-100"
                  : "text-stone-400 oscuro:text-stone-500"
              }`}
            >
              {texto}
            </button>
          ))}
          {pestana === "contenido" && (
            <span className="ml-auto self-center pb-2 text-[11px] text-stone-400 oscuro:text-stone-500">
              {PAGINAS[pagina].titulo}
            </span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Editor
            catalogo={catalogo}
            editar={editar}
            pagina={pagina}
            pestana={pestana}
            onReiniciar={reiniciar}
          />
        </div>

        <div className="border-t border-stone-200 bg-white p-3 oscuro:border-stone-800 oscuro:bg-stone-900">
          {mensaje && (
            <p className="mb-2 text-center text-xs text-stone-500 oscuro:text-stone-400">
              {mensaje}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={ocupado}
              onClick={descargarUna}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200 disabled:opacity-50"
            >
              PDF de esta página
            </button>
            <button
              type="button"
              disabled={ocupado}
              onClick={descargarCatalogo}
              className="flex-1 rounded-lg bg-stone-800 px-3 py-3 text-sm text-white oscuro:bg-stone-100 oscuro:text-stone-900 disabled:opacity-50"
            >
              {ocupado ? "Generando…" : "Catálogo completo"}
            </button>
          </div>
          {comparte && (
            <button
              type="button"
              disabled={ocupado}
              onClick={compartirCatalogo}
              className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200 disabled:opacity-50"
            >
              Compartir catálogo
            </button>
          )}
        </div>
      </aside>

      {expandido && (
        <div className="fixed inset-0 z-50 flex flex-col bg-stone-900/95">
          <div className="flex items-center gap-2 p-3">
            <div className="flex gap-1 overflow-x-auto">
              {PAGINAS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPagina(i)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                    pagina === i
                      ? "bg-white text-stone-900"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setExpandido(false)}
              className="ml-auto rounded-full bg-white/10 px-4 py-1.5 text-xs text-white"
            >
              Cerrar
            </button>
          </div>
          <div ref={medirExpandida} className="flex-1 overflow-auto p-3">
            <div
              className="mx-auto"
              style={{
                width: ANCHO * escalaGrande,
                height: ALTO * escalaGrande,
              }}
            >
              <div
                style={{
                  transform: `scale(${escalaGrande})`,
                  transformOrigin: "top left",
                }}
              >
                <Pagina indice={pagina} catalogo={catalogo} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: -20000,
          width: ANCHO,
          pointerEvents: "none",
        }}
      >
        {PAGINAS.map((p, i) => (
          <div
            key={p.id}
            ref={(nodo) => {
              exportables.current[i] = nodo;
            }}
          >
            <Pagina indice={i} catalogo={catalogo} />
          </div>
        ))}
      </div>
    </div>
  );
}
