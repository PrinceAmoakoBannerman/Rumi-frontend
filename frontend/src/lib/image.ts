/**
 * Shrink and normalise a photo in the browser before it is uploaded.
 *
 * Phones hand us large 12-megapixel pictures, and iPhones hand us HEIC, which
 * the server's image check rejects. We draw the picture onto a canvas no bigger
 * than 1600px on its longest side and export a JPEG — which shrinks it and, on
 * a device that can decode HEIC (an iPhone), converts it to a format the server
 * accepts.
 *
 * If anything cannot be decoded, the original file is returned untouched so the
 * upload still goes ahead and the server has the final say.
 */
const MAX_EDGE = 1600
const QUALITY = 0.85

export async function prepareImage(file: File): Promise<File> {
  const looksLikeImage =
    file.type.startsWith('image/') || /\.(jpe?g|png|heic|heif|webp|gif|bmp|tiff?)$/i.test(file.name)
  if (!looksLikeImage) return file

  try {
    const source = await decode(file)
    const w = (source as { width: number }).width
    const h = (source as { height: number }).height
    if (!w || !h) return file

    const scale = Math.min(1, MAX_EDGE / Math.max(w, h))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(w * scale))
    canvas.height = Math.max(1, Math.round(h * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height)
    if ('close' in source && typeof source.close === 'function') source.close()

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    )
    if (!blob) return file

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    // A format the browser cannot decode (HEIC on a desktop, say) — leave it
    // for the server to accept or reject.
    return file
  }
}

/** Decode to something drawable, honouring the photo's own orientation. */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Some browsers cannot decode HEIC this way; fall back to an <img>.
    }
  }
  return await loadViaImg(file)
}

function loadViaImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('could not decode image'))
    }
    img.src = url
  })
}
