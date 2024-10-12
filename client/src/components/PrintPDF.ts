import { useCallback } from 'react';
import jsPDF from 'jspdf';

interface PrintPDFOptions<T extends Record<string, string>> {
  data: T;
  fileName: string;
  title: string;
  subtitle?: string;
  footer?: string[];
}

function usePrintPDF<T extends Record<string, string>>() {
  const generatePDF = useCallback(
    ({ data, fileName, title, subtitle, footer }: PrintPDFOptions<T>) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      let yPos = 20;

      // Helper function to add text
      const addText = (
        text: string,
        fontSize: number = 12,
        isBold: boolean = false,
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.text(text, pageWidth / 2, yPos, { align: 'center' });
        yPos += fontSize / 2 + 2;
      };

      // Add header
      addText(title, 18, true);
      if (subtitle) {
        addText(subtitle, 14);
      }
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Add details
      const addDetail = (label: string, value: string) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${label}:`, 20, yPos);
        doc.text(value, 80, yPos);
        yPos += 8;
      };

      Object.entries(data).forEach(([key, value]) => {
        addDetail(key, value);
      });

      // Add footer
      yPos += 10;
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;
      if (footer) {
        footer.forEach((line) => {
          addText(line, 10);
        });
      }

      doc.save(`${fileName}.pdf`);
    },
    [],
  );

  return generatePDF;
}

export { usePrintPDF };
