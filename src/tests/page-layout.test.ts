import { describe, expect, it } from 'vitest';
import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  getPaperMarginMm,
} from '../lib/page-layout';

describe('A4 page layout', () => {
  it('uses stable physical A4 dimensions', () => {
    expect(A4_WIDTH_MM).toBe(210);
    expect(A4_HEIGHT_MM).toBe(297);
    expect(A4_WIDTH_PX).toBeCloseTo(793.7, 1);
  });

  it('keeps preview and export margins deterministic', () => {
    expect(getPaperMarginMm('compact')).toBe(12);
    expect(getPaperMarginMm('standard')).toBe(18);
    expect(getPaperMarginMm('relaxed')).toBe(25);
  });
});
