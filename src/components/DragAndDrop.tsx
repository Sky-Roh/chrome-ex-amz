import { useState, useRef, ChangeEvent, DragEvent, FC, useEffect } from "react";
import { handleFileChange, readFileContent } from "./FileHandlers";
import { handleUpload, handleNewExcel } from "./ExcelExporter";
import FileListRenderer from "./FileListRenderer";
import { generateSummary } from "./SummaryGenerator";
import axios from "axios";

type CABookData = [
  string, // Title
  string, // Date
  string, // ISBN
  string, // URL
  string, // Price 1
  string, // Price 2
  string, // Price 3
  string, // Percentage
  string, // Country
  string, // Empty field
  string, // Quantity
  string, // Empty field
  string, // Empty field
  string, // Empty field
  string // Another Date
];

type USBookData = [
  string, // Title
  string, // Date
  string, // ISBN
  string, // URL
  string, // Price 1
  string, // Price 2
  string, // Price 3
  string, // Percentage
  string, // Country
  string, // Empty field
  string, // Quantity
  string, // Empty field
  string, // Empty field
  string, // Empty field
  string // Another Date
];
const DragAndDrop: FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);
  const [caData, setCaData] = useState<Array<CABookData> | null>(null);
  const [usData, setUsData] = useState<Array<USBookData> | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/ca-data")
      .then((res) => {
        console.table(res.data);
        setCaData(res.data);
        return axios.get("http://localhost:8000/us-data");
      })
      .then((res) => {
        console.table(res.data);
        setUsData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const onFileChange = (newFiles: FileList | null) => {
    handleFileChange(newFiles, setFiles, setExcelFileUrl);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onFileChange(event.dataTransfer.files);
  };

  const handleJson = async (
    files: FileList
  ): Promise<any[]> => {
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
        ];
  
        const summaryFileContents: any = [];
  
        filesContents.forEach((file, index) => {
          summaryFileContents.push({
            name: file.name,
            headers: summaryHeaders,
            data: summaryDataArray[index],
          });
        });
  
        return summaryFileContents;
      }
    } catch (error) {
      console.error("Error processing files:", error);
      throw error; // Re-throw the error so the caller knows an error occurred
    }
  
    return []; // Return an empty array if no files were processed
  };

  return (
    <div className="h-40">
      {files ? (
        <div className="flex flex-col h-full justify-between ">
          <FileListRenderer files={files} />
          <div className="flex flex-col gap-3 items-center mt-5 ">
            {!excelFileUrl && (
              <div className="w-full flex gap-3 items-center mt-auto">
                <button
                  className="w-[50%] py-3 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleUpload(files, setExcelFileUrl)}
                >
                  Upload Original
                </button>
                <button
                  className="w-[50%] py-3 bg-blue-500 text-white rounded-lg"
                  onClick={() => handleNewExcel(files, setExcelFileUrl)}
                >
                  Upload with Summary
                </button>
              </div>
            )}
            {excelFileUrl && (
              <>
                <div className="w-full flex justify-center">
                  <a
                    href={excelFileUrl}
                    download="files.xlsx"
                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Download Excel
                  </a>
                </div>
                <div className="w-full flex justify-center">
                  <a
                    href={excelFileUrl}
                    download="files.xlsx"
                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Export to Google Sheet
                  </a>
                </div>
              </>
            )}
            <button
              className="w-full border py-3 border-blue-400 text-blue-400 rounded-lg"
              onClick={() => onFileChange(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border border-black bg-slate-300 flex items-center justify-center h-40"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <h1>Drag and Drop Files</h1>
            <h1>Or</h1>
            <input
              type="file"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFileChange(e.target.files)
              }
              hidden
              accept="text/plain"
              ref={inputRef}
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Select Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
