import { Dispatch, SetStateAction } from "react";

// set new file but not yet excelfile URL
export const handleFileChange = (
  newFiles: FileList | null,
  setFiles: Dispatch<SetStateAction<FileList | null>>,
  setExcelFileUrl: Dispatch<SetStateAction<string | null>>
) => {
  setFiles(newFiles);
  setExcelFileUrl(null);
};

export const readFileContent = (file: File) => {
  return new Promise<{ name: string; headers: string[]; data: string[][] }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          const lines = content.split("\n");
          const headers = lines[0].split("\t");
          const data = lines.slice(1).map((line) => line.split("\t"));


          const transactionTypeIndex = headers.indexOf("transaction-type");
          const settlementStartDateIndex = headers.indexOf("settlement-start-date");
          const settlementEndDateIndex = headers.indexOf("settlement-end-date");
          const depositDateIndex = headers.indexOf("deposit-date");
          const totalAmountIndex = headers.indexOf("total-amount");
          const currencyIndex = headers.indexOf("currency");

          const commonData = {
            "settlement-start-date": data[0][settlementStartDateIndex],
            "settlement-end-date": data[0][settlementEndDateIndex],
            "deposit-date": data[0][depositDateIndex],
            "total-amount": data[0][totalAmountIndex],
            currency: data[0][currencyIndex],
          };

          const updatedData = data.map((row) => {
            if (row[transactionTypeIndex] === "Order") {
              row[settlementStartDateIndex] = commonData["settlement-start-date"];
              row[settlementEndDateIndex] = commonData["settlement-end-date"];
              row[depositDateIndex] = commonData["deposit-date"];
              row[totalAmountIndex] = commonData["total-amount"];
              row[currencyIndex] = commonData["currency"];
            }
            return row;
          });

          resolve({ name: file.name, headers, data: updatedData });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (e) => {
        reject(new Error("Error reading file: " + e.target?.error?.message));
      };
      reader.readAsText(file);
    }
  );
};
