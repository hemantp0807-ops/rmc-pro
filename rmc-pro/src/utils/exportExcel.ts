import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export function exportToExcel(
  data: any[],
  fileName: string
) {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  const range = XLSX.utils.decode_range(
    worksheet["!ref"] || "A1"
  );

  // Find Status column
  const headers: string[] = [];

  for (
    let col = range.s.c;
    col <= range.e.c;
    col++
  ) {
    const cellAddress = XLSX.utils.encode_cell({
      r: 0,
      c: col,
    });

    headers.push(
      String(
        worksheet[cellAddress]?.v ?? ""
      )
    );
  }

  const statusColumnIndex =
    headers.findIndex(
      (header) =>
        header.toLowerCase() === "status"
    );

  // Style cancelled rows
  if (statusColumnIndex !== -1) {
    for (
      let row = 1;
      row <= range.e.r;
      row++
    ) {
      const statusCellAddress =
        XLSX.utils.encode_cell({
          r: row,
          c: statusColumnIndex,
        });

      const status = String(
        worksheet[statusCellAddress]?.v ?? ""
      ).trim().toLowerCase();

      if (status === "cancelled") {
        for (
          let col = range.s.c;
          col <= range.e.c;
          col++
        ) {
          const cellAddress =
            XLSX.utils.encode_cell({
              r: row,
              c: col,
            });

          // Make sure cell exists
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = {
              t: "s",
              v: "",
            };
          }

          worksheet[cellAddress].s = {
            fill: {
              patternType: "solid",
              fgColor: {
                rgb: "FFC7CE",
              },
            },
            font: {
              color: {
                rgb: "9C0006",
              },
              bold: true,
            },
          };
        }
      }
    }
  }

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    file,
    `${fileName}.xlsx`
  );
}