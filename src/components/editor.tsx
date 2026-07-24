"use client";

import { useRef } from "react";
import {
  FUENTES_SCRIPT,
  FUENTES_TITULO,
  PALETAS,
  type Catalogo,
  type IconoId,
  type Producto,
} from "@/lib/tipos";
import { ICONOS, Icono } from "./adornos";
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
  pagina,
  pestana,
  onReiniciar,
}: {
  catalogo: Catalogo;
  editar: Editar;
  pagina: number;
  pestana: "contenido" | "diseno";
  onReiniciar: () => void;
}) {
  if (pestana === "diseno") {
    return (
      <Diseno catalogo={catalogo} editar={editar} onReiniciar={onReiniciar} />
    );
  }
  if (pagina === 0) return <Portada catalogo={catalogo} editar={editar} />;
  if (pagina === 1) return <Signature catalogo={catalogo} editar={editar} />;
  if (pagina === 2) return <Colecciones catalogo={catalogo} editar={editar} />;
  return <MasDisenos catalogo={catalogo} editar={editar} />;
}

function CamposProducto({
  titulo,
  producto,
  aplicar,
}: {
  titulo: string;
  producto: Producto;
  aplicar: (cambio: (p: Producto) => void) => void;
}) {
  return (
    <Seccion titulo={titulo}>
      <Campo
        etiqueta="Nombre"
        valor={producto.nombre}
        onChange={(v) => aplicar((p) => (p.nombre = v))}
      />
      <Campo
        etiqueta="Precio"
        valor={producto.precio}
        onChange={(v) => aplicar((p) => (p.precio = v))}
      />
      <CampoFoto
        etiqueta="Foto"
        foto={producto.foto}
        onChange={(f) => aplicar((p) => (p.foto = f))}
      />
    </Seccion>
  );
}

