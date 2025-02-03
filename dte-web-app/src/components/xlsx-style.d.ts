declare module 'xlsx-style' {
    export * from 'xlsx';
    
    export interface WorkSheet {
        '!cols'?: Array<{
            wch?: number;
            wpx?: number;
        }>;
        '!rows'?: Array<{
            hpt?: number;
            hpx?: number;
        }>;
        '!merges'?: Array<{
            s: { r: number; c: number };
            e: { r: number; c: number };
        }>;
    }

    export interface CellStyle {
        font?: {
            bold?: boolean;
            sz?: number;
            name?: string;
            color?: { rgb: string };
        };
        alignment?: {
            horizontal?: 'left' | 'center' | 'right';
            vertical?: 'top' | 'center' | 'bottom';
            wrapText?: boolean;
        };
        border?: {
            top?: { style: string; color?: { rgb: string } };
            right?: { style: string; color?: { rgb: string } };
            bottom?: { style: string; color?: { rgb: string } };
            left?: { style: string; color?: { rgb: string } };
        };
        fill?: {
            fgColor?: { rgb: string };
        };
    }

    export interface Cell {
        v: any;
        t: string;
        s?: CellStyle;
    }
}