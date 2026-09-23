import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface DirectPDFExportOptions {
  filename?: string;
  onProgress?: (status: string) => void;
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
  
  // Create an offscreen wrapper placed far off-screen with opacity: 1 and visibility: visible
  const exportWrapper = document.createElement('div');
  exportWrapper.id = 'resume-temp-pdf-export-wrapper';
  exportWrapper.className = 'light';
  exportWrapper.style.position = 'fixed';
  exportWrapper.style.left = '-9999px';
  exportWrapper.style.top = '0px';
  exportWrapper.style.width = '794px'; // 210mm in standard 96dpi pixels (210/25.4 * 96 ≈ 793.7px)
  exportWrapper.style.minHeight = '1123px';
  exportWrapper.style.zIndex = '-9999';
  exportWrapper.style.opacity = '1';
  exportWrapper.style.visibility = 'visible';
  exportWrapper.style.pointerEvents = 'none';
  exportWrapper.style.overflow = 'visible';
  exportWrapper.style.backgroundColor = '#ffffff';
  exportWrapper.style.color = '#0f172a';

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

  // Enforce pristine A4 printable styling on the clone
  clone.style.position = 'relative';
  clone.style.left = 'auto';
  clone.style.top = 'auto';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px'; // 297mm in standard 96dpi pixels (297/25.4 * 96 ≈ 1122.5px)
  clone.style.transform = 'none';
  clone.style.margin = '0';
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
    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(clone, {
      scale: 2.2, // 2.2x scale provides razor-sharp text while keeping file size optimal
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: Math.max(1200, clone.scrollHeight || 1123),
    });

    onProgress?.('正在进行 A4 精准分页排版...');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Calculate canvas page slice height in canvas pixels (A4 aspect ratio: 297 / 210)
    const pageCanvasHeight = Math.floor(canvas.width * (pageHeight / pageWidth));
    const totalPages = Math.max(1, Math.ceil(canvas.height / pageCanvasHeight));

    for (let i = 0; i < totalPages; i++) {
      onProgress?.(`正在生成第 ${i + 1} / ${totalPages} 页 PDF...`);
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

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.96);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }
    }

    onProgress?.('正在触发文件保存与下载...');
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

