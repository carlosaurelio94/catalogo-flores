/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import {
  ARREGLOS_POR_PAGINA,
  FUENTES_SCRIPT,
  FUENTES_TITULO,
  fuenteCss,
  type Arreglo,
  type Catalogo,
  type Foto as TFoto,
  type Tema,
} from "@/lib/tipos";
import {
  BarraNumero,
  Corazon,
  Divisor,
  DivisorFlor,
  Icono,
  IconoDato,
  IconoUbicacion,
  IconoWhatsapp,
  Ornamento,
  RamaEsquina,
} from "./adornos";

export type PaginaInfo = {
  id: string;
  titulo: string;
  archivo: string;
  // "col" es el índice de la colección; "desde" el primer arreglo de la hoja.
  tipo: "portada" | "nosotros" | "indice" | "coleccion" | "arreglos";
  col: number;
  desde: number;
};

// Para el nombre del archivo: "Colección Ñandú" -> "coleccion-nandu".
// \p{M} borra las tildes que NFD dejó sueltas como caracteres aparte.
function sinAcentos(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function paginasDe(catalogo: Catalogo): PaginaInfo[] {
  const paginas: PaginaInfo[] = [
    { id: "portada", titulo: "Portada", archivo: "portada", tipo: "portada", col: -1, desde: 0 },
    { id: "nosotros", titulo: "Quiénes somos", archivo: "quienes-somos", tipo: "nosotros", col: -1, desde: 0 },
    { id: "indice", titulo: "Índice", archivo: "indice", tipo: "indice", col: -1, desde: 0 },
  ];

  catalogo.colecciones.forEach((col, i) => {
    const nombre = sinAcentos(col.nombre) || `coleccion-${i + 1}`;
    paginas.push({
      id: col.id,
      titulo: col.nombre || `Colección ${i + 1}`,
      archivo: nombre,
      tipo: "coleccion",
      col: i,
      desde: 0,
    });

    for (let desde = 0; desde < col.arreglos.length; desde += ARREGLOS_POR_PAGINA) {
      const hoja = desde / ARREGLOS_POR_PAGINA + 1;
      paginas.push({
        id: `${col.id}-${desde}`,
        titulo: `${col.nombre || `Colección ${i + 1}`} ${hoja}`,
        archivo: `${nombre}-${hoja}`,
        tipo: "arreglos",
        col: i,
        desde,
      });
    }
  });

  // La numeración del archivo se arma al final: depende de cuántas hojas
  // terminó teniendo cada colección.
  return paginas.map((pagina, i) => ({
    ...pagina,
    archivo: `${String(i + 1).padStart(2, "0")}-${pagina.archivo}`,
  }));
}

function base(tema: Tema, fondo?: string): CSSProperties {
  return {
    background: fondo ?? tema.fondo,
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

function Marco({ tema }: { tema: Tema }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 22,
        border: `1px solid ${tema.borde}`,
        pointerEvents: "none",
      }}
    />
  );
}

function Foto({
  foto,
  tema,
  fondoVacio,
}: {
  foto: TFoto;
  tema: Tema;
  fondoVacio?: string;
}) {
  if (!foto.src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: fondoVacio ?? tema.barra,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Ornamento color={tema.acento} tam={34} />
        <span style={{ fontSize: 13, color: tema.acento, ...espaciado(0.2) }}>
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
        objectFit: foto.encaje === "entero" ? "contain" : "cover",
        objectPosition: `50% ${foto.pos}%`,
        display: "block",
      }}
    />
  );
}

