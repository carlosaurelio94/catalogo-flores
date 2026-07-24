/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import {
  FUENTES_SCRIPT,
  FUENTES_TITULO,
  fuenteCss,
  type Catalogo,
  type Foto as TFoto,
  type Producto,
  type Tema,
} from "@/lib/tipos";
import { Divisor, Icono, NumeroPagina, Ornamento, RamaBotanica } from "./adornos";

export const PAGINAS = [
  { id: "portada", titulo: "Portada", archivo: "1-portada" },
  { id: "signature", titulo: "Signature", archivo: "2-signature" },
  { id: "colecciones", titulo: "Colecciones", archivo: "3-colecciones" },
  { id: "masDisenos", titulo: "Más diseños", archivo: "4-mas-disenos" },
] as const;

function base(tema: Tema): CSSProperties {
  return {
    background: tema.fondo,
    color: tema.texto,
    fontFamily: "var(--f-titulo)",
    ["--f-titulo" as string]: fuenteCss(FUENTES_TITULO, tema.fuenteTitulo),
    ["--f-script" as string]: fuenteCss(FUENTES_SCRIPT, tema.fuenteScript),
  };
}

// El letter-spacing agrega espacio después del último caracter y descentra el
// texto: compensamos con un padding izquierdo del mismo tamaño.
function espaciado(em: number): CSSProperties {
  return { letterSpacing: `${em}em`, paddingLeft: `${em}em` };
}

function Foto({ foto, tema }: { foto: TFoto; tema: Tema }) {
  if (!foto.src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: tema.barra,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Ornamento color={tema.acento} tam={34} />
        <span
          style={{
            fontSize: 13,
            color: tema.acento,
            ...espaciado(0.2),
          }}
        >
          SIN FOTO
        </span>
      </div>
    );
  }
  return (
    <img
      src={foto.src}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `50% ${foto.pos}%`,
        display: "block",
      }}
    />
  );
}

function Tarjeta({
  producto,
  tema,
  tamNombre = 23,
}: {
  producto: Producto;
  tema: Tema;
  tamNombre?: number;
}) {
  return (
    <div
      style={{
        height: "100%",
        background: "#ffffff",
        border: `1px solid ${tema.borde}`,
        borderRadius: 8,
        padding: 9,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, borderRadius: 4, overflow: "hidden", minHeight: 0 }}>
        <Foto foto={producto.foto} tema={tema} />
      </div>
      <div style={{ textAlign: "center", padding: "13px 6px 7px" }}>
        <div
          style={{
            fontSize: tamNombre,
            color: tema.titulo,
            lineHeight: 1.2,
            letterSpacing: "0.02em",
          }}
        >
          {producto.nombre}
        </div>
        <div
          style={{
            fontSize: tamNombre - 2,
            color: tema.acento,
            marginTop: 5,
            letterSpacing: "0.04em",
          }}
        >
          {producto.precio}
        </div>
      </div>
    </div>
  );
}

function Marco({
  tema,
  conBarra,
  children,
}: {
  tema: Tema;
  conBarra?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        margin: 26,
        marginBottom: conBarra ? 22 : 26,
        border: `1px solid ${tema.borde}`,
        borderRadius: 10,
        padding: "40px 40px 26px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {children}
    </div>
  );
}

