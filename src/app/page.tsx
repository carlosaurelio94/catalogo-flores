"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Editor } from "@/components/editor";
import { PAGINAS, Pagina } from "@/components/paginas";
import { useCatalogo } from "@/lib/almacen";
import { descargar, esperar, pdfDePagina, puedeCompartir } from "@/lib/pdf";

const ANCHO = 794;
const ALTO = 1123;

const sinSuscripcion = () => () => {};

function useEscala(
  ref: React.RefObject<HTMLDivElement | null>,
  ajustar: (ancho: number, alto: number) => number,
) {
  const [escala, setEscala] = useState(0.25);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new ResizeObserver(() => {
      setEscala(ajustar(el.clientWidth, el.clientHeight));
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref, ajustar]);
  return escala;
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
  const cajaPreview = useRef<HTMLDivElement>(null);
  const cajaExpandida = useRef<HTMLDivElement>(null);

  const ajusteCompleto = useCallback(
    (w: number, h: number) => Math.min((w - 24) / ANCHO, (h - 24) / ALTO),
    [],
  );
  const ajusteAncho = useCallback((w: number) => (w - 24) / ANCHO, []);

  const escala = useEscala(cajaPreview, ajusteCompleto);
  const escalaGrande = useEscala(cajaExpandida, ajusteAncho);

  async function generar(indices: number[]) {
    const archivos: File[] = [];
    for (const i of indices) {
      const nodo = exportables.current[i];
      if (!nodo) continue;
      setMensaje(`Generando ${PAGINAS[i].titulo}…`);
      const blob = await pdfDePagina(nodo);
      archivos.push(
        new File([blob], `${PAGINAS[i].archivo}.pdf`, {
          type: "application/pdf",
        }),
      );
    }
    return archivos;
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
      const [archivo] = await generar([pagina]);
      descargar(archivo, archivo.name);
      setMensaje(`Descargado: ${archivo.name}`);
    });

  const descargarTodas = () =>
    conProgreso(async () => {
      const archivos = await generar([0, 1, 2, 3]);
      setMensaje("Descargando los 4 archivos…");
      for (const archivo of archivos) {
        descargar(archivo, archivo.name);
        await esperar(600);
      }
      setMensaje("Listo: 4 PDF descargados.");
    });

  const compartirTodas = () =>
    conProgreso(async () => {
      const archivos = await generar([0, 1, 2, 3]);
      if (!puedeCompartir(archivos)) {
        setMensaje("Este navegador no puede compartir archivos. Descargalos.");
        return;
      }
      setMensaje(null);
      await navigator.share({ files: archivos, title: "Catálogo" });
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
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-3 py-2">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {PAGINAS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPagina(i)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${
                  pagina === i
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {i + 1}. {p.titulo}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setExpandido(true)}
            className="shrink-0 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-500"
          >
            Ampliar
          </button>
        </div>

        <div
          ref={cajaPreview}
          className="flex min-h-[38dvh] flex-1 items-center justify-center overflow-hidden bg-stone-200/60 p-3"
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

      <aside className="flex min-h-0 flex-1 flex-col border-t border-stone-200 bg-stone-50 lg:order-1 lg:w-[430px] lg:flex-none lg:border-t-0 lg:border-r">
        <div className="flex gap-1 border-b border-stone-200 bg-white px-3 pt-2">
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
                  ? "border-b-2 border-stone-800 font-medium text-stone-800"
                  : "text-stone-400"
              }`}
            >
              {texto}
            </button>
          ))}
          {pestana === "contenido" && (
            <span className="ml-auto self-center pb-2 text-[11px] text-stone-400">
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

        <div className="border-t border-stone-200 bg-white p-3">
          {mensaje && (
            <p className="mb-2 text-center text-xs text-stone-500">{mensaje}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={ocupado}
              onClick={descargarUna}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 disabled:opacity-50"
            >
              PDF de esta página
            </button>
            <button
              type="button"
              disabled={ocupado}
              onClick={descargarTodas}
              className="flex-1 rounded-lg bg-stone-800 px-3 py-3 text-sm text-white disabled:opacity-50"
            >
              {ocupado ? "Generando…" : "Los 4 PDF"}
            </button>
          </div>
          {comparte && (
            <button
              type="button"
              disabled={ocupado}
              onClick={compartirTodas}
              className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm text-stone-700 disabled:opacity-50"
            >
              Compartir los 4 PDF
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
          <div ref={cajaExpandida} className="flex-1 overflow-auto p-3">
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
