"use client";

import { useRef } from "react";
import {
  ARREGLOS_POR_PAGINA,
  FUENTES_SCRIPT,
  FUENTES_TITULO,
  PALETAS,
  arregloNuevo,
  coleccionNueva,
  type Catalogo,
  type IconoDatoId,
  type IconoId,
} from "@/lib/tipos";
import type { PaginaInfo } from "./paginas";
import { ICONOS, ICONOS_DATO, Icono, IconoDato } from "./adornos";
import {
  Campo,
  CampoArea,
  CampoColor,
  CampoFoto,
  CampoSelector,
  Seccion,
} from "./campos";

type Editar = (fn: (borrador: Catalogo) => void) => void;

export function Editor({
  catalogo,
  editar,
  info,
  pestana,
  onReiniciar,
  onIrAPagina,
}: {
  catalogo: Catalogo;
  editar: Editar;
  info: PaginaInfo;
  pestana: "contenido" | "diseno";
  onReiniciar: () => void;
  onIrAPagina: (id: string) => void;
}) {
  if (pestana === "diseno") {
    return (
      <Diseno catalogo={catalogo} editar={editar} onReiniciar={onReiniciar} />
    );
  }
  if (info.tipo === "portada") {
    return <Portada catalogo={catalogo} editar={editar} />;
  }
  if (info.tipo === "nosotros") {
    return <Nosotros catalogo={catalogo} editar={editar} />;
  }
  if (info.tipo === "indice") {
    return (
      <Indice catalogo={catalogo} editar={editar} onIrAPagina={onIrAPagina} />
    );
  }
  if (info.tipo === "arreglos") {
    return (
      <ArreglosEditor
        catalogo={catalogo}
        editar={editar}
        indice={info.col}
        desde={info.desde}
      />
    );
  }
  return (
    <ColeccionEditor
      catalogo={catalogo}
      editar={editar}
      indice={info.col}
      onIrAPagina={onIrAPagina}
    />
  );
}

/* ---------- selector de íconos ---------- */

