import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export async function exportBatchReportPdf(
  reportElement: HTMLElement,
  orderNo: string | number
) {
  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  // Convert captured CSS pixels to millimeters
  const rect = reportElement.getBoundingClientRect();

const pxToMm = 25.4 / 96;

const pdfWidth = rect.width * pxToMm;
const pdfHeight = rect.height * pxToMm;

  // PDF page has exactly the same proportion as the preview
  const pdf = new jsPDF({
    orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  // Put the report on the page from edge to edge.
  // No margin, no A4 scaling, no resizing.
  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save(`Batch_Report_${orderNo}.pdf`);
}
export function exportDispatchReportPdf(
  batches: any[]
) {

  const doc = new jsPDF("landscape");

  doc.setFontSize(12);

  doc.text(
    "DISPATCH REPORT",
    148,
    10,
    {
      align: "center",
    }
  );


  autoTable(doc, {

    startY: 20,

    head: [
      [
        "Batch",
        "Customer",
        "Vehicle",
        "Driver",
        "Dispatch Time",
        "Quantity",
        "Status",
      ],
    ],


    body: batches.map((batch)=>[
      batch.batch_no,
      batch.customer,
      batch.vehicle_no,
      batch.driver_name,
      batch.dispatch_time || "-",
      batch.quantity,
      batch.status,
    ]),


    theme:"grid",

    styles:{
      fontSize:8,
    }

  });


  doc.save(
    "Dispatch_Report.pdf"
  );

}
export function exportToPdf(
  headers: string[],
  rows: any[][],
  title: string
) {
  const doc = new jsPDF("landscape");

  doc.setFontSize(12);

  doc.text(
    title,
    148,
    10,
    {
      align: "center",
    }
  );

  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 8,
    },
  });

  doc.save(`${title}.pdf`);
}