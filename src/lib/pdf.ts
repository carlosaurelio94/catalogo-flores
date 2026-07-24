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

export async function pdfDePagina(elemento: HTMLElement): Promise<Blob> {
  // Un teléfono con poca memoria puede no soportar el lienzo a 3x (≈300 ppp).
  const lienzo = await lienzoDePagina(elemento, 3).catch(() =>
    lienzoDePagina(elemento, 2),
  );
  const imagen = lienzo.toDataURL("image/jpeg", 0.92);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.addImage(imagen, "JPEG", 0, 0, A4_MM.ancho, A4_MM.alto, undefined, "FAST");
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

export const esperar = (ms: number) =>
  new Promise((resolver) => setTimeout(resolver, ms));
