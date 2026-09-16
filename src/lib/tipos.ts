export type IconoId =
  | "rosa"
  | "flor"
  | "hoja"
  | "huella"
  | "corazon"
  | "regalo"
  | "ramo"
  | "anillo";

export type IconoDatoId =
  | "calendario"
  | "tarjeta"
  | "telefono"
  | "banco"
  | "instagram"
  | "camion"
  | "reloj"
  | "sobre";

// "entero" muestra el arreglo completo dentro del recuadro; "cubrir" lo recorta
// para llenarlo. Las fotos de arreglos cambian mes a mes y tienen proporciones
// distintas, así que por defecto van enteras y siempre ocupan el mismo espacio.
export type Encaje = "cubrir" | "entero";

export type Foto = {
  src: string | null;
  pos: number;
  encaje: Encaje;
};

export type Arreglo = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  foto: Foto;
};

export type Coleccion = {
  id: string;
  icono: IconoId;
  nombre: string;
  descripcion: string;
  precio: string;
  foto: Foto;
  arreglos: Arreglo[];
};

// Dos por hoja es la retícula del diseño, no un ajuste: la ficha ocupa media
// página. Si entrasen tres habría que rehacer las medidas de la ficha.
export const ARREGLOS_POR_PAGINA = 2;

export type Dato = {
  id: string;
  icono: IconoDatoId;
  titulo: string;
  texto: string;
};

export type Tema = {
  fondo: string;
  acento: string;
  barra: string;
  titulo: string;
  texto: string;
  borde: string;
  precio: string;
  fuenteTitulo: string;
  fuenteScript: string;
};

export type Catalogo = {
  tema: Tema;
  marca: {
    nombre: string;
    submarca: string;
  };
  portada: {
    lema: string;
    titulo: string;
    subtitulo: string;
    foto: Foto;
    servicio: string;
    telefono1: string;
    telefono2: string;
    ciudad: string;
  };
  nosotros: {
    titulo: string;
    texto: string;
    cierre1: string;
    cierre2: string;
    foto: Foto;
    datos: Dato[];
  };
  indice: {
    encabezado: string;
    titulo: string;
  };
  colecciones: Coleccion[];
  moneda: string;
};

export const foto = (encaje: Encaje = "cubrir"): Foto => ({
  src: null,
  pos: 50,
  encaje,
});

export const fotoDe = (src: string, pos = 50, encaje: Encaje = "cubrir"): Foto => ({
  src,
  pos,
  encaje,
});

let contador = 0;
export function nuevoId(prefijo: string) {
  contador += 1;
  return `${prefijo}-${Date.now().toString(36)}-${contador}`;
}

export function arregloNuevo(): Arreglo {
  return {
    id: nuevoId("arr"),
    nombre: "Arreglo nuevo",
    descripcion: "Contá qué flores lleva y para qué ocasión es ideal.",
    precio: "0",
    foto: foto("cubrir"),
  };
}

export const TEMA_INICIAL: Tema = {
  fondo: "#faf5f0",
  acento: "#c98b95",
  barra: "#f4dade",
  titulo: "#4b3a34",
  texto: "#7a675e",
  borde: "#e8c9ce",
  precio: "#3b3330",
  fuenteTitulo: "cormorant",
  fuenteScript: "parisienne",
};

