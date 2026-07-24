"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const A4_MM = { ancho: 210, alto: 297 };

async function lienzoDePagina(elemento: HTMLElement, escala: number) {
  await document.fonts.ready;
  return html2canvas(elemento, {
    scale: escala,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });
}

async function imagenDePagina(elemento: HTMLElement) {
  // Un teléfono con poca memoria puede no soportar el lienzo a 3x (≈300 ppp).
  const lienzo = await lienzoDePagina(elemento, 3).catch(() =>
    lienzoDePagina(elemento, 2),
  );
  return lienzo.toDataURL("image/jpeg", 0.92);
}

function documentoA4() {
  return new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
}

function pegar(doc: jsPDF, imagen: string) {
  doc.addImage(imagen, "JPEG", 0, 0, A4_MM.ancho, A4_MM.alto, undefined, "FAST");
}

export async function pdfDePagina(elemento: HTMLElement): Promise<Blob> {
  const doc = documentoA4();
  pegar(doc, await imagenDePagina(elemento));
  return doc.output("blob");
}

export async function pdfDeVarias(
  elementos: HTMLElement[],
  alEmpezarPagina?: (indice: number) => void,
): Promise<Blob> {
  const doc = documentoA4();
  for (const [indice, elemento] of elementos.entries()) {
    alEmpezarPagina?.(indice);
    if (indice > 0) doc.addPage();
    pegar(doc, await imagenDePagina(elemento));
  }
  return doc.output("blob");
}

export function descargar(blob: Blob, nombre: string) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function puedeCompartir(archivos: File[]) {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: archivos })
  );
}
