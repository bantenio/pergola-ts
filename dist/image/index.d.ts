export declare class FileToImageResult {
    image: HTMLImageElement;
    url: string;
    constructor(image: HTMLImageElement, url: string);
}
export declare class DataUrlToBlobResult {
    mime: string | null;
    blob: Uint8Array | null;
    constructor(mime: string | null, blob: Uint8Array | null);
    toFile(fileName: string): File;
}
export declare function fileToImage(file: File): Promise<FileToImageResult>;
export declare function dataUrlToBlob(dataUrl: string): DataUrlToBlobResult | null;
export declare function createImageHandleContext(): ImageHandleContext;
export interface ImageHandle {
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): any;
}
export declare const ImageHandles: {
    clear: (width?: number, hegiht?: number, x?: number, y?: number) => ImageHandle;
    drawImage: (image: HTMLImageElement, x?: number, y?: number, width?: number, hegiht?: number) => ImageHandle;
    setWidthHeight: (width: number, hegiht: number) => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
    toImage: (type?: string, quality?: number) => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => HTMLImageElement;
    toFile: (fileName: string, type?: string, quality?: number) => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => File;
    toDataURL: (type?: string, quality?: number) => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => string;
    toBlobResult: (type?: string, quality?: number) => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => DataUrlToBlobResult;
};
export declare class ImageHandleContext {
    private readonly canvas;
    private readonly context2d;
    constructor(canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D);
    handleImage(...imageHandles: ImageHandle[]): void;
}
