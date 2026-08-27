import type { IconoDatoId, IconoId } from "@/lib/tipos";

export function Ornamento({ color, tam = 28 }: { color: string; tam?: number }) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M12 22V9" />
      <path d="M12 15c0-3 2.3-5.2 5.4-5.2C17.4 12.8 15.1 15 12 15Z" />
      <path d="M12 15c0-3-2.3-5.2-5.4-5.2C6.6 12.8 8.9 15 12 15Z" />
      <circle cx="12" cy="5.4" r="3" />
    </svg>
  );
}

export function Corazon({ color, tam = 12 }: { color: string; tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21s-8-5.1-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 15.9 12 21 12 21Z" />
    </svg>
  );
}

export function Divisor({
  color,
  ancho = 70,
  tam = 12,
}: {
  color: string;
  ancho?: number;
  tam?: number;
}) {
  const linea = {
    width: ancho,
    height: 1,
    background: color,
    opacity: 0.45,
  } as const;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={linea} />
      <Corazon color={color} tam={tam} />
      <span style={linea} />
    </div>
  );
}

function Estrellita({ color, tam = 13 }: { color: string; tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill={color}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="12"
          cy="7"
          rx="2"
          ry="4.4"
          opacity="0.8"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="1.8" />
    </svg>
  );
}

// El divisor de las páginas de colección: dos líneas largas con una florcita.
export function DivisorFlor({
  color,
  ancho = 150,
}: {
  color: string;
  ancho?: number;
}) {
  const linea = { width: ancho, height: 1, background: color, opacity: 0.4 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={linea} />
      <Estrellita color={color} />
      <span style={linea} />
    </div>
  );
}

export function BarraNumero({
  numero,
  tema,
}: {
  numero: string;
  tema: { barra: string; titulo: string; acento: string };
}) {
  return (
    <div
      style={{
        background: tema.barra,
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flex: "none",
      }}
    >
      <span style={{ width: 34, height: 1, background: tema.titulo, opacity: 0.5 }} />
      <span
        style={{
          fontFamily: "var(--f-titulo)",
          fontSize: 20,
          letterSpacing: "0.14em",
          paddingLeft: "0.14em",
          color: tema.titulo,
        }}
      >
        {numero}
      </span>
      <span style={{ width: 34, height: 1, background: tema.titulo, opacity: 0.5 }} />
    </div>
  );
}

// Rama decorativa para las esquinas. Se dibuja mirando hacia arriba-derecha y
// se espeja con `transform` para reutilizarla en las otras esquinas.
export function RamaEsquina({
  color,
  ancho = 200,
  opacidad = 0.5,
  transform,
}: {
  color: string;
  ancho?: number;
  opacidad?: number;
  transform?: string;
}) {
  const hojas = [
    { x: 46, y: 150, r: -38, e: 1 },
    { x: 46, y: 150, r: 158, e: 0.86 },
    { x: 74, y: 116, r: -30, e: 0.92 },
    { x: 74, y: 116, r: 166, e: 0.78 },
    { x: 104, y: 86, r: -24, e: 0.84 },
    { x: 104, y: 86, r: 172, e: 0.7 },
    { x: 134, y: 62, r: -18, e: 0.74 },
    { x: 134, y: 62, r: 178, e: 0.6 },
  ];
  return (
    <svg
      width={ancho}
      height={ancho}
      viewBox="0 0 200 200"
      fill="none"
      opacity={opacidad}
      style={transform ? { transform } : undefined}
    >
      <path
        d="M18 190C34 156 58 124 88 96 116 70 144 50 176 34"
        stroke={color}
        strokeOpacity="0.75"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {hojas.map((h, i) => (
        <path
          key={i}
          d="M0 0C16 -15 46 -16 62 0 46 16 16 15 0 0Z"
          stroke={color}
          strokeOpacity="0.75"
          strokeWidth="1.1"
          transform={`translate(${h.x} ${h.y}) rotate(${h.r}) scale(${h.e})`}
        />
      ))}
      {[
        { x: 168, y: 44 },
        { x: 178, y: 58 },
        { x: 156, y: 56 },
        { x: 62, y: 168 },
        { x: 48, y: 176 },
      ].map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r="4.2"
          stroke={color}
          strokeOpacity="0.7"
          strokeWidth="1.1"
        />
      ))}
    </svg>
  );
}