function Selector<T extends string>({
  etiqueta,
  valor,
  opciones,
  onChange,
  dibujar,
}: {
  etiqueta: string;
  valor: T;
  opciones: { id: T; etiqueta: string }[];
  onChange: (id: T) => void;
  dibujar: (id: T, color: string) => React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-2 block text-xs text-stone-500 oscuro:text-stone-400">
        {etiqueta}
      </span>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const activo = valor === o.id;
          return (
            <button
              key={o.id}
              type="button"
              title={o.etiqueta}
              aria-label={o.etiqueta}
              aria-pressed={activo}
              onClick={() => onChange(o.id)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                activo
                  ? "border-stone-800 bg-stone-800 oscuro:border-stone-300 oscuro:bg-stone-600"
                  : "border-stone-200 bg-white oscuro:border-stone-700 oscuro:bg-stone-900"
              }`}
            >
              {dibujar(o.id, activo ? "#ffffff" : "#8a8078")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- página 1: portada ---------- */

function Portada({ catalogo, editar }: { catalogo: Catalogo; editar: Editar }) {
  const p = catalogo.portada;
  const m = catalogo.marca;
  return (
    <>
      <Seccion titulo="Marca">
        <Campo
          etiqueta="Nombre"
          valor={m.nombre}
          onChange={(v) => editar((c) => (c.marca.nombre = v))}
        />
        <Campo
          etiqueta="Segunda línea"
          valor={m.submarca}
          onChange={(v) => editar((c) => (c.marca.submarca = v))}
        />
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          La marca aparece en la portada y en el encabezado de cada colección.
        </p>
      </Seccion>

      <Seccion titulo="Textos">
        <Campo
          etiqueta="Lema"
          valor={p.lema}
          onChange={(v) => editar((c) => (c.portada.lema = v))}
        />
        <Campo
          etiqueta="Título grande"
          valor={p.titulo}
          onChange={(v) => editar((c) => (c.portada.titulo = v))}
        />
        <Campo
          etiqueta="Subtítulo"
          valor={p.subtitulo}
          onChange={(v) => editar((c) => (c.portada.subtitulo = v))}
        />
      </Seccion>

      <Seccion titulo="Foto principal">
        <CampoFoto
          etiqueta="Imagen de portada"
          foto={p.foto}
          onChange={(f) => editar((c) => (c.portada.foto = f))}
        />
      </Seccion>

      <Seccion titulo="Pie de la portada">
        <Campo
          etiqueta="Servicio"
          valor={p.servicio}
          onChange={(v) => editar((c) => (c.portada.servicio = v))}
        />
        <Campo
          etiqueta="Teléfono 1"
          valor={p.telefono1}
          onChange={(v) => editar((c) => (c.portada.telefono1 = v))}
        />
        <Campo
          etiqueta="Teléfono 2"
          valor={p.telefono2}
          placeholder="Dejalo vacío si es uno solo"
          onChange={(v) => editar((c) => (c.portada.telefono2 = v))}
        />
        <Campo
          etiqueta="Ciudad"
          valor={p.ciudad}
          onChange={(v) => editar((c) => (c.portada.ciudad = v))}
        />
      </Seccion>
    </>
  );
}

/* ---------- página 2: quiénes somos ---------- */

function Nosotros({
  catalogo,
  editar,
}: {
  catalogo: Catalogo;
  editar: Editar;
}) {
  const n = catalogo.nosotros;
  return (
    <>
      <Seccion titulo="Texto">
        <Campo
          etiqueta="Título"
          valor={n.titulo}
          onChange={(v) => editar((c) => (c.nosotros.titulo = v))}
        />
        <CampoArea
          etiqueta="Descripción"
          filas={8}
          valor={n.texto}
          onChange={(v) => editar((c) => (c.nosotros.texto = v))}
        />
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          Dejá una línea en blanco entre párrafos.
        </p>
        <Campo
          etiqueta="Cierre, primera línea"
          valor={n.cierre1}
          onChange={(v) => editar((c) => (c.nosotros.cierre1 = v))}
        />
        <Campo
          etiqueta="Cierre, línea manuscrita"
          valor={n.cierre2}
          onChange={(v) => editar((c) => (c.nosotros.cierre2 = v))}
        />
      </Seccion>

      <Seccion titulo="Foto">
        <CampoFoto
          etiqueta="Imagen de la página"
          foto={n.foto}
          onChange={(f) => editar((c) => (c.nosotros.foto = f))}
        />
      </Seccion>

      {n.datos.map((d, i) => (
        <Seccion key={d.id} titulo={`Dato ${i + 1}`}>
          <Selector<IconoDatoId>
            etiqueta="Ícono"
            valor={d.icono}
            opciones={ICONOS_DATO}
            onChange={(id) => editar((c) => (c.nosotros.datos[i].icono = id))}
            dibujar={(id, color) => (
              <IconoDato id={id} color={color} tam={20} />
            )}
          />
          <Campo
            etiqueta="Título"
            valor={d.titulo}
            onChange={(v) => editar((c) => (c.nosotros.datos[i].titulo = v))}
          />
          <CampoArea
            etiqueta="Texto"
            filas={3}
            valor={d.texto}
            onChange={(v) => editar((c) => (c.nosotros.datos[i].texto = v))}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                editar((c) => {
                  c.nosotros.datos.splice(i + 1, 0, {
                    id: `d${Date.now().toString(36)}`,
                    icono: "calendario",
                    titulo: "NUEVO DATO",
                    texto: "Escribí acá la información.",
                  });
                })
              }
              className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
            >
              Agregar dato debajo
            </button>
            {n.datos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  editar((c) => {
                    c.nosotros.datos.splice(i, 1);
                  })
                }
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-600 oscuro:border-red-900 oscuro:bg-stone-800 oscuro:text-red-400"
              >
                Quitar
              </button>
            )}
          </div>
        </Seccion>
      ))}
    </>
  );
}

/* ---------- página 3: índice ---------- */

function Indice({
  catalogo,
  editar,
  onIrAPagina,
}: {
  catalogo: Catalogo;
  editar: Editar;
  onIrAPagina: (id: string) => void;
}) {
  const cols = catalogo.colecciones;
  return (
    <>
      <Seccion titulo="Título">
        <Campo
          etiqueta="Encabezado"
          valor={catalogo.indice.encabezado}
          onChange={(v) => editar((c) => (c.indice.encabezado = v))}
        />
        <Campo
          etiqueta="Título grande"
          valor={catalogo.indice.titulo}
          onChange={(v) => editar((c) => (c.indice.titulo = v))}
        />
      </Seccion>

      <Seccion titulo="Colecciones">
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          El índice se arma solo con las colecciones. Cada una tiene su propia
          página; tocá una para editarla.
        </p>
        <ul className="space-y-2">
          {cols.map((col, i) => (
            <li key={col.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onIrAPagina(col.id)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left oscuro:border-stone-700 oscuro:bg-stone-900"
              >
                <span className="w-6 shrink-0 text-center font-mono text-xs text-stone-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icono id={col.icono} color="#8a8078" tam={20} />
                <span className="min-w-0 flex-1 truncate text-sm text-stone-700 oscuro:text-stone-200">
                  {col.nombre || `Colección ${i + 1}`}
                </span>
              </button>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  aria-label="Subir"
                  disabled={i === 0}
                  onClick={() =>
                    editar((c) => {
                      const [x] = c.colecciones.splice(i, 1);
                      c.colecciones.splice(i - 1, 0, x);
                    })
                  }
                  className="h-6 w-7 rounded border border-stone-200 text-[10px] text-stone-500 disabled:opacity-30 oscuro:border-stone-700 oscuro:text-stone-400"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label="Bajar"
                  disabled={i === cols.length - 1}
                  onClick={() =>
                    editar((c) => {
                      const [x] = c.colecciones.splice(i, 1);
                      c.colecciones.splice(i + 1, 0, x);
                    })
                  }
                  className="h-6 w-7 rounded border border-stone-200 text-[10px] text-stone-500 disabled:opacity-30 oscuro:border-stone-700 oscuro:text-stone-400"
                >
                  ▼
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() =>
            editar((c) => {
              c.colecciones.push(coleccionNueva(c.colecciones.length + 1));
            })
          }
          className="w-full rounded-md bg-stone-800 px-3 py-2 text-xs text-white active:bg-stone-700 oscuro:bg-stone-100 oscuro:text-stone-900"
        >
          Agregar colección
        </button>
      </Seccion>
    </>
  );
}

/* ---------- páginas 4+: una por colección ---------- */

function ColeccionEditor({
  catalogo,
  editar,
  indice,
  onIrAPagina,
}: {
  catalogo: Catalogo;
  editar: Editar;
  indice: number;
  onIrAPagina: (id: string) => void;
}) {
  const col = catalogo.colecciones[indice];
  if (!col) return null;

  return (
    <>
      <Seccion titulo={`Colección ${indice + 1}`}>
        <Selector<IconoId>
          etiqueta="Ícono"
          valor={col.icono}
          opciones={ICONOS}
          onChange={(id) => editar((c) => (c.colecciones[indice].icono = id))}
          dibujar={(id, color) => <Icono id={id} color={color} tam={22} />}
        />
        <Campo
          etiqueta="Nombre"
          valor={col.nombre}
          onChange={(v) => editar((c) => (c.colecciones[indice].nombre = v))}
        />
        <CampoArea
          etiqueta="Descripción"
          filas={3}
          valor={col.descripcion}
          onChange={(v) =>
            editar((c) => (c.colecciones[indice].descripcion = v))
          }
        />
        <Campo
          etiqueta="Precio (opcional)"
          valor={col.precio}
          placeholder="Dejalo vacío si no querés mostrarlo"
          onChange={(v) => editar((c) => (c.colecciones[indice].precio = v))}
        />
      </Seccion>

      <Seccion titulo="Foto del arreglo">
        <CampoFoto
          etiqueta="Imagen"
          foto={col.foto}
          onChange={(f) => editar((c) => (c.colecciones[indice].foto = f))}
        />
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          El recuadro siempre mide lo mismo, así que podés cambiar el arreglo
          cada mes sin que se mueva el diseño. «Entera» muestra la foto completa;
          «Recortada» la agranda hasta llenar el recuadro.
        </p>
      </Seccion>

      <Seccion titulo="Arreglos">
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          {col.arreglos.length === 0
            ? "Esta colección todavía no tiene arreglos."
            : `Esta colección tiene ${col.arreglos.length} ${col.arreglos.length === 1 ? "arreglo" : "arreglos"}, de a ${ARREGLOS_POR_PAGINA} por hoja.`}
        </p>
        <button
          type="button"
          onClick={() =>
            editar((c) => c.colecciones[indice].arreglos.push(arregloNuevo()))
          }
          className="w-full rounded-lg bg-stone-800 px-3 py-2.5 text-xs text-white oscuro:bg-stone-100 oscuro:text-stone-900"
        >
          + Agregar arreglo
        </button>
      </Seccion>

      <Seccion titulo="Esta página">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              editar((c) => {
                c.colecciones.splice(
                  indice + 1,
                  0,
                  coleccionNueva(c.colecciones.length + 1),
                );
              })
            }
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
          >
            Agregar colección debajo
          </button>
          {catalogo.colecciones.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (!confirm(`¿Quitar la colección «${col.nombre}»?`)) return;
                editar((c) => {
                  c.colecciones.splice(indice, 1);
                });
                onIrAPagina("indice");
              }}
              className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-600 oscuro:border-red-900 oscuro:bg-stone-800 oscuro:text-red-400"
            >
              Quitar esta colección
            </button>
          )}
        </div>
      </Seccion>
    </>
  );
}

/* ---------- página de arreglos ---------- */

function ArreglosEditor({
  catalogo,
  editar,
  indice,
  desde,
}: {
  catalogo: Catalogo;
  editar: Editar;
  indice: number;
  desde: number;
}) {
  const col = catalogo.colecciones[indice];
  if (!col) return null;
  const visibles = col.arreglos.slice(desde, desde + ARREGLOS_POR_PAGINA);

  function reordenar(pos: number, salto: number) {
    editar((c) => {
      const lista = c.colecciones[indice].arreglos;
      const [x] = lista.splice(pos, 1);
      lista.splice(pos + salto, 0, x);
    });
  }

  return (
    <>
      {visibles.map((arreglo, i) => {
        const pos = desde + i;
        return (
          <Seccion
            key={arreglo.id}
            titulo={`Arreglo ${String(pos + 1).padStart(2, "0")} · ${col.nombre}`}
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pos === 0}
                onClick={() => reordenar(pos, -1)}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 disabled:opacity-30 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
              >
                Subir
              </button>
              <button
                type="button"
                disabled={pos === col.arreglos.length - 1}
                onClick={() => reordenar(pos, 1)}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 disabled:opacity-30 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
              >
                Bajar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`¿Quitar «${arreglo.nombre}»?`)) return;
                  editar((c) => c.colecciones[indice].arreglos.splice(pos, 1));
                }}
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-600 oscuro:border-red-900 oscuro:bg-stone-800 oscuro:text-red-400"
              >
                Quitar
              </button>
            </div>
            <Campo
              etiqueta="Nombre"
              valor={arreglo.nombre}
              onChange={(v) =>
                editar((c) => (c.colecciones[indice].arreglos[pos].nombre = v))
              }
            />
            <CampoArea
              etiqueta="Descripción"
              valor={arreglo.descripcion}
              filas={4}
              onChange={(v) =>
                editar(
                  (c) => (c.colecciones[indice].arreglos[pos].descripcion = v),
                )
              }
            />
            <Campo
              etiqueta="Precio (sin el signo $)"
              valor={arreglo.precio}
              placeholder="18"
              onChange={(v) =>
                editar((c) => (c.colecciones[indice].arreglos[pos].precio = v))
              }
            />
            <CampoFoto
              etiqueta="Foto del arreglo"
              foto={arreglo.foto}
              onChange={(f) =>
                editar((c) => (c.colecciones[indice].arreglos[pos].foto = f))
              }
            />
          </Seccion>
        );
      })}

      <Seccion titulo="Agregar">
        <button
          type="button"
          onClick={() =>
            editar((c) => c.colecciones[indice].arreglos.push(arregloNuevo()))
          }
          className="w-full rounded-lg bg-stone-800 px-3 py-2.5 text-xs text-white oscuro:bg-stone-100 oscuro:text-stone-900"
        >
          + Agregar arreglo a {col.nombre}
        </button>
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          Van de a {ARREGLOS_POR_PAGINA} por hoja. Si no entra en esta página se
          crea una hoja más dentro de la misma colección.
        </p>
      </Seccion>
    </>
  );
}

/* ---------- pestaña diseño ---------- */

function Diseno({
  catalogo,
  editar,
  onReiniciar,
}: {
  catalogo: Catalogo;
  editar: Editar;
  onReiniciar: () => void;
}) {
  const t = catalogo.tema;
  const entradaCopia = useRef<HTMLInputElement>(null);

  function guardarCopia() {
    const blob = new Blob([JSON.stringify(catalogo)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalogo-copia.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function cargarCopia(archivo: File | undefined) {
    if (!archivo) return;
    const datos = JSON.parse(await archivo.text()) as Catalogo;
    editar((c) => Object.assign(c, datos));
    if (entradaCopia.current) entradaCopia.current.value = "";
  }

  return (
    <>
      <Seccion titulo="Paletas listas">
        <div className="grid grid-cols-2 gap-2">
          {PALETAS.map((p) => (
            <button
              key={p.nombre}
              type="button"
              onClick={() => editar((c) => Object.assign(c.tema, p.tema))}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-xs text-stone-600 active:bg-stone-50 oscuro:border-stone-700 oscuro:bg-stone-900 oscuro:text-stone-300"
            >
              <span className="flex shrink-0">
                {[p.tema.acento, p.tema.barra, p.tema.titulo].map((c, i) => (
                  <span
                    key={i}
                    className="-ml-1 h-5 w-5 rounded-full border border-white first:ml-0 oscuro:border-stone-900"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {p.nombre}
            </button>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Colores a medida">
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          Tocá el cuadrito para elegir un color, o escribí el código hex si ya
          lo tenés (por ejemplo el de tu logo).
        </p>
        <CampoColor
          etiqueta="Fondo"
          valor={t.fondo}
          onChange={(v) => editar((c) => (c.tema.fondo = v))}
        />
        <CampoColor
          etiqueta="Acento"
          valor={t.acento}
          onChange={(v) => editar((c) => (c.tema.acento = v))}
        />
        <CampoColor
          etiqueta="Barras y círculos"
          valor={t.barra}
          onChange={(v) => editar((c) => (c.tema.barra = v))}
        />
        <CampoColor
          etiqueta="Títulos"
          valor={t.titulo}
          onChange={(v) => editar((c) => (c.tema.titulo = v))}
        />
        <CampoColor
          etiqueta="Texto"
          valor={t.texto}
          onChange={(v) => editar((c) => (c.tema.texto = v))}
        />
        <CampoColor
          etiqueta="Precios"
          valor={t.precio}
          onChange={(v) => editar((c) => (c.tema.precio = v))}
        />
        <CampoColor
          etiqueta="Bordes"
          valor={t.borde}
          onChange={(v) => editar((c) => (c.tema.borde = v))}
        />
      </Seccion>

      <Seccion titulo="Moneda">
        <Campo
          etiqueta="Se muestra al lado del precio (vacío para no mostrar nada)"
          valor={catalogo.moneda}
          placeholder="USD"
          onChange={(v) => editar((c) => (c.moneda = v))}
        />
      </Seccion>

      <Seccion titulo="Tipografía">
        <CampoSelector
          etiqueta="Letra principal"
          valor={t.fuenteTitulo}
          opciones={FUENTES_TITULO}
          onChange={(v) => editar((c) => (c.tema.fuenteTitulo = v))}
        />
        <CampoSelector
          etiqueta="Letra manuscrita"
          valor={t.fuenteScript}
          opciones={FUENTES_SCRIPT}
          onChange={(v) => editar((c) => (c.tema.fuenteScript = v))}
        />
      </Seccion>

      <Seccion titulo="Copia de seguridad">
        <p className="text-xs leading-relaxed text-stone-500 oscuro:text-stone-400">
          El catálogo se guarda solo en este navegador. Descargá una copia para
          poder recuperarlo o pasarlo a otro dispositivo.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={guardarCopia}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
          >
            Descargar copia
          </button>
          <button
            type="button"
            onClick={() => entradaCopia.current?.click()}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 oscuro:border-stone-700 oscuro:bg-stone-800 oscuro:text-stone-200"
          >
            Cargar copia
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Volver al catálogo original? Se pierden los cambios."))
                onReiniciar();
            }}
            className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-600 oscuro:border-red-900 oscuro:bg-stone-800 oscuro:text-red-400"
          >
            Restablecer todo
          </button>
        </div>
        <input
          ref={entradaCopia}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => cargarCopia(e.target.files?.[0])}
        />
      </Seccion>
    </>
  );
}
