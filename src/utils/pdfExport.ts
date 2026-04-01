import type { Comic } from '../types/comic';

export type PageSize = 'a4' | 'letter';

export async function exportToPdf(
  comic: Comic,
  pageSize: PageSize = 'a4'
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const isA4 = pageSize === 'a4';
  const pageW = isA4 ? 210 : 215.9;
  const pageH = isA4 ? 297 : 279.4;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isA4 ? 'a4' : 'letter',
  });

  // Find the comic preview container
  const comicEl = document.getElementById('comic-preview');
  if (!comicEl) {
    alert('Could not find comic preview to export!');
    return;
  }

  // Find all comic pages
  const pageEls = comicEl.querySelectorAll('.comic-page-export');

  for (let i = 0; i < pageEls.length; i++) {
    if (i > 0) pdf.addPage();

    const el = pageEls[i] as HTMLElement;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const margin = 10;
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;
    const ratio = Math.min(availW / canvas.width, availH / canvas.height);
    const imgW = canvas.width * ratio;
    const imgH = canvas.height * ratio;
    const x = (pageW - imgW) / 2;
    const y = (pageH - imgH) / 2;

    pdf.addImage(imgData, 'JPEG', x, y, imgW, imgH);
  }

  pdf.save(`${comic.title.replace(/[^a-zA-Z0-9 ]/g, '')}.pdf`);
}