export function RamaBotanica({ color }: { color: string }) {
  const hojas = [
    { x: 100, y: 300, r: -30, e: 1 },
    { x: 100, y: 300, r: 210, e: 0.9 },
    { x: 104, y: 232, r: -22, e: 0.92 },
    { x: 104, y: 232, r: 202, e: 0.82 },
    { x: 110, y: 168, r: -14, e: 0.84 },
    { x: 110, y: 168, r: 194, e: 0.74 },
    { x: 116, y: 112, r: -8, e: 0.72 },
    { x: 116, y: 112, r: 188, e: 0.62 },
  ];
  return (
    <svg viewBox="0 0 220 420" width="100%" height="100%" fill="none">
      <path
        d="M100 410C96 330 98 250 108 180 116 122 128 84 140 56"
        stroke={color}
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {hojas.map((h, i) => (
        <path
          key={i}
          d="M0 0C22 -20 62 -22 84 0 62 22 22 20 0 0Z"
          fill={color}
          fillOpacity={0.16}
          stroke={color}
          strokeOpacity={0.42}
          strokeWidth="1"
          transform={`translate(${h.x} ${h.y}) rotate(${h.r}) scale(${h.e})`}
        />
      ))}
      <g transform="translate(146 44)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-26"
            rx="15"
            ry="28"
            fill={color}
            fillOpacity="0.2"
            stroke={color}
            strokeOpacity="0.45"
            strokeWidth="1"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="8" fill={color} fillOpacity="0.4" />
      </g>
    </svg>
  );
}

export const ICONOS: { id: IconoId; etiqueta: string }[] = [
  { id: "rosa", etiqueta: "Rosa" },
  { id: "flor", etiqueta: "Flor" },
  { id: "hoja", etiqueta: "Hoja" },
  { id: "huella", etiqueta: "Huella" },
  { id: "corazon", etiqueta: "Corazón" },
  { id: "regalo", etiqueta: "Regalo" },
  { id: "ramo", etiqueta: "Ramo" },
  { id: "anillo", etiqueta: "Anillos" },
];

export function Icono({
  id,
  color,
  tam = 30,
}: {
  id: IconoId;
  color: string;
  tam?: number;
}) {
  const comun = {
    width: tam,
    height: tam,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (id === "huella") {
    return (
      <svg width={tam} height={tam} viewBox="0 0 24 24" fill={color}>
        <ellipse cx="7" cy="8.5" rx="2.1" ry="2.8" />
        <ellipse cx="12" cy="6.6" rx="2.1" ry="2.9" />
        <ellipse cx="17" cy="8.5" rx="2.1" ry="2.8" />
        <ellipse cx="20" cy="13.4" rx="1.8" ry="2.3" />
        <path d="M12 12.2c3.2 0 5.6 2.4 5.6 4.8 0 1.9-1.5 2.9-3.2 2.9-1 0-1.6-.4-2.4-.4s-1.4.4-2.4.4c-1.7 0-3.2-1-3.2-2.9 0-2.4 2.4-4.8 5.6-4.8Z" />
      </svg>
    );
  }

  if (id === "corazon") {
    return (
      <svg {...comun}>
        <path d="M12 20.5S3.5 15 3.5 9.4A4.9 4.9 0 0 1 12 5.9a4.9 4.9 0 0 1 8.5 3.5c0 5.6-8.5 11.1-8.5 11.1Z" />
      </svg>
    );
  }

  if (id === "hoja") {
    return (
      <svg {...comun}>
        <path d="M4 20C3 11 9 4 20 4c1 10-5.5 16-16 16Z" />
        <path d="M4 20C7 15 11 11 17 8" />
      </svg>
    );
  }

  if (id === "flor") {
    return (
      <svg {...comun}>
        <circle cx="12" cy="12" r="2.6" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="12"
            cy="6.2"
            rx="2.7"
            ry="4"
            transform={`rotate(${a} 12 12)`}
          />
        ))}
      </svg>
    );
  }

  if (id === "regalo") {
    return (
      <svg {...comun}>
        <rect x="3.5" y="9.5" width="17" height="11" rx="1.4" />
        <path d="M2.5 6.5h19v3h-19z" />
        <path d="M12 6.5v14" />
        <path d="M12 6.5C10.5 6.5 8 6 8 4.3 8 3.2 8.8 2.5 9.8 2.5c1.5 0 2.2 1.9 2.2 4Z" />
        <path d="M12 6.5c1.5 0 4-.5 4-2.2 0-1.1-.8-1.8-1.8-1.8-1.5 0-2.2 1.9-2.2 4Z" />
      </svg>
    );
  }

  if (id === "ramo") {
    return (
      <svg {...comun}>
        <circle cx="8" cy="6" r="2.4" />
        <circle cx="16" cy="6" r="2.4" />
        <circle cx="12" cy="4.2" r="2.4" />
        <path d="M9 9.5 12 21M15 9.5 12 21M12 8.5V21" />
        <path d="M7 14.5c2 .8 3.6 2 5 3.4M17 14.5c-2 .8-3.6 2-5 3.4" />
      </svg>
    );
  }

  if (id === "anillo") {
    return (
      <svg {...comun}>
        <circle cx="9" cy="15" r="5" />
        <circle cx="16" cy="15" r="5" />
        <path d="M9 6.5 7 3.5h4L9 6.5Z" />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <path d="M12 11.5c-2 0-3.4-1.3-3.4-2.9 0-1.5 1.2-2.6 2.6-2.6 1.2 0 2 .8 2 1.8 0 .8-.6 1.4-1.3 1.4" />
      <circle cx="12" cy="9" r="5.2" />
      <path d="M12 14.2V21" />
      <path d="M12 17.4c-1.6-1.6-3.4-1.9-5-1.6.2 1.8 1.9 3.4 5 3Z" />
      <path d="M12 19c1.4-1.4 3-1.7 4.4-1.4-.2 1.6-1.7 3-4.4 2.6Z" />
    </svg>
  );
}