function Parrafos({
  texto,
  estilo,
  separacion,
}: {
  texto: string;
  estilo: CSSProperties;
  separacion: number;
}) {
  const partes = texto.split(/\n\s*\n/).filter((p) => p.trim() !== "");
  return (
    <>
      {partes.map((parte, i) => (
        <p key={i} style={{ ...estilo, marginTop: i === 0 ? 0 : separacion }}>
          {parte.split("\n").map((linea, j) => (
            <span key={j} style={{ display: "block" }}>
              {linea}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}


// El logo real de la floristería. Es un PNG con transparencia, así que no
// sigue los colores del tema: un logo no se retiñe.
function Sello({ tam = 96 }: { tam?: number }) {
  return (
    <img
      src="/logo-sello.png"
      alt=""
      style={{ width: tam, height: "auto", display: "block", margin: "0 auto" }}
    />
  );
}

function Flor({ tam = 44 }: { tam?: number }) {
  return (
    <img
      src="/logo-flor.png"
      alt=""
      style={{ width: tam, height: "auto", display: "block", margin: "0 auto" }}
    />
  );
}

function Logo({ tema, marca }: { tema: Tema; marca: Catalogo["marca"] }) {
  return (
    <div style={{ textAlign: "center" }}>
      <Flor tam={40} />
      <div style={{ marginTop: 6, fontSize: 34, lineHeight: 1.1, color: tema.titulo }}>
        {marca.nombre}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 11,
          color: tema.texto,
          ...espaciado(0.42),
        }}
      >
        {marca.submarca}
      </div>
    </div>
  );
}

export function PaginaPortada({ catalogo }: { catalogo: Catalogo }) {
  const { tema, marca, portada } = catalogo;
  return (
    <div className="pagina" style={base(tema)}>
      <div
        style={{
          padding: "44px 40px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          flex: "none",
        }}
      >
        <Sello tam={112} />
        <div
          style={{
            marginTop: 10,
            fontSize: 78,
            lineHeight: 1,
            color: tema.acento,
            ...espaciado(0.2),
          }}
        >
          {marca.nombre.toUpperCase()}
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 21,
            color: tema.acento,
            ...espaciado(0.62),
          }}
        >
          {marca.submarca}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 13.5,
            color: tema.titulo,
            ...espaciado(0.26),
          }}
        >
          {portada.lema}
        </div>
        <div style={{ marginTop: 10 }}>
          <Corazon color={tema.acento} tam={13} />
        </div>
      </div>

      <div style={{ flex: 1, marginTop: 18, minHeight: 0 }}>
        <Foto foto={portada.foto} tema={tema} fondoVacio={tema.fondo} />
      </div>

      <div style={{ textAlign: "center", padding: "26px 40px 0", flex: "none" }}>
        <div
          style={{
            fontSize: 62,
            lineHeight: 1,
            color: tema.titulo,
            ...espaciado(0.14),
          }}
        >
          {portada.titulo}
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 15,
            color: tema.acento,
            ...espaciado(0.3),
          }}
        >
          {portada.subtitulo}
        </div>
      </div>

      <div
        style={{
          marginTop: 26,
          background: tema.barra,
          height: 122,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          flex: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Flor tam={34} />
          <span
            style={{
              fontSize: 13,
              color: tema.titulo,
              maxWidth: 118,
              lineHeight: 1.6,
              ...espaciado(0.16),
            }}
          >
            {portada.servicio}
          </span>
        </div>
        <span
          style={{ width: 1, height: 74, background: tema.acento, opacity: 0.45 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[portada.telefono1, portada.telefono2]
            .filter((t) => t.trim() !== "")
            .map((tel, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 11 }}
              >
                <IconoWhatsapp color={tema.acento} tam={21} />
                <span
                  style={{
                    fontSize: 20,
                    color: tema.titulo,
                    ...espaciado(0.04),
                  }}
                >
                  {tel}
                </span>
              </div>
            ))}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <IconoUbicacion color={tema.acento} tam={21} />
            <span
              style={{ fontSize: 12.5, color: tema.titulo, ...espaciado(0.14) }}
            >
              {portada.ciudad}
            </span>
          </div>
        </div>
      </div>

      <Marco tema={tema} />
    </div>
  );
}