export const CATALOGO_INICIAL: Catalogo = {
  tema: TEMA_INICIAL,
  marca: {
    nombre: "Urbano",
    submarca: "FLORISTERÍA",
  },
  portada: {
    lema: "CREAMOS MOMENTOS QUE FLORECEN",
    titulo: "CATÁLOGO",
    subtitulo: "COLECCIONES 2026",
    foto: fotoDe("/fotos/sig02.jpg", 35),
    servicio: "FLORES A DOMICILIO",
    telefono1: "+58 414-2170514",
    telefono2: "+58 414-2603415",
    ciudad: "CARACAS, VENEZUELA",
  },
  nosotros: {
    titulo: "QUIÉNES SOMOS",
    texto: [
      "Urbano Floristería nació dentro de un Vivero, donde la naturaleza nos inspira cada día.",
      "Diseñamos arreglos únicos con flores frescas y de la más alta calidad, combinando creatividad, dedicación y mucho amor en cada detalle.",
      "Nuestro compromiso es ofrecerte momentos inolvidables a través del lenguaje universal de las flores.",
    ].join("\n\n"),
    cierre1: "Hecho en un Vivero,",
    cierre2: "hecho con amor.",
    foto: fotoDe("/fotos/ese02.jpg", 40, "entero"),
    datos: [
      {
        id: "d1",
        icono: "calendario",
        titulo: "PEDIDOS",
        texto:
          "Todos nuestros arreglos se realizan con previo pedido para garantizar frescura y personalización.",
      },
      {
        id: "d2",
        icono: "tarjeta",
        titulo: "ABONO",
        texto: "Se requiere abono del 50% para confirmar tu pedido.",
      },
      {
        id: "d5",
        icono: "instagram",
        titulo: "SÍGUENOS",
        texto: "@urbano_floristeria",
      },
    ],
  },
  indice: {
    encabezado: "ÍNDICE DE",
    titulo: "COLECCIONES",
  },
  colecciones: [
    {
      id: "c1",
      icono: "hoja",
      nombre: "SIGNATURE",
      descripcion: "Diseños exclusivos para momentos únicos e inolvidables.",
      precio: "",
      foto: fotoDe("/fotos/sig02.jpg", 40),
      arreglos: [
        {
          id: "a-sig-1",
          nombre: "Jardín de Autor",
          descripcion:
            "Cesta artesanal en kraft con gerbera, crisantemos, alstroemerias y rosas en tonos vivos. Una pieza generosa, pensada para celebrar en grande.",
          precio: "15",
          foto: fotoDe("/fotos/sig01.jpg", 50),
        },
        {
          id: "a-sig-2",
          nombre: "Cesta Aurora",
          descripcion:
            "Rosas, mini rosas y lisianthus en degradé de rosados suaves, rematada con lazo de raso. Elegancia serena en cada detalle.",
          precio: "65",
          foto: fotoDe("/fotos/sig02.jpg", 30),
        },
        {
          id: "a-sig-3",
          nombre: "Mesa Botánica",
          descripcion:
            "Diseño horizontal con rosas coral, lisianthus lila y follaje fresco. Ideal como centro de mesa para reuniones y celebraciones.",
          precio: "75",
          foto: fotoDe("/fotos/sig03.jpg", 35),
        },
        {
          id: "a-sig-4",
          nombre: "Sol de Verano",
          descripcion:
            "Girasoles, margaritas blancas y solidago en bolsa kraft con lazo de raso. Luz y alegría en un solo arreglo.",
          precio: "15",
          foto: fotoDe("/fotos/sig04.jpg", 30),
        },
      ],
    },
    {
      id: "c2",
      icono: "rosa",
      nombre: "ROMANCE",
      descripcion: "Flores que hablan cuando las palabras no alcanzan.",
      precio: "",
      foto: fotoDe("/fotos/rom01.jpg", 35),
      arreglos: [
        {
          id: "a-rom-1",
          nombre: "Eterno",
          descripcion:
            "Rosas rojas de tallo largo con gypsophila y eucalipto, envueltas en papel translúcido y cinta negra. El clásico que nunca falla.",
          precio: "30",
          foto: fotoDe("/fotos/rom01.jpg", 32),
        },
        {
          id: "a-rom-2",
          nombre: "Vino y Marfil",
          descripcion:
            "Rosas rojas y rosas marfil sobre envoltura en dorado y negro. Un contraste sobrio para declaraciones importantes.",
          precio: "18",
          foto: fotoDe("/fotos/rom02.jpg", 50),
        },
      ],
    },
    {
      id: "c3",
      icono: "hoja",
      nombre: "SERENITY",
      descripcion: "Un detalle que transmite calma, gratitud y paz.",
      precio: "",
      foto: fotoDe("/fotos/ser02.jpg", 45),
      arreglos: [
        {
          id: "a-ser-1",
          nombre: "Serenata",
          descripcion:
            "Rosa avalanche, crisantemos lila y mini claveles en papel vino y dorado. Suavidad con un toque de carácter.",
          precio: "18",
          foto: fotoDe("/fotos/ser01.jpg", 50),
        },
        {
          id: "a-ser-2",
          nombre: "Amanecer",
          descripcion:
            "Rosas coral, margaritas y alstroemerias sobre papel marfil. Un ramo cálido para dar los buenos días.",
          precio: "15",
          foto: fotoDe("/fotos/ser02.jpg", 50),
        },
        {
          id: "a-ser-3",
          nombre: "Bienvenida",
          descripcion:
            "Gerbera roja, rosas amarillas y crisantemos lila envueltos en papel marfil con doble lazo. Perfecto para decir gracias.",
          precio: "16",
          foto: fotoDe("/fotos/ser03.jpg", 50),
        },
        {
          id: "a-ser-4",
          nombre: "Brisa",
          descripcion:
            "Gerbera, margaritas y alstroemerias en tonos amarillo y blanco sobre papel celeste. Frescura para alegrar cualquier espacio.",
          precio: "18",
          foto: fotoDe("/fotos/ser04.jpg", 50),
        },
        {
          id: "a-ser-5",
          nombre: "Campo Abierto",
          descripcion:
            "Girasoles, crisantemos fucsia y solidago en envoltura gris perla. Un ramo abundante, luminoso y lleno de vida.",
          precio: "35",
          foto: fotoDe("/fotos/ser05.jpg", 50),
        },
        {
          id: "a-ser-6",
          nombre: "Gratitud",
          descripcion:
            "Girasoles, rosas blancas y follaje azulado sobre papel kraft. El detalle ideal para agradecer de corazón.",
          precio: "30",
          foto: fotoDe("/fotos/ser06.jpg", 50),
        },
      ],
    },
    {
      id: "c4",
      icono: "huella",
      nombre: "PAW FLOWERS",
      descripcion: "Porque ellos también dejan huellas en el corazón.",
      precio: "",
      foto: foto("entero"),
      arreglos: [],
    },
    {
      id: "c5",
      icono: "flor",
      nombre: "ESENCIA",
      descripcion:
        "Pequeños detalles con el mismo cariño y elegancia de siempre. Diseños pensados para sorprender sin exceder tu presupuesto.",
      precio: "",
      foto: fotoDe("/fotos/ese02.jpg", 40),
      arreglos: [
        {
          id: "a-ese-1",
          nombre: "Detalle Kraft",
          descripcion:
            "Rosas naranjas, margaritas y alstroemerias en bolsa kraft con lazo de raso. Pequeño en tamaño, enorme en intención.",
          precio: "18",
          foto: fotoDe("/fotos/ese01.jpg", 30),
        },
        {
          id: "a-ese-2",
          nombre: "Dulce Detalle",
          descripcion:
            "Gerberas, margaritas y mini rosas en bolsa rosada. Un regalo sencillo y encantador para cualquier día.",
          precio: "18",
          foto: fotoDe("/fotos/ese02.jpg", 30),
        },
        {
          id: "a-ese-3",
          nombre: "Rayo de Sol",
          descripcion:
            "Rosas naranjas, crisantemos amarillos y follaje en envoltura clara. Un ramo compacto que ilumina el día.",
          precio: "25",
          foto: fotoDe("/fotos/ese03.jpg", 30),
        },
        {
          id: "a-ese-4",
          nombre: "Coral",
          descripcion:
            "Rosas coral, crisantemos vino y alstroemerias blancas. Colores intensos en formato íntimo.",
          precio: "12",
          foto: fotoDe("/fotos/ese04.jpg", 50),
        },
      ],
    },
  ],
  moneda: "USD",
};