function Portada({ catalogo, editar }: { catalogo: Catalogo; editar: Editar }) {
  const p = catalogo.portada;
  return (
    <>
      <Seccion titulo="Encabezado">
        <Campo
          etiqueta="Nombre de la marca"
          valor={p.marca}
          onChange={(v) => editar((c) => (c.portada.marca = v))}
        />
        <Campo
          etiqueta="Segunda línea"
          valor={p.submarca}
          onChange={(v) => editar((c) => (c.portada.submarca = v))}
        />
        <Campo
          etiqueta="Lema"
          valor={p.lema}
          onChange={(v) => editar((c) => (c.portada.lema = v))}
        />
      </Seccion>
      <Seccion titulo="Foto principal">
        <CampoFoto
          etiqueta="Imagen de portada"
          foto={p.foto}
          onChange={(f) => editar((c) => (c.portada.foto = f))}
        />
      </Seccion>
      <Seccion titulo="Título">
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
      <Seccion titulo="Datos de contacto">
        <Campo
          etiqueta="Servicio"
          valor={p.servicio}
          onChange={(v) => editar((c) => (c.portada.servicio = v))}
        />
        <Campo
          etiqueta="Teléfono"
          valor={p.telefono}
          onChange={(v) => editar((c) => (c.portada.telefono = v))}
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

function Signature({
  catalogo,
  editar,
}: {
  catalogo: Catalogo;
  editar: Editar;
}) {
  const s = catalogo.signature;
  return (
    <>
      <Seccion titulo="Encabezado">
        <Campo
          etiqueta="Etiqueta superior"
          valor={s.etiqueta}
          onChange={(v) => editar((c) => (c.signature.etiqueta = v))}
        />
        <Campo
          etiqueta="Título"
          valor={s.titulo}
          onChange={(v) => editar((c) => (c.signature.titulo = v))}
        />
        <Campo
          etiqueta="Texto manuscrito"
          valor={s.script}
          onChange={(v) => editar((c) => (c.signature.script = v))}
        />
        <CampoArea
          etiqueta="Descripción"
          valor={s.descripcion}
          onChange={(v) => editar((c) => (c.signature.descripcion = v))}
        />
      </Seccion>
      <CamposProducto
        titulo="Producto destacado"
        producto={s.destacado}
        aplicar={(cambio) => editar((c) => cambio(c.signature.destacado))}
      />
      {s.productos.map((prod, i) => (
        <CamposProducto
          key={prod.id}
          titulo={`Producto ${i + 1}`}
          producto={prod}
          aplicar={(cambio) => editar((c) => cambio(c.signature.productos[i]))}
        />
      ))}
      <Seccion titulo="Pie">
        <Campo
          etiqueta="Número de página"
          valor={s.numero}
          onChange={(v) => editar((c) => (c.signature.numero = v))}
        />
      </Seccion>
    </>
  );
}

function Colecciones({
  catalogo,
  editar,
}: {
  catalogo: Catalogo;
  editar: Editar;
}) {
  const col = catalogo.colecciones;
  return (
    <>
      <Seccion titulo="Título">
        <Campo
          etiqueta="Título de la página"
          valor={col.titulo}
          onChange={(v) => editar((c) => (c.colecciones.titulo = v))}
        />
      </Seccion>
      {col.items.map((item, i) => (
        <Seccion key={item.id} titulo={`Colección ${i + 1}`}>
          <div>
            <span className="mb-2 block text-xs text-stone-500">Ícono</span>
            <div className="flex flex-wrap gap-2">
              {ICONOS.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  title={ic.etiqueta}
                  onClick={() =>
                    editar((c) => (c.colecciones.items[i].icono = ic.id))
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                    item.icono === ic.id
                      ? "border-stone-800 bg-stone-800"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <Icono
                    id={ic.id as IconoId}
                    color={item.icono === ic.id ? "#ffffff" : "#8a8078"}
                    tam={22}
                  />
                </button>
              ))}
            </div>
          </div>
          <Campo
            etiqueta="Nombre"
            valor={item.nombre}
            onChange={(v) => editar((c) => (c.colecciones.items[i].nombre = v))}
          />
          <CampoArea
            etiqueta="Descripción"
            filas={2}
            valor={item.descripcion}
            onChange={(v) =>
              editar((c) => (c.colecciones.items[i].descripcion = v))
            }
          />
        </Seccion>
      ))}
      <Seccion titulo="Pie de página">
        <Campo
          etiqueta="Marca"
          valor={col.marcaPie}
          onChange={(v) => editar((c) => (c.colecciones.marcaPie = v))}
        />
        <Campo
          etiqueta="Lema"
          valor={col.lemaPie}
          onChange={(v) => editar((c) => (c.colecciones.lemaPie = v))}
        />
        <Campo
          etiqueta="Número de página"
          valor={col.numero}
          onChange={(v) => editar((c) => (c.colecciones.numero = v))}
        />
      </Seccion>
    </>
  );
}

function MasDisenos({
  catalogo,
  editar,
}: {
  catalogo: Catalogo;
  editar: Editar;
}) {
  const m = catalogo.masDisenos;
  return (
    <>
      <Seccion titulo="Título">
        <Campo
          etiqueta="Título de la página"
          valor={m.titulo}
          onChange={(v) => editar((c) => (c.masDisenos.titulo = v))}
        />
      </Seccion>
      {m.productos.map((prod, i) => (
        <CamposProducto
          key={prod.id}
          titulo={`Producto ${i + 1}`}
          producto={prod}
          aplicar={(cambio) => editar((c) => cambio(c.masDisenos.productos[i]))}
        />
      ))}
      <Seccion titulo="Cierre">
        <Campo
          etiqueta="Primera línea"
          valor={m.cierre1}
          onChange={(v) => editar((c) => (c.masDisenos.cierre1 = v))}
        />
        <Campo
          etiqueta="Segunda línea"
          valor={m.cierre2}
          onChange={(v) => editar((c) => (c.masDisenos.cierre2 = v))}
        />
        <Campo
          etiqueta="Número de página"
          valor={m.numero}
          onChange={(v) => editar((c) => (c.masDisenos.numero = v))}
        />
      </Seccion>
    </>
  );
}

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
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-xs text-stone-600 active:bg-stone-50"
            >
              <span className="flex shrink-0">
                {[p.tema.acento, p.tema.barra, p.tema.titulo].map((c, i) => (
                  <span
                    key={i}
                    className="-ml-1 h-5 w-5 rounded-full border border-white first:ml-0"
                    style={{ background: c }}
                  />
                ))}
              </span>
              {p.nombre}
            </button>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Colores">
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
          etiqueta="Bordes"
          valor={t.borde}
          onChange={(v) => editar((c) => (c.tema.borde = v))}
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
        <p className="text-xs leading-relaxed text-stone-500">
          El catálogo se guarda solo en este navegador. Descargá una copia para
          poder recuperarlo o pasarlo a otro dispositivo.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={guardarCopia}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600"
          >
            Descargar copia
          </button>
          <button
            type="button"
            onClick={() => entradaCopia.current?.click()}
            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600"
          >
            Cargar copia
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Volver al catálogo original? Se pierden los cambios."))
                onReiniciar();
            }}
            className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs text-red-600"
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
