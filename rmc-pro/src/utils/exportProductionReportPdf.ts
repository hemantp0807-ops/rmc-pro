import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ProductionReportRow = {
  srNo: number;
  partyName: string;
  grade: string;
  totalQty: number;
  remark: string;
};

export function exportProductionReportPdf(
  rows: ProductionReportRow[],
  fromDate?: string,
  toDate?: string
) {
  const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

  const pageWidth = 210;

const tableWidth = 180;

const sideMargin =
  (pageWidth - tableWidth) / 2;

  /* ================================================= */
  /* TITLE                                             */
  /* ================================================= */

  doc.setFontSize(18);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Production Report",
    pageWidth / 2,
    18,
    {
      align: "center",
    }
  );


  /* ================================================= */
  /* REPORT DATE / PERIOD                              */
  /* ================================================= */

  function formatReportDate(
    date: string
  ) {
    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  let reportPeriod = "All Dates";

  if (fromDate && toDate) {

    if (fromDate === toDate) {

      reportPeriod =
        `Report Date: ${formatReportDate(fromDate)}`;

    } else {

      reportPeriod =
        `Report Period: ${formatReportDate(fromDate)} to ${formatReportDate(toDate)}`;

    }

  } else if (fromDate) {

    reportPeriod =
      `Report From: ${formatReportDate(fromDate)}`;

  } else if (toDate) {

    reportPeriod =
      `Report Till: ${formatReportDate(toDate)}`;

  }


  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    reportPeriod,
    pageWidth / 2,
    25,
    {
      align: "center",
    }
  );


  /* ================================================= */
  /* TABLE                                             */
  /* ================================================= */

  autoTable(doc, {

    startY: 32,

    margin: {
      left: sideMargin,
      right: sideMargin,
    },

    tableWidth: tableWidth,

    head: [
      [
        "Sr No.",
        "Party Name",
        "Grade Of Concrete",
        "Total Qty",
        "Remark",
      ],
    ],

    body: rows.map((row) => [
      row.srNo,
      row.partyName,
      row.grade,
      `${row.totalQty} m³`,
      "",
    ]),

    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      halign: "center",
      lineWidth: 0.2,
    },

    headStyles: {
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      cellPadding: 2,
    },

   columnStyles: {
  0: {
    halign: "center",
    cellWidth: 18,
  },

  1: {
    halign: "center",
    cellWidth: 50,
  },

  2: {
    halign: "center",
    cellWidth: 45,
  },

  3: {
    halign: "center",
    cellWidth: 30,
  },

  4: {
    halign: "center",
    cellWidth: 37,
  },
},

  });


  /* ================================================= */
  /* SAVE                                              */
  /* ================================================= */

  doc.save(
    "Production_Report.pdf"
  );
}