export function coleccionNueva(numero: number): Coleccion {
  return {
    id: `c${Date.now().toString(36)}`,
    icono: "flor",
    nombre: `COLECCIÓN ${numero}`,
    descripcion: "Escribí acá una frase corta que describa la colección.",
    precio: "",
    foto: foto("entero"),
    arreglos: [arregloNuevo()],
  };
}

export const PALETAS: { nombre: string; tema: Partial<Tema> }[] = [
  {
    nombre: "Rosa clásico",
    tema: {
      fondo: "#faf5f0",
      acento: "#c98b95",
      barra: "#f4dade",
      titulo: "#4b3a34",
      texto: "#7a675e",
      borde: "#e8c9ce",
    },
  },
  {
    nombre: "Verde botánico",
    tema: {
      fondo: "#f5f7f2",
      acento: "#7d9670",
      barra: "#dfe8d6",
      titulo: "#38412f",
      texto: "#63705a",
      borde: "#cbdabe",
    },
  },
  {
    nombre: "Terracota",
    tema: {
      fondo: "#fbf4ee",
      acento: "#b96f50",
      barra: "#f2ddd0",
      titulo: "#4a332a",
      texto: "#7d6152",
      borde: "#e6c9b5",
    },
  },
  {
    nombre: "Lavanda",
    tema: {
      fondo: "#f8f5fa",
      acento: "#9179ae",
      barra: "#e6dcf0",
      titulo: "#3d3348",
      texto: "#6d6079",
      borde: "#d6c6e8",
    },
  },
  {
    nombre: "Azul sereno",
    tema: {
      fondo: "#f4f7f9",
      acento: "#6f92ad",
      barra: "#d9e6ee",
      titulo: "#2f3f4a",
      texto: "#5d707d",
      borde: "#c3d6e2",
    },
  },
  {
    nombre: "Negro y oro",
    tema: {
      fondo: "#faf8f4",
      acento: "#a8842f",
      barra: "#ece3cf",
      titulo: "#26221c",
      texto: "#6a6157",
      borde: "#ddcdab",
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
