const LADO_MAX = 1400;

export async function aDataUrl(archivo: File): Promise<string> {
  const bitmap = await createImageBitmap(archivo, {
    imageOrientation: "from-image",
  });
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  return lienzo.toDataURL("image/jpeg", 0.88);
}
