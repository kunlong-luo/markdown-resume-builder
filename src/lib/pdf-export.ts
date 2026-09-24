import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface DirectPDFExportOptions {
  filename?: string;
  onProgress?: (status: string) => void;
}

/**
 * Intelligent helper to find a white pixel gap between text lines/sections
 * near the page boundary to prevent slicing text in half across PDF pages.
 */
function findSmartSplitY(
  mainCtx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  startY: number,
  idealPageCanvasHeight: number
): number {
  const idealY = startY + idealPageCanvasHeight;
  if (idealY >= canvasHeight) {
    return canvasHeight;
  }

  // Look back up to 180px in canvas coordinates for a blank horizontal gap
  const minSearchY = Math.max(startY + Math.floor(idealPageCanvasHeight * 0.65), idealY - 180);
  
  // Inspect content area columns (from 4% width to 96% width)
  const startX = Math.floor(canvasWidth * 0.04);
  const endX = Math.floor(canvasWidth * 0.96);
  const sampleStep = Math.max(1, Math.floor((endX - startX) / 80));

  let bestGapCenterY = idealY;
  let inGap = false;
  let gapBottomY = idealY;
  let gapTopY = idealY;
  let maxGapSize = 0;

  for (let y = idealY; y >= minSearchY; y--) {
    let isRowWhite = true;
    try {
      const imgData = mainCtx.getImageData(startX, y, endX - startX, 1);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // If pixel is significantly non-white/dark (text pixel)
        if (a > 15 && (r < 240 || g < 240 || b < 240)) {
          isRowWhite = false;
          break;
        }
      }
    } catch {
      break;
    }

    if (isRowWhite) {
      if (!inGap) {
        inGap = true;
        gapBottomY = y;
      }
      gapTopY = y;
    } else {
      if (inGap) {
        const gapSize = gapBottomY - gapTopY;
        if (gapSize > maxGapSize) {
          maxGapSize = gapSize;
          bestGapCenterY = Math.floor((gapBottomY + gapTopY) / 2);
        }
        inGap = false;
      }
    }
  }

  if (inGap) {
    const gapSize = gapBottomY - gapTopY;
    if (gapSize > maxGapSize) {
      bestGapCenterY = Math.floor((gapBottomY + gapTopY) / 2);
    }
  }

  // If a valid white gap was found with at least 4px height, split there!
  if (maxGapSize >= 4) {
    return bestGapCenterY;
  }

  // Fallback if no white gap found: split at idealY
  return idealY;
}

/**
 * Direct PDF generation and download utility using html2canvas + jsPDF.
 * Bypasses browser print dialog and downloads a pristine A4 PDF file directly to the user's device.
 */
export async function exportDirectPDF(
  elementOrId: HTMLElement | string,
  options: DirectPDFExportOptions = {}
): Promise<boolean> {
  const { filename = 'resume.pdf', onProgress } = options;

  onProgress?.('准备简历渲染数据...');
  let targetElement = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId)
    : elementOrId;

  if (!targetElement) {
    targetElement = document.getElementById('resume-print-content') 
      || document.querySelector('.resume-content') as HTMLElement;
  }

  if (!targetElement) {
    throw new Error('未找到简历内容节点');
  }

  // Ensure fonts are ready before canvas capture
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading check skipped', e);
    }
  }

  onProgress?.('构建高保真渲染副本...');
  
  // Create an offscreen wrapper placed far off-screen
  const exportWrapper = document.createElement('div');
  exportWrapper.id = 'resume-temp-pdf-export-wrapper';
  exportWrapper.className = 'light';
  exportWrapper.style.position = 'fixed';
  exportWrapper.style.left = '-9999px';
  exportWrapper.style.top = '0px';
  exportWrapper.style.width = '794px'; // 210mm in standard 96dpi pixels
  exportWrapper.style.minHeight = '1123px';
  exportWrapper.style.zIndex = '-9999';
  exportWrapper.style.opacity = '1';
  exportWrapper.style.visibility = 'visible';
  exportWrapper.style.pointerEvents = 'none';
  exportWrapper.style.overflow = 'visible';
  exportWrapper.style.backgroundColor = '#ffffff';
  exportWrapper.style.color = '#0f172a';
  exportWrapper.style.boxSizing = 'border-box';

  const clone = targetElement.cloneNode(true) as HTMLElement;
  clone.id = 'resume-temp-pdf-export-clone';

  // Clean out UI elements that shouldn't appear in export (guides, overflow alerts, toolbars)
  const hiddenSelectors = [
    '.print\\:hidden', 
    '.print-hidden', 
    '[data-print-hidden]',
    '.scissors-guide'
  ];
  hiddenSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Enforce pristine A4 printable styling on the clone with box-sizing & padding
  clone.style.position = 'relative';
  clone.style.left = 'auto';
  clone.style.top = 'auto';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px'; // 297mm in 96dpi
  clone.style.transform = 'none';
  clone.style.margin = '0 auto';
  clone.style.boxSizing = 'border-box';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.opacity = '1';
  clone.style.visibility = 'visible';
  clone.style.display = 'block';

  exportWrapper.appendChild(clone);
  document.body.appendChild(exportWrapper);

  try {
    onProgress?.('正在生成超清渲染光栅...');
    
    // Short wait for layout and fonts to settle in DOM
    await new Promise(r => setTimeout(r, 120));

    const canvas = await html2canvas(clone, {
      scale: 2.2, // 2.2x scale provides razor-sharp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: Math.max(1200, clone.scrollHeight || 1123),
    });

    onProgress?.('正在进行 A4 智能防截断分页排版...');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Calculate canvas page slice height in canvas pixels (A4 aspect ratio: 297 / 210)
    const idealPageCanvasHeight = Math.floor(canvas.width * (pageHeight / pageWidth));
    const mainCtx = canvas.getContext('2d', { willReadFrequently: true });

    let currentY = 0;
    let pageCount = 0;

    while (currentY < canvas.height) {
      pageCount++;
      onProgress?.(`正在渲染第 ${pageCount} 页 PDF (智能避让文字)...`);

      let splitY = currentY + idealPageCanvasHeight;
      if (splitY < canvas.height && mainCtx) {
        splitY = findSmartSplitY(mainCtx, canvas.width, canvas.height, currentY, idealPageCanvasHeight);
      } else {
        splitY = Math.min(canvas.height, splitY);
      }

      const sliceHeight = splitY - currentY;
      if (sliceHeight <= 0) break;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = idealPageCanvasHeight; // maintain standard A4 canvas ratio
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw canvas slice onto pageCanvas
        ctx.drawImage(
          canvas,
          0, currentY, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );

        if (pageCount > 1) {
          pdf.addPage('a4', 'p');
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.96);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      currentY = splitY;
    }

    onProgress?.('正在保存 PDF 文件...');
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    
    // Trigger direct client download
    pdf.save(finalFilename);

    return true;
  } finally {
    if (document.body.contains(exportWrapper)) {
      document.body.removeChild(exportWrapper);
    }
  }
}
