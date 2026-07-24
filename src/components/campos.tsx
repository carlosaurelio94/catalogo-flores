"use client";

/* eslint-disable @next/next/no-img-element */
import { useId, useRef, useState } from "react";
import { aDataUrl } from "@/lib/imagen";
import type { Foto } from "@/lib/tipos";

export function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-stone-200 px-4 py-5 last:border-b-0">
      <h3 className="mb-3 text-[11px] font-medium tracking-[0.18em] text-stone-400 uppercase">
        {titulo}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

const claseInput =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-800 outline-none transition focus:border-stone-400";

export function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-stone-500">
        {etiqueta}
      </label>
      <input
        id={id}
        className={claseInput}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CampoArea({
  etiqueta,
  valor,
  onChange,
  filas = 3,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  filas?: number;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-stone-500">
        {etiqueta}
      </label>
      <textarea
        id={id}
        rows={filas}
        className={`${claseInput} resize-none leading-relaxed`}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function CampoSelector({
  etiqueta,
  valor,
  opciones,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  opciones: { id: string; nombre: string }[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-stone-500">
        {etiqueta}
      </label>
      <select
        id={id}
        className={claseInput}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      >
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CampoColor({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2">
      <span className="text-sm text-stone-600">{etiqueta}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs text-stone-400 uppercase">
          {valor}
        </span>
        <input
          type="color"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-stone-200 bg-white p-0.5"
        />
      </span>
    </label>
  );
}

export function CampoFoto({
  etiqueta,
  foto,
  onChange,
}: {
  etiqueta: string;
  foto: Foto;
  onChange: (f: Foto) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [cargando, setCargando] = useState(false);

  async function elegir(archivo: File | undefined) {
    if (!archivo) return;
    setCargando(true);
    try {
      const src = await aDataUrl(archivo);
      onChange({ ...foto, src });
    } finally {
      setCargando(false);
      if (entrada.current) entrada.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <div className="mb-2 text-xs text-stone-500">{etiqueta}</div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-dashed border-stone-300 bg-stone-50 text-[11px] text-stone-400"
        >
          {foto.src ? (
            <img
              src={foto.src}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: `50% ${foto.pos}%` }}
            />
          ) : (
            "Sin foto"
          )}
        </button>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => entrada.current?.click()}
              className="rounded-md bg-stone-800 px-3 py-1.5 text-xs text-white active:bg-stone-700"
            >
              {cargando ? "Cargando…" : foto.src ? "Cambiar" : "Subir foto"}
            </button>
            {foto.src && (
              <button
                type="button"
                onClick={() => onChange({ ...foto, src: null })}
                className="rounded-md border border-stone-200 px-3 py-1.5 text-xs text-stone-500"
              >
                Quitar
              </button>
            )}
          </div>
          {foto.src && (
            <label className="block">
              <span className="text-[11px] text-stone-400">Encuadre</span>
              <input
                type="range"
                min={0}
                max={100}
                value={foto.pos}
                onChange={(e) =>
                  onChange({ ...foto, pos: Number(e.target.value) })
                }
                className="w-full accent-stone-700"
              />
            </label>
          )}
        </div>
      </div>
      <input
        ref={entrada}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => elegir(e.target.files?.[0])}
      />
    </div>
  );
}
