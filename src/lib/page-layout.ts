import { PaperMargin } from '../types';

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const CSS_PX_PER_MM = 96 / 25.4;
export const A4_WIDTH_PX = A4_WIDTH_MM * CSS_PX_PER_MM;
export const A4_HEIGHT_PX = A4_HEIGHT_MM * CSS_PX_PER_MM;

const PAPER_MARGIN_MM: Record<PaperMargin, number> = {
  compact: 12,
  standard: 18,
  relaxed: 25,
};

export function getPaperMarginMm(margin: PaperMargin): number {
  return PAPER_MARGIN_MM[margin];
}
