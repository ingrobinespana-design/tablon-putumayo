// Comprime y redimensiona una imagen en el navegador ANTES de subirla.
// Las fotos de celular pesan varios MB cada una; subir 6 por señal rural
// hace que la conexión se caiga. Aquí las bajamos a ~1600px y JPEG ~80%,
// quedando en unos cientos de KB, sin pérdida visible de calidad.

export async function comprimirImagen(file, maxLado = 1600, calidad = 0.8) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  try {
    // imageOrientation: respeta la rotación EXIF (fotos verticales de celular)
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    let { width, height } = bitmap;
    const escala = Math.min(1, maxLado / Math.max(width, height));
    width = Math.round(width * escala);
    height = Math.round(height * escala);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close && bitmap.close();

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', calidad));
    if (!blob) return file;

    // Si por algún motivo quedó más pesada que la original, usa la original.
    if (blob.size >= file.size) return file;

    const base = (file.name || 'foto').replace(/\.[^.]+$/, '');
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
  } catch (e) {
    return file; // ante cualquier fallo, sube la original (no bloquea al usuario)
  }
}