export function PaginaNosotros({ catalogo }: { catalogo: Catalogo }) {
  const { tema, nosotros } = catalogo;
  const fondo = `linear-gradient(160deg, ${tema.barra} 0%, ${tema.fondo} 42%, ${tema.fondo} 58%, ${tema.barra} 100%)`;
  return (
    <div className="pagina" style={base(tema, fondo)}>
      <div style={{ position: "absolute", top: 14, right: 10 }}>
        <RamaEsquina color={tema.acento} ancho={188} opacidad={0.42} />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "62px 62px 46px",
          minHeight: 0,
        }}
      >
        <div style={{ textAlign: "center", flex: "none" }}>
          <div
            style={{
              fontSize: 46,
              lineHeight: 1.1,
              color: tema.acento,
              ...espaciado(0.1),
            }}
          >
            {nosotros.titulo}
          </div>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Divisor color={tema.acento} ancho={58} tam={11} />
          </div>
        </div>

        <div
          style={{
            marginTop: 26,
            textAlign: "center",
            flex: "none",
            paddingLeft: 22,
            paddingRight: 22,
          }}
        >
          <Parrafos
            texto={nosotros.texto}
            separacion={18}
            estilo={{
              fontSize: 17,
              lineHeight: 1.62,
              color: tema.titulo,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <DivisorFlor color={tema.acento} ancho={72} />
        </div>

        <div style={{ marginTop: 20, textAlign: "center", flex: "none" }}>
          <div style={{ fontSize: 28, color: tema.titulo, lineHeight: 1.25 }}>
            {nosotros.cierre1}
          </div>
          <div
            style={{
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--f-script)",
                fontSize: 34,
                lineHeight: 1.4,
                color: tema.acento,
              }}
            >
              {nosotros.cierre2}
            </span>
            <Corazon color={tema.acento} tam={14} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 26,
            flex: 1,
            marginTop: 26,
            minHeight: 0,
          }}
        >
          <div style={{ width: 268, flex: "none" }}>
            <Foto foto={nosotros.foto} tema={tema} fondoVacio={tema.barra} />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {nosotros.datos.map((dato, i) => (
              <div
                key={dato.id}
                style={{
                  display: "flex",
                  gap: 13,
                  alignItems: "flex-start",
                  paddingTop: i === 0 ? 0 : 9,
                  paddingBottom: 9,
                  borderBottom:
                    i === nosotros.datos.length - 1
                      ? "none"
                      : `1px solid ${tema.borde}`,
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: tema.barra,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <IconoDato id={dato.icono} color={tema.acento} tam={20} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 600,
                      color: tema.titulo,
                      ...espaciado(0.08),
                    }}
                  >
                    {dato.titulo}
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: 3,
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: tema.texto,
                    }}
                  >
                    {dato.texto.split("\n").map((linea, j) => (
                      <span key={j} style={{ display: "block" }}>
                        {linea}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Marco tema={tema} />
    </div>
  );
}

export function PaginaIndice({ catalogo }: { catalogo: Catalogo }) {
  const { tema, indice, colecciones } = catalogo;
  const muchas = colecciones.length > 6;
  return (
    <div className="pagina" style={base(tema)}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "78px 84px 56px",
          minHeight: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: "none",
          }}
        >
          <Flor tam={44} />
          <div
            style={{
              marginTop: 22,
              fontSize: 21,
              color: tema.titulo,
              ...espaciado(0.3),
            }}
          >
            {indice.encabezado}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 54,
              lineHeight: 1.1,
              color: tema.acento,
              ...espaciado(0.12),
            }}
          >
            {indice.titulo}
          </div>
          <div style={{ marginTop: 16 }}>
            <Divisor color={tema.acento} ancho={54} tam={11} />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: 0,
          }}
        >
          {colecciones.map((col, i) => (
            <div
              key={col.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                paddingTop: muchas ? 12 : 20,
                paddingBottom: muchas ? 12 : 20,
                borderBottom: `1px solid ${tema.borde}`,
              }}
            >
              <span
                style={{
                  width: muchas ? 54 : 66,
                  height: muchas ? 54 : 66,
                  borderRadius: "50%",
                  background: tema.barra,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                }}
              >
                <Icono
                  id={col.icono}
                  color={tema.titulo}
                  tam={muchas ? 26 : 32}
                />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 12.5,
                    color: tema.texto,
                    ...espaciado(0.26),
                  }}
                >
                  COLECCIÓN
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    fontSize: muchas ? 24 : 28,
                    lineHeight: 1.2,
                    color: tema.titulo,
                    ...espaciado(0.1),
                  }}
                >
                  {col.nombre}
                </span>
              </span>
              <span
                style={{
                  fontSize: muchas ? 22 : 26,
                  color: tema.acento,
                  flex: "none",
                  ...espaciado(0.06),
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 26,
            display: "flex",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <DivisorFlor color={tema.acento} ancho={86} />
        </div>
      </div>

      <Marco tema={tema} />
    </div>
  );
}

export function PaginaColeccion({
  catalogo,
  indice,
}: {
  catalogo: Catalogo;
  indice: number;
}) {
  const { tema, marca } = catalogo;
  const col = catalogo.colecciones[indice];
  if (!col) return <div className="pagina" style={base(tema)} />;

  return (
    <div className="pagina" style={base(tema)}>
      <div style={{ position: "absolute", top: 18, right: 14 }}>
        <RamaEsquina color={tema.acento} ancho={186} opacidad={0.4} />
      </div>
      <div style={{ position: "absolute", bottom: 96, left: 14 }}>
        <RamaEsquina
          color={tema.acento}
          ancho={186}
          opacidad={0.34}
          transform="scaleX(-1)"
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "58px 58px 24px",
          minHeight: 0,
        }}
      >
        <div style={{ flex: "none", display: "flex", justifyContent: "center" }}>
          <Logo tema={tema} marca={marca} />
        </div>

        <div
          style={{
            marginTop: 30,
            textAlign: "center",
            fontSize: 17,
            color: tema.titulo,
            flex: "none",
            ...espaciado(0.36),
          }}
        >
          COLECCIÓN
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <DivisorFlor color={tema.acento} ancho={118} />
        </div>

        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 56,
            lineHeight: 1.1,
            color: tema.acento,
            flex: "none",
            ...espaciado(0.16),
          }}
        >
          {col.nombre}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <DivisorFlor color={tema.acento} ancho={118} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flex: 1,
            marginTop: 22,
            minHeight: 0,
          }}
        >
          <div style={{ width: 258, flex: "none" }}>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.65,
                color: tema.titulo,
              }}
            >
              {col.descripcion}
            </p>
            {col.precio.trim() !== "" && (
              <p
                style={{
                  marginTop: 18,
                  fontSize: 21,
                  color: tema.acento,
                  ...espaciado(0.06),
                }}
              >
                {col.precio}
              </p>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
            <Foto foto={col.foto} tema={tema} fondoVacio={tema.fondo} />
          </div>
        </div>
      </div>

      <BarraNumero
        numero={String(indice + 1).padStart(2, "0")}
        tema={tema}
      />
      <Marco tema={tema} />
    </div>
  );
}

