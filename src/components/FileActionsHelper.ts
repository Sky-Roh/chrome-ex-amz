import { readFileContent } from "./FileHandlers";
import { generateSummary } from "./SummaryGenerator";

export const getCurrency = async (files: FileList): Promise<string[]> => {
  try {
    const filesContents = await Promise.all(
      Array.from(files).map(readFileContent)
    );

    if (filesContents.length > 0) {
      const currencies = filesContents.map((file) => file.data[0][5]);
      console.log("Currencies found:", currencies);
      return currencies;
    } else {
      console.log("No files found");
      return [];
    }
  } catch (error) {
    console.error("Error processing files:", error);
    return [];
  }
};

export const handleJson = async (files: FileList): Promise<any[]> => {
  try {
    const filesContents = await Promise.all(
      Array.from(files).map(readFileContent)
    );

    if (filesContents) {
      console.log(filesContents, "cont");
      const summaryDataArray = filesContents.map((file) => {
        return generateSummary(file.headers, file.data);
      });

      // Format it to JSON
      const summaryHeaders = [
        "sku",
        "orderID",
        "orderItemID",
        "dateSold",
        "depositDate",
        "salePrice",
        "fees",
        "quantityPurchased",
      ];

      const summaryFileContents = summaryDataArray.map((summaryData) =>
        summaryData.map((row: any) => {
          const rowObject: { [key: string]: any } = {};
          summaryHeaders.forEach((header, i) => {
            rowObject[header] = row[i];
          });
          return rowObject;
        })
      );

      return summaryFileContents.flat(); // Flatten the array if there are multiple files
    }
  } catch (error) {
    console.error("Error processing files:", error);
    throw error;
  }

  return []; // Return an empty array if no files were processed
};

export const processFiles = async (files: FileList | null) => {
  if (files) {
    try {
      const summaryFileContents = await handleJson(files);
      console.log("--JSON--", summaryFileContents)

      // // Get the currency
      // const currencyList = await getCurrency(files);
      // console.log("Currencies:", currencyList);

      return summaryFileContents;
    } catch (error) {
      console.error("Error processing files:", error);
    }
  }
  return [];
};