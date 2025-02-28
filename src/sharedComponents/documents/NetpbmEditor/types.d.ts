export interface RasterParserInput {
    format: 'P1' | 'P2' | 'P3';
    width: number;
    height: number;
    maxValue?: number;
    raster: string;
}

export type ParserMessage = string | React.ReactElement;

export interface ParserImageDataResult {
    pixels: Uint8ClampedArray;
    width: number;
    height: number;
}

export interface ParserResult {
    imageData?: ParserImageDataResult;
    errors?: ParserMessage[];
    warnings?: ParserMessage[];
}
