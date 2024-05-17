import * as XLSX from "xlsx";
import { readFileContent } from "./FileHandlers";
import { generateSummary } from "./SummaryGenerator";

export const handleOriginalExcel = async (
  files: FileList,
  setExcelFileUrl: (url: string) => void
) => {
  try {
    const filesContents = await Promise.all(
      Array.from(files).map(readFileContent)
    );

    if (filesContents) {
      console.log("FILE CONTENT", filesContents);
      console.log(filesContents[0].data[0][5], "Currency")
    }
    console.log("All files read, contents are:", filesContents);
    exportToExcel(filesContents, setExcelFileUrl);
  } catch (error) {
    console.error("Error processing files:", error);
  }
};

  export const handleSummaryExcel = async (
    files: FileList,
    setExcelFileUrl: (url: string) => void
  ) => {
    try {
      const filesContents = await Promise.all(
        Array.from(files).map(readFileContent)
      );

      if (filesContents) {
        console.log(filesContents, "cont");
        const summaryDataArray = filesContents.map((file) => {
          return generateSummary(file.headers, file.data);
        });

        const summaryHeaders = [
          "SKU",
          "Order ID",
          "Order Item ID",
          "Date Sold",
          "Deposit Date",
          "Sale Price",
          "Fees",
          "Quantity Purchased"
        ];

        const summaryFileContents: any = [];

        filesContents.forEach((file, index) => {
          summaryFileContents.push({
            name: file.name,
            headers: summaryHeaders,
            data: summaryDataArray[index],
          });
        });
        exportToExcel(summaryFileContents, setExcelFileUrl);
        return summaryFileContents;
      }
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

const exportToExcel = (
  filesContents: any[],
  setExcelFileUrl: (url: string) => void
) => {
  const workbook = XLSX.utils.book_new();

  filesContents.forEach((file) => {
    const worksheet = XLSX.utils.aoa_to_sheet([file.headers, ...file.data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, file.name);
  });

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  setExcelFileUrl(url);
};
