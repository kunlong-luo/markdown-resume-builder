import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface DirectPDFExportOptions {
  filename?: string;
  onProgress?: (status: string) => void;
}

/**
 * Direct PDF generation and download utility using html2canvas + jsPDF.
 * Bypasses browser print dialog and prints cleanly even inside iframes.
 */
export async function exportDirectPDF(
  elementOrId: HTMLElement | string,
  options: DirectPDFExportOptions = {}
): Promise<boolean> {
  const { filename = 'resume.pdf', onProgress } = options;

  onProgress?.('准备简历渲染节点...');
  const targetElement = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId)
    : elementOrId;

  if (!targetElement) {
    throw new Error('未找到简历打印渲染节点');
  }

  // Ensure custom web fonts are fully loaded before rendering to canvas
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading check skipped', e);
    }
  }

  onProgress?.('生成高保真渲染副本...');
  // Clone element to prevent interfering with active user preview & zoom state
  const clone = targetElement.cloneNode(true) as HTMLElement;

  // Clean out any elements that shouldn't appear in print/export
  const hiddenSelectors = ['.print\\:hidden', '.print-hidden', '[data-print-hidden]'];
  hiddenSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Standardize styling to pure A4 physical dimensions (794px width @ 96dpi)
  clone.style.position = 'fixed';
  clone.style.top = '-99999px';
  clone.style.left = '0px';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.zIndex = '-9999';
  clone.style.backgroundColor = '#ffffff';

  document.body.appendChild(clone);

  try {
    onProgress?.('生成超清矢量光栅...');
    // Capture with scale: 2.5 for crisp typography and lines
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200,
    });

    onProgress?.('精确计算 A4 分页...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;

    // A4 aspect ratio in pixels: height = width * (297 / 210)
    const pageCanvasHeight = Math.floor(canvas.width * (pageHeight / pageWidth));
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let i = 0; i < totalPages; i++) {
      onProgress?.(`排版第 ${i + 1} / ${totalPages} 页...`);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
      const ctx = pageCanvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        const sourceY = i * pageCanvasHeight;
        const sourceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        if (i > 0) {
          pdf.addPage('a4', 'p');
        }

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }
    }

    onProgress?.('正在下载 PDF 文件...');
    const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(finalFilename);
    return true;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
