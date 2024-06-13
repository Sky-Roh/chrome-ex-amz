import * as XLSX from "xlsx";
import { readFileContent } from "../FileHandlers";
import { generateSummary } from "../SummaryGenerator";

// Handle reading multiple files and combining their content
export const handleOriginalExcel = async (
  files: FileList,
  setExcelFileUrl: (url: string) => void
) => {
  try {
    const filesContents = await Promise.all(
      Array.from(files).map(readFileContent)
    );

    if (filesContents.length > 0) {
      console.log("FILE CONTENT", filesContents);

      const combinedHeaders = filesContents[0].headers;
      const combinedData: string[][] = [];

      filesContents.forEach((fileContent) => {
        combinedData.push(...fileContent.data);
      });

      console.log("Combined Headers:", combinedHeaders);
      console.log("Combined Data:", combinedData);

      const combinedContent = [
        {
          name: "original file",
          headers: combinedHeaders,
          data: combinedData,
        },
      ];

      exportToExcel(combinedContent, setExcelFileUrl);
    } else {
      console.error("No file contents were read.");
    }
  } catch (error) {
    console.error("Error processing files:", error);
  }
};

// Handle generating summary data and exporting it to Excel
export const handleSummaryExcel = async (
  files: FileList,
  setExcelFileUrl: (url: string) => void
) => {
  try {
    const filesContents = await Promise.all(
      Array.from(files).map(readFileContent)
    );

    if (filesContents.length > 0) {
      const combinedHeaders = filesContents[0].headers;
      const combinedData: string[][] = [];

      filesContents.forEach((fileContent) => {
        combinedData.push(...fileContent.data);
      });

      const combinedContent = [
        {
          name: "summary file",
          headers: combinedHeaders,
          data: combinedData,
        },
      ];

      // ======================= summary ======================
      const summaryDataArray = combinedContent.map((file) => {
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
        "Quantity Purchased",
      ];

      const summaryFileContents = combinedContent.map((file, index) => ({
        name: file.name,
        headers: summaryHeaders,
        data: summaryDataArray[index],
      }));

      exportToExcel(summaryFileContents, setExcelFileUrl);
      return summaryFileContents;
    } else {
      console.error("No file contents were read.");
    }
  } catch (error) {
    console.error("Error processing files:", error);
  }
};

// Export data to Excel
const exportToExcel = (
  filesContents: { name: string; headers: string[]; data: string[][] }[],
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
