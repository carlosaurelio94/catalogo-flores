export type IconoId =
  | "rosa"
  | "flor"
  | "hoja"
  | "huella"
  | "corazon"
  | "regalo"
  | "ramo"
  | "anillo";

export type Foto = {
  src: string | null;
  pos: number;
};

export type Producto = {
  id: string;
  nombre: string;
  precio: string;
  foto: Foto;
};

export type Coleccion = {
  id: string;
  icono: IconoId;
  nombre: string;
  descripcion: string;
};

export type Tema = {
  fondo: string;
  acento: string;
  barra: string;
  titulo: string;
  texto: string;
  borde: string;
  fuenteTitulo: string;
  fuenteScript: string;
};

export type Catalogo = {
  tema: Tema;
  portada: {
    marca: string;
    submarca: string;
    lema: string;
    titulo: string;
    subtitulo: string;
    foto: Foto;
    servicio: string;
    telefono: string;
    ciudad: string;
  };
  signature: {
    etiqueta: string;
    titulo: string;
    script: string;
    descripcion: string;
    destacado: Producto;
    productos: Producto[];
    numero: string;
  };
  colecciones: {
    titulo: string;
    items: Coleccion[];
    marcaPie: string;
    lemaPie: string;
    numero: string;
  };
  masDisenos: {
    titulo: string;
    productos: Producto[];
    cierre1: string;
    cierre2: string;
    numero: string;
  };
};

const foto = (): Foto => ({ src: null, pos: 50 });

const producto = (id: string, nombre: string, precio: string): Producto => ({
  id,
  nombre,
  precio,
  foto: foto(),
});

export const TEMA_INICIAL: Tema = {
  fondo: "#faf5f0",
  acento: "#d49aa4",
  barra: "#f4dade",
  titulo: "#4b3a34",
  texto: "#7a675e",
  borde: "#ecd5d8",
  fuenteTitulo: "cormorant",
  fuenteScript: "parisienne",
};

export const CATALOGO_INICIAL: Catalogo = {
  tema: TEMA_INICIAL,
  portada: {
    marca: "URBANO",
    submarca: "FLOWERS",
    lema: "CREAMOS MOMENTOS QUE FLORECEN",
    titulo: "CATÁLOGO",
    subtitulo: "COLECCIONES 2026",
    foto: foto(),
    servicio: "FLORES A DOMICILIO",
    telefono: "0412 123 4567",
    ciudad: "CARACAS, VENEZUELA",
  },
  signature: {
    etiqueta: "COLECCIÓN",
    titulo: "SIGNATURE",
    script: "Edición especial",
    descripcion:
      "Diseños exclusivos creados para momentos únicos e inolvidables.",
    destacado: producto("d1", "Cesta Encanto", "$85"),
    productos: [
      producto("s1", "Jardín de Rosas", "$75"),
      producto("s2", "Susurro de Amor", "$60"),
    ],
    numero: "02",
  },
  colecciones: {
    titulo: "COLECCIONES",
    items: [
      {
        id: "c1",
        icono: "rosa",
        nombre: "ROMANCE",
        descripcion: "Expresa tu amor con la belleza de las flores.",
      },
      {
        id: "c2",
        icono: "flor",
        nombre: "CELEBRATION",
        descripcion: "Celebra cada logro, cada sonrisa, cada momento.",
      },
      {
        id: "c3",
        icono: "hoja",
        nombre: "SERENITY",
        descripcion: "Acompañamos tus momentos de paz y reflexión.",
      },
      {
        id: "c4",
        icono: "huella",
        nombre: "PAW FLOWERS",
        descripcion: "Porque ellos también dejan huellas en el corazón.",
      },
    ],
    marcaPie: "URBANO FLOWERS",
    lemaPie: "MÁS QUE FLORES, EMOCIONES",
    numero: "03",
  },
  masDisenos: {
    titulo: "MÁS DISEÑOS",
    productos: [
      producto("m1", "Dulce Melodía", "$55"),
      producto("m2", "Brisa de Primavera", "$50"),
      producto("m3", "Alma Natural", "$45"),
      producto("m4", "Pureza", "$40"),
    ],
    cierre1: "GRACIAS POR ELEGIR FLORES",
    cierre2: "QUE HABLAN DESDE EL CORAZÓN.",
    numero: "04",
  },
};

export const PALETAS: { nombre: string; tema: Partial<Tema> }[] = [
  {
    nombre: "Rosa clásico",
    tema: {
      fondo: "#faf5f0",
      acento: "#d49aa4",
      barra: "#f4dade",
      titulo: "#4b3a34",
      texto: "#7a675e",
      borde: "#ecd5d8",
    },
  },
  {
    nombre: "Verde botánico",
    tema: {
      fondo: "#f5f7f2",
      acento: "#8aa17c",
      barra: "#dfe8d6",
      titulo: "#38412f",
      texto: "#63705a",
      borde: "#d5e0ca",
    },
  },
  {
    nombre: "Terracota",
    tema: {
      fondo: "#fbf4ee",
      acento: "#c07a5c",
      barra: "#f2ddd0",
      titulo: "#4a332a",
      texto: "#7d6152",
      borde: "#ecd6c7",
    },
  },
  {
    nombre: "Lavanda",
    tema: {
      fondo: "#f8f5fa",
      acento: "#9d87b8",
      barra: "#e6dcf0",
      titulo: "#3d3348",
      texto: "#6d6079",
      borde: "#ded2ec",
    },
  },
  {
    nombre: "Azul sereno",
    tema: {
      fondo: "#f4f7f9",
      acento: "#7d9db5",
      barra: "#d9e6ee",
      titulo: "#2f3f4a",
      texto: "#5d707d",
      borde: "#cddde7",
    },
  },
  {
    nombre: "Negro y oro",
    tema: {
      fondo: "#faf8f4",
      acento: "#b3903f",
      barra: "#ece3cf",
      titulo: "#26221c",
      texto: "#6a6157",
      borde: "#e3d7bd",
    },
  },
];

export const FUENTES_TITULO = [
  { id: "cormorant", nombre: "Cormorant", css: "var(--f-cormorant)" },
  { id: "playfair", nombre: "Playfair", css: "var(--f-playfair)" },
  { id: "lora", nombre: "Lora", css: "var(--f-lora)" },
  { id: "jost", nombre: "Jost (sin serifa)", css: "var(--f-jost)" },
];

export const FUENTES_SCRIPT = [
  { id: "parisienne", nombre: "Parisienne", css: "var(--f-parisienne)" },
  { id: "greatvibes", nombre: "Great Vibes", css: "var(--f-greatvibes)" },
  { id: "dancing", nombre: "Dancing Script", css: "var(--f-dancing)" },
];

export function fuenteCss(lista: typeof FUENTES_TITULO, id: string) {
  return (lista.find((f) => f.id === id) ?? lista[0]).css;
}
