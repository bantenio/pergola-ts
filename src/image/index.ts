export class FileToImageResult {
  image: HTMLImageElement
  url: string

  constructor(image: HTMLImageElement, url: string) {
    this.image = image
    this.url = url
  }
}

export class DataUrlToBlobResult {
  mime: string | null
  blob: Uint8Array | null

  constructor(mime: string | null, blob: Uint8Array | null) {
    this.mime = mime
    this.blob = blob
  }

  toFile(fileName: string): File {
    return new File([this.blob.buffer], fileName, { type: this.mime })
  }
}

export function fileToImage(file: File): Promise<FileToImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e: ProgressEvent<FileReader>) {
      const image = new Image()
      const url = e.target.result
      if (url) {
        if (typeof url === 'string') {
          image.src = url
          image.onload = function () {
            resolve(new FileToImageResult(image, url))
          }
        }
      }
    }
    reader.onerror = error => reject(error)
  })
}

export function dataUrlToBlob(dataUrl: string): DataUrlToBlobResult | null {
  const dataUrlParts = dataUrl.split(',')
  if (dataUrlParts.length === 0) {
    return null
  }
  const mimePart = dataUrlParts[0],
    dataPart = atob(dataUrlParts[1])
  let mime: string | null = null
  if (mimePart) {
    const mimeMatchResult = mimePart.match(/:(.*?);/)
    if (mimeMatchResult && mimeMatchResult.length) {
      mime = mimeMatchResult[1]
    }
  }
  let blob: Uint8Array | null = null
  if (dataPart) {
    let dataPartLen = dataPart.length
    blob = new Uint8Array(dataPartLen)
    while (dataPartLen--) {
      blob[dataPartLen] = dataPart.charCodeAt(dataPartLen)
    }
  }
  return new DataUrlToBlobResult(mime, blob)
}

export function createImageHandleContext(): ImageHandleContext {
  const canvas = document.createElement('canvas')
  const context2d = canvas.getContext('2d')
  return new ImageHandleContext(canvas, context2d)
}

export interface ImageHandle {
  (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): any
}

export const ImageHandles = {
  clear: (width?: number, hegiht?: number, x: number = 0, y: number = 0): ImageHandle => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      context.clearRect(x, y, width || canvas.width, hegiht || canvas.height)
    }
  },
  drawImage: (image: HTMLImageElement, x: number = 0, y: number = 0, width?: number, hegiht?: number): ImageHandle => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      if (!width) {
        width = image.width
      }
      if (!hegiht) {
        hegiht = image.height
      }
      context.drawImage(image, x, y, width, hegiht)
    }
  },
  setWidthHeight: (width: number, hegiht: number) => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      canvas.width = width
      canvas.height = hegiht
    }
  },
  toImage: (type: string = 'image/jpeg', quality: number = 0.6) => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const dataUrl = canvas.toDataURL(type, quality)
      const image = new Image()
      image.src = dataUrl
      return image
    }
  },
  toFile: (fileName: string, type: string = 'image/jpeg', quality: number = 0.6) => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const dataUrl = canvas.toDataURL(type, quality)
      const blobResult = dataUrlToBlob(dataUrl)
      if (blobResult === null || blobResult.blob === null || blobResult.mime === null) {
        return null
      }
      return blobResult.toFile(fileName)
    }
  },
  toDataURL: (type: string = 'image/jpeg', quality: number = 0.6) => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      return canvas.toDataURL(type, quality)
    }
  },
  toBlobResult: (type: string = 'image/jpeg', quality: number = 0.6) => {
    return (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      return dataUrlToBlob(canvas.toDataURL(type, quality))
    }
  }
}

export class ImageHandleContext {
  private readonly canvas: HTMLCanvasElement
  private readonly context2d: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.context2d = context2d
  }

  handleImage(...imageHandles: ImageHandle[]) {
    const result: any[] = []
    imageHandles.forEach(imageHandle => {
      const r = imageHandle(this.canvas, this.context2d)
      if (r) {
        result.push(r)
      }
    })
  }
}
