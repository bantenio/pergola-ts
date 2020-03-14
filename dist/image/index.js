export class FileToImageResult {
    constructor(image, url) {
        this.image = image;
        this.url = url;
    }
}
export class DataUrlToBlobResult {
    constructor(mime, blob) {
        this.mime = mime;
        this.blob = blob;
    }
    toFile(fileName) {
        return new File([this.blob.buffer], fileName, { type: this.mime });
    }
}
export function fileToImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            const image = new Image();
            const url = e.target.result;
            if (url) {
                if (typeof url === 'string') {
                    image.src = url;
                    image.onload = function () {
                        resolve(new FileToImageResult(image, url));
                    };
                }
            }
        };
        reader.onerror = error => reject(error);
    });
}
export function dataUrlToBlob(dataUrl) {
    const dataUrlParts = dataUrl.split(',');
    if (dataUrlParts.length === 0) {
        return null;
    }
    const mimePart = dataUrlParts[0], dataPart = atob(dataUrlParts[1]);
    let mime = null;
    if (mimePart) {
        const mimeMatchResult = mimePart.match(/:(.*?);/);
        if (mimeMatchResult && mimeMatchResult.length) {
            mime = mimeMatchResult[1];
        }
    }
    let blob = null;
    if (dataPart) {
        let dataPartLen = dataPart.length;
        blob = new Uint8Array(dataPartLen);
        while (dataPartLen--) {
            blob[dataPartLen] = dataPart.charCodeAt(dataPartLen);
        }
    }
    return new DataUrlToBlobResult(mime, blob);
}
export function createImageHandleContext() {
    const canvas = document.createElement('canvas');
    const context2d = canvas.getContext('2d');
    return new ImageHandleContext(canvas, context2d);
}
export const ImageHandles = {
    clear: (width, hegiht, x = 0, y = 0) => {
        return (canvas, context) => {
            context.clearRect(x, y, width || canvas.width, hegiht || canvas.height);
        };
    },
    drawImage: (image, x = 0, y = 0, width, hegiht) => {
        return (canvas, context) => {
            if (!width) {
                width = image.width;
            }
            if (!hegiht) {
                hegiht = image.height;
            }
            context.drawImage(image, x, y, width, hegiht);
        };
    },
    setWidthHeight: (width, hegiht) => {
        return (canvas, context) => {
            canvas.width = width;
            canvas.height = hegiht;
        };
    },
    toImage: (type = 'image/jpeg', quality = 0.6) => {
        return (canvas, context) => {
            const dataUrl = canvas.toDataURL(type, quality);
            const image = new Image();
            image.src = dataUrl;
            return image;
        };
    },
    toFile: (fileName, type = 'image/jpeg', quality = 0.6) => {
        return (canvas, context) => {
            const dataUrl = canvas.toDataURL(type, quality);
            const blobResult = dataUrlToBlob(dataUrl);
            if (blobResult === null || blobResult.blob === null || blobResult.mime === null) {
                return null;
            }
            return blobResult.toFile(fileName);
        };
    },
    toDataURL: (type = 'image/jpeg', quality = 0.6) => {
        return (canvas, context) => {
            return canvas.toDataURL(type, quality);
        };
    },
    toBlobResult: (type = 'image/jpeg', quality = 0.6) => {
        return (canvas, context) => {
            return dataUrlToBlob(canvas.toDataURL(type, quality));
        };
    }
};
export class ImageHandleContext {
    constructor(canvas, context2d) {
        this.canvas = canvas;
        this.context2d = context2d;
    }
    handleImage(...imageHandles) {
        const result = [];
        imageHandles.forEach(imageHandle => {
            const r = imageHandle(this.canvas, this.context2d);
            if (r) {
                result.push(r);
            }
        });
    }
}
//# sourceMappingURL=index.js.map