import { useState, useEffect, useMemo, useRef, RefObject } from 'react';
import { storage, STORAGE_KEYS } from '../lib/storage';

interface A4Metrics {
  isOver: boolean;
  overflowPercent: number;
  overflowPixels: number;
}

export function useA4Measurement(
  elementRef: RefObject<HTMLDivElement | null>,
  targetPageLimit: 1 | 2 | 3,
  onPageCountChange?: (count: number) => void,
  dependencies: any[] = []
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState<number>(850);
  const [unscaledHeight, setUnscaledHeight] = useState<number>(0);
  const [metrics, setMetrics] = useState<A4Metrics>({
    isOver: false,
    overflowPercent: 0,
    overflowPixels: 0,
  });

  const [zoomMode, setZoomMode] = useState<'fit' | number>(() => {
    const saved = storage.getString(STORAGE_KEYS.PREVIEW_ZOOM);
    if (saved) {
      if (saved === 'fit') return 'fit';
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) return parsed;
    }
    return 'fit';
  });

  // Track wrapper element width
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!element) return;
        const newWidth = element.clientWidth;
        setWrapperWidth((prev) => (Math.abs(prev - newWidth) > 1 ? newWidth : prev));
      });
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Compute calculated scale factor based on viewport width
  const calculatedZoom = useMemo(() => {
    if (zoomMode === 'fit') {
      const horizontalPadding = wrapperWidth < 640 ? 20 : 64;
      const targetWidth = Math.max(100, wrapperWidth - horizontalPadding);
      const scale = targetWidth / 794; // 210mm standard is ~794px at 96dpi
      return Math.max(0.2, Math.min(1.2, scale));
    }
    return zoomMode;
  }, [zoomMode, wrapperWidth]);

  // Track and measure A4 sheet height
  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    let rafId: number | null = null;
    const measure = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!element) return;
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (!width || !height) return;

        setUnscaledHeight(height);

        // Standard A4 aspect ratio height: 297mm / 210mm = 1.4142857
        const pHeight = (width / 210) * 297;
        
        // 24px tolerance for subpixel rounding
        const tolerance = 24;
        const actualPages = Math.max(1, Math.floor((height - tolerance) / pHeight) + 1);
        onPageCountChange?.(actualPages);

        const limitHeight = targetPageLimit * pHeight;
        const isOver = height > limitHeight + tolerance;
        const overflowPixels = Math.max(0, Math.round(height - limitHeight));
        const overflowPercent = Math.min(
          150,
          Math.max(10, Math.round((height / limitHeight) * 100))
        );

        setMetrics({ isOver, overflowPercent, overflowPixels });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const timer = setTimeout(measure, 300);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [elementRef, targetPageLimit, onPageCountChange, ...dependencies]);

  const handleZoomChange = (newMode: 'fit' | number) => {
    setZoomMode(newMode);
    storage.set(STORAGE_KEYS.PREVIEW_ZOOM, typeof newMode === 'number' ? String(newMode) : newMode);
  };

  return {
    wrapperRef,
    wrapperWidth,
    unscaledHeight,
    zoomMode,
    setZoomMode: handleZoomChange,
    calculatedZoom,
    metrics
  };
}
