
declare module 'qrcode' {
  export interface QRCodeRenderersOptions {
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<HTMLCanvasElement>;

  export function toDataURL(
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<string>;
}
