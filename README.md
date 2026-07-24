# Editor de catálogo

Editor web de un catálogo floral de 4 páginas que exporta **4 PDF separados** en tamaño A4, listos para imprimir o mandar por WhatsApp.

El diseño es fijo. Lo que se edita son los textos, los colores, las fuentes y las fotos.

## Cómo se usa

1. Elegís la página arriba (Portada, Signature, Colecciones, Más diseños).
2. En **Contenido** cambiás los textos, precios y fotos de esa página.
3. En **Diseño** cambiás la paleta de colores y las dos fuentes.
4. Abajo: **PDF de esta página** baja una sola, **Los 4 PDF** las baja todas.

Desde el celular aparece además **Compartir los 4 PDF**, que abre el menú nativo para mandarlos directo a WhatsApp o al mail.

## Dónde se guardan los datos

Todo vive en el navegador (IndexedDB). No hay servidor ni cuenta.

Eso significa que **si limpiás los datos del navegador, se pierde el catálogo**. Para no depender de eso, en la pestaña **Diseño** hay una sección de copia de seguridad: *Descargar copia* baja un archivo JSON con todo, y *Cargar copia* lo restaura. También sirve para pasar el catálogo de la compu al celular.

## Desarrollo

```bash
npm install
npm run dev
```

Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript.
Los PDF se generan en el navegador con `html2canvas-pro` + `jspdf`.

## Cómo está armado

- `src/lib/tipos.ts` — modelo de datos, valores iniciales y las paletas.
- `src/lib/almacen.ts` — el hook que persiste en IndexedDB.
- `src/lib/pdf.ts` — captura de la página y armado del PDF A4.
- `src/components/paginas.tsx` — el diseño de las 4 páginas (esto es lo que no se edita desde la UI).
- `src/components/editor.tsx` — el panel de edición.

Las páginas se maquetan a 794×1123 px, que es A4 exacto a 96 ppp, y se exportan a 3× (≈300 ppp). La vista previa se escala con CSS, pero la captura se hace sobre una copia oculta renderizada a tamaño real: escalar el nodo que se captura rompe el resultado.
