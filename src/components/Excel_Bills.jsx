import { write, utils } from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, filename = "data.xlsx") => {
  // console.log(data);

  // Convert data to a worksheet
  const worksheet = utils.json_to_sheet(data);

  // Calculate the total value for the TOTAL column
  const totalValue = data.reduce(
    (acc, curr) => acc + (parseFloat(curr.TOTAL) || 0),
    0
  );

  // Define column widths
  const columnWidths = [
    { wpx: 70 }, // DATE
    { wpx: 80 }, // AWB
    { wpx: 50 }, // WGT
    { wpx: 90 }, // ITEM
    { wpx: 90 }, // Fr_COST_USD
    { wpx: 90 }, // Fr_COST_TK
    { wpx: 90 }, // CUSTOM
    { wpx: 90 }, // TOTAL
  ];

  worksheet["!cols"] = columnWidths;

  // Add the total row
  const totalRow = ["", "", "", "", "", "", "Total", totalValue.toFixed(2)];
  utils.sheet_add_aoa(worksheet, [totalRow], { origin: -1 });

  // Create a new workbook and append the worksheet
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a binary string
  const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob and trigger the download
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
};