function FichaArreglo({
  arreglo,
  numero,
  moneda,
  tema,
  invertida,
}: {
  arreglo: Arreglo;
  numero: string;
  moneda: string;
  tema: Tema;
  invertida: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 38,
        flexDirection: invertida ? "row-reverse" : "row",
      }}
    >
      <div
        style={{
          width: 282,
          height: 366,
          flex: "none",
          overflow: "hidden",
          background: tema.fondo,
          boxShadow: `0 0 0 1px ${tema.borde}`,
        }}
      >
        <Foto foto={arreglo.foto} tema={tema} fondoVacio={tema.fondo} />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          textAlign: invertida ? "right" : "left",
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: tema.acento,
            fontVariantNumeric: "lining-nums",
            ...espaciado(0.2),
          }}
        >
          {numero}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 27,
            lineHeight: 1.15,
            color: tema.titulo,
            ...espaciado(0.055),
          }}
        >
          {arreglo.nombre}
        </div>
        <div
          style={{
            width: 82,
            height: 1,
            background: tema.borde,
            margin: invertida ? "15px 0 15px auto" : "15px 0",
          }}
        />
        <p style={{ fontSize: 15, lineHeight: 1.62, color: tema.texto }}>
          {arreglo.descripcion}
        </p>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "baseline",
            gap: 7,
            justifyContent: invertida ? "flex-end" : "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: tema.precio,
              fontVariantNumeric: "lining-nums",
              ...espaciado(0.04),
            }}
          >
            ${arreglo.precio}
          </span>
          {moneda.trim() !== "" && (
            <span style={{ fontSize: 16, color: tema.texto, ...espaciado(0.16) }}>
              {moneda}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PaginaArreglos({
  catalogo,
  indice,
  desde,
}: {
  catalogo: Catalogo;
  indice: number;
  desde: number;
}) {
  const { tema } = catalogo;
  const col = catalogo.colecciones[indice];
  if (!col) return <div className="pagina" style={base(tema)} />;
  const visibles = col.arreglos.slice(desde, desde + ARREGLOS_POR_PAGINA);

  return (
    <div className="pagina" style={base(tema)}>
      <div style={{ position: "absolute", top: 18, right: 14 }}>
        <RamaEsquina color={tema.acento} ancho={168} opacidad={0.32} />
      </div>
      <div style={{ position: "absolute", bottom: 96, left: 14 }}>
        <RamaEsquina
          color={tema.acento}
          ancho={150}
          opacidad={0.26}
          transform="scaleX(-1)"
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "54px 62px 20px",
          minHeight: 0,
        }}
      >
        <div style={{ flex: "none", textAlign: "center" }}>
          <div
            style={{ fontSize: 13, color: tema.titulo, ...espaciado(0.36) }}
          >
            COLECCIÓN
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 36,
              lineHeight: 1.1,
              color: tema.acento,
              ...espaciado(0.16),
            }}
          >
            {col.nombre}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DivisorFlor color={tema.acento} ancho={104} />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {visibles.map((arreglo, i) => (
            <FichaArreglo
              key={arreglo.id}
              arreglo={arreglo}
              numero={String(desde + i + 1).padStart(2, "0")}
              moneda={catalogo.moneda}
              tema={tema}
              invertida={i % 2 === 1}
            />
          ))}
        </div>
      </div>

      <BarraNumero numero={String(indice + 1).padStart(2, "0")} tema={tema} />
      <Marco tema={tema} />
    </div>
  );
}

export function Pagina({
  info,
  catalogo,
}: {
  info: PaginaInfo;
  catalogo: Catalogo;
}) {
  if (info.tipo === "portada") return <PaginaPortada catalogo={catalogo} />;
  if (info.tipo === "nosotros") return <PaginaNosotros catalogo={catalogo} />;
  if (info.tipo === "indice") return <PaginaIndice catalogo={catalogo} />;
  if (info.tipo === "coleccion") {
    return <PaginaColeccion catalogo={catalogo} indice={info.col} />;
  }
  return (
    <PaginaArreglos
      catalogo={catalogo}
      indice={info.col}
      desde={info.desde}
    />
  );
}