export const ICONOS_DATO: { id: IconoDatoId; etiqueta: string }[] = [
  { id: "calendario", etiqueta: "Calendario" },
  { id: "tarjeta", etiqueta: "Tarjeta" },
  { id: "telefono", etiqueta: "Teléfono" },
  { id: "banco", etiqueta: "Banco" },
  { id: "instagram", etiqueta: "Instagram" },
  { id: "camion", etiqueta: "Envío" },
  { id: "reloj", etiqueta: "Horario" },
  { id: "sobre", etiqueta: "Correo" },
];

export function IconoDato({
  id,
  color,
  tam = 24,
}: {
  id: IconoDatoId;
  color: string;
  tam?: number;
}) {
  const comun = {
    width: tam,
    height: tam,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (id === "tarjeta") {
    return (
      <svg {...comun}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
        <path d="M2.5 10h19" />
        <path d="M6 14.5h4" />
      </svg>
    );
  }

  if (id === "telefono") {
    return (
      <svg {...comun}>
        <path d="M7.5 2.8h9a1.7 1.7 0 0 1 1.7 1.7v15a1.7 1.7 0 0 1-1.7 1.7h-9a1.7 1.7 0 0 1-1.7-1.7v-15A1.7 1.7 0 0 1 7.5 2.8Z" />
        <path d="M10.5 18.3h3" />
      </svg>
    );
  }

  if (id === "banco") {
    return (
      <svg {...comun}>
        <path d="M2.8 9.2 12 4l9.2 5.2" />
        <path d="M4.8 9.8v8M9.6 9.8v8M14.4 9.8v8M19.2 9.8v8" />
        <path d="M2.8 20.2h18.4" />
      </svg>
    );
  }

  if (id === "instagram") {
    return (
      <svg {...comun}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill={color} stroke="none" />
      </svg>
    );
  }

  if (id === "camion") {
    return (
      <svg {...comun}>
        <path d="M1.5 6.5h11v9h-11z" />
        <path d="M12.5 9.5h4l3 3v3h-7z" />
        <circle cx="5.5" cy="17.5" r="2" />
        <circle cx="17" cy="17.5" r="2" />
      </svg>
    );
  }

  if (id === "reloj") {
    return (
      <svg {...comun}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6.8V12l3.4 2.2" />
      </svg>
    );
  }

  if (id === "sobre") {
    return (
      <svg {...comun}>
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2" />
      <path d="M3.2 9.6h17.6M8 3v4M16 3v4" />
      <circle cx="9" cy="14" r="1.1" fill={color} stroke="none" />
      <circle cx="15" cy="14" r="1.1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconoWhatsapp({
  color,
  tam = 22,
}: {
  color: string;
  tam?: number;
}) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.2 22l5.3-1.4A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.5-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.9.7 1.9.5 2.3.5a2.5 2.5 0 0 0 1.7-1.2 2 2 0 0 0 .1-1.2l-.4-.2Z" />
    </svg>
  );
}

export function IconoUbicacion({
  color,
  tam = 22,
}: {
  color: string;
  tam?: number;
}) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.5s7-6.2 7-11.3A7 7 0 0 0 5 10.2c0 5.1 7 11.3 7 11.3Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}