function Barra({
  tema,
  lineas,
}: {
  tema: Tema;
  lineas: { texto: string; tam: number; em: number; color: string }[];
}) {
  return (
    <div
      style={{
        background: tema.barra,
        height: 96,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {lineas.map((l, i) => (
        <div
          key={i}
          style={{ fontSize: l.tam, color: l.color, ...espaciado(l.em) }}
        >
          {l.texto}
        </div>
      ))}
    </div>
  );
}

function IconoEnvio({ color }: { color: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 6.5h11v9h-11z" />
      <path d="M12.5 9.5h4l3 3v3h-7z" />
      <circle cx="5.5" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </svg>
  );
}

function IconoWhatsapp({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.2 22l5.3-1.4A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.9.7 1.9.5 2.3.5a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2l-.4-.2Z" />
    </svg>
  );
}

export function PaginaPortada({ catalogo }: { catalogo: Catalogo }) {
  const { tema, portada } = catalogo;
  return (
    <div className="pagina" style={base(tema)}>
      <div
        style={{
          padding: "50px 40px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Ornamento color={tema.acento} tam={30} />
        <div
          style={{
            marginTop: 14,
            fontSize: 74,
            lineHeight: 1,
            color: tema.acento,
            ...espaciado(0.2),
          }}
        >
          {portada.marca}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            color: tema.acento,
            ...espaciado(0.62),
          }}
        >
          {portada.submarca}
        </div>
        <div style={{ marginTop: 20 }}>
          <Divisor color={tema.acento} ancho={62} />
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 14,
            color: tema.texto,
            ...espaciado(0.28),
          }}
        >
          {portada.lema}
        </div>
      </div>

      <div style={{ flex: 1, marginTop: 30, minHeight: 0 }}>
        <Foto foto={portada.foto} tema={tema} />
      </div>

      <div style={{ textAlign: "center", padding: "36px 40px 0" }}>
        <div
          style={{
            fontSize: 60,
            lineHeight: 1,
            color: tema.titulo,
            ...espaciado(0.14),
          }}
        >
          {portada.titulo}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            color: tema.acento,
            ...espaciado(0.34),
          }}
        >
          {portada.subtitulo}
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          background: tema.barra,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconoEnvio color={tema.acento} />
          <span
            style={{
              fontSize: 12.5,
              color: tema.titulo,
              maxWidth: 130,
              lineHeight: 1.5,
              ...espaciado(0.16),
            }}
          >
            {portada.servicio}
          </span>
        </div>
        <span
          style={{ width: 1, height: 44, background: tema.acento, opacity: 0.4 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconoWhatsapp color={tema.acento} />
          <span style={{ lineHeight: 1.6 }}>
            <span
              style={{
                display: "block",
                fontSize: 17,
                color: tema.titulo,
                ...espaciado(0.1),
              }}
            >
              {portada.telefono}
            </span>
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: tema.texto,
                ...espaciado(0.16),
              }}
            >
              {portada.ciudad}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function PaginaSignature({ catalogo }: { catalogo: Catalogo }) {
  const { tema, signature } = catalogo;
  return (
    <div className="pagina" style={base(tema)}>
      <Marco tema={tema}>
        <div style={{ display: "flex", gap: 28, height: 470 }}>
          <div
            style={{ width: 300, display: "flex", flexDirection: "column" }}
          >
            <div
              style={{ fontSize: 13, color: tema.texto, ...espaciado(0.34) }}
            >
              {signature.etiqueta}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 46,
                lineHeight: 1,
                color: tema.titulo,
                ...espaciado(0.1),
              }}
            >
              {signature.titulo}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: "var(--f-script)",
                fontSize: 34,
                color: tema.acento,
                lineHeight: 1.3,
              }}
            >
              {signature.script}
            </div>
            <div style={{ marginTop: 18 }}>
              <Divisor color={tema.acento} ancho={48} tam={10} />
            </div>
            <p
              style={{
                marginTop: 26,
                fontSize: 17,
                lineHeight: 1.65,
                color: tema.texto,
              }}
            >
              {signature.descripcion}
            </p>
            <div style={{ flex: 1 }} />
            <div style={{ opacity: 0.75, alignSelf: "center" }}>
              <Ornamento color={tema.acento} tam={40} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Tarjeta
              producto={signature.destacado}
              tema={tema}
              tamNombre={25}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 22,
            flex: 1,
            marginTop: 26,
            minHeight: 0,
          }}
        >
          {signature.productos.map((p) => (
            <div key={p.id} style={{ flex: 1, minWidth: 0 }}>
              <Tarjeta producto={p} tema={tema} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <NumeroPagina numero={signature.numero} color={tema.acento} />
        </div>
      </Marco>
    </div>
  );
}

export function PaginaColecciones({ catalogo }: { catalogo: Catalogo }) {
  const { tema, colecciones } = catalogo;
  return (
    <div className="pagina" style={base(tema)}>
      <Marco tema={tema} conBarra>
        <div
          style={{
            textAlign: "center",
            fontSize: 38,
            color: tema.acento,
            ...espaciado(0.18),
          }}
        >
          {colecciones.titulo}
        </div>
        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "center" }}
        >
          <Divisor color={tema.acento} ancho={54} tam={10} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            flex: 1,
            marginTop: 34,
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 36,
            }}
          >
            {colecciones.items.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", gap: 20, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: tema.barra,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <Icono id={item.icono} color={tema.acento} tam={30} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      color: tema.acento,
                      ...espaciado(0.16),
                    }}
                  >
                    {item.nombre}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 15.5,
                      lineHeight: 1.55,
                      color: tema.texto,
                      maxWidth: 270,
                    }}
                  >
                    {item.descripcion}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ width: 230, display: "flex", alignItems: "center" }}>
            <RamaBotanica color={tema.acento} />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <NumeroPagina numero={colecciones.numero} color={tema.acento} />
        </div>
      </Marco>
      <Barra
        tema={tema}
        lineas={[
          {
            texto: colecciones.marcaPie,
            tam: 26,
            em: 0.24,
            color: tema.titulo,
          },
          { texto: colecciones.lemaPie, tam: 12, em: 0.24, color: tema.texto },
        ]}
      />
    </div>
  );
}

export function PaginaMasDisenos({ catalogo }: { catalogo: Catalogo }) {
  const { tema, masDisenos } = catalogo;
  return (
    <div className="pagina" style={base(tema)}>
      <Marco tema={tema} conBarra>
        <div
          style={{
            textAlign: "center",
            fontSize: 34,
            color: tema.acento,
            ...espaciado(0.18),
          }}
        >
          {masDisenos.titulo}
        </div>
        <div
          style={{ marginTop: 14, display: "flex", justifyContent: "center" }}
        >
          <Divisor color={tema.acento} ancho={48} tam={10} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 22,
            flex: 1,
            marginTop: 28,
            minHeight: 0,
          }}
        >
          {masDisenos.productos.map((p) => (
            <Tarjeta key={p.id} producto={p} tema={tema} tamNombre={21} />
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <NumeroPagina numero={masDisenos.numero} color={tema.acento} />
        </div>
      </Marco>
      <Barra
        tema={tema}
        lineas={[
          { texto: masDisenos.cierre1, tam: 15, em: 0.2, color: tema.titulo },
          { texto: masDisenos.cierre2, tam: 15, em: 0.2, color: tema.titulo },
        ]}
      />
    </div>
  );
}

export function Pagina({
  indice,
  catalogo,
}: {
  indice: number;
  catalogo: Catalogo;
}) {
  if (indice === 0) return <PaginaPortada catalogo={catalogo} />;
  if (indice === 1) return <PaginaSignature catalogo={catalogo} />;
  if (indice === 2) return <PaginaColecciones catalogo={catalogo} />;
  return <PaginaMasDisenos catalogo={catalogo} />;
}
