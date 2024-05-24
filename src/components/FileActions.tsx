import { FC, useState } from "react";
import {
  processFiles as processFilesHelper,
  getCurrency,
} from "./FileActionsHelper";
import ConvertToExcel from "./ConvertToExcel";
import ExportToSheet from "./ExportToSheet";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CA_ENDPOINT = import.meta.env.VITE_CA_ENDPOINT;
const US_ENDPOINT = import.meta.env.VITE_US_ENDPOINT;

interface FileActionsProps {
  files: FileList;
  excelFileUrl: string | null;
  setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleOriginalExcel: (
    files: FileList,
    setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  handleSummaryExcel: (
    files: FileList,
    setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  convert: boolean | false;
  setConvert: React.Dispatch<React.SetStateAction<boolean | false>>;
  exportSheet: boolean | false;
  setExportSheet: React.Dispatch<React.SetStateAction<boolean | false>>;
}

const FileActions: FC<FileActionsProps> = ({
  files,
  excelFileUrl,
  setExcelFileUrl,
  handleOriginalExcel,
  handleSummaryExcel,
  setFiles,
  convert,
  setConvert,
  exportSheet,
  setExportSheet,
}) => {
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [endpoint, setEndpoint] = useState<string>("");

  const processFiles = async () => {
    if (files) {
      const data = await processFilesHelper(files);
      setJsonData(data);
      const currencies = await getCurrency(files);
      if (currencies.includes("CAD")) {
        setEndpoint(`${SERVER_URL}/${CA_ENDPOINT}`);
      } else {
        setEndpoint(`${SERVER_URL}/${US_ENDPOINT}`);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 items-center mt-5">
      {!convert && !exportSheet ? (
        <>
          <div className="w-full flex gap-3 items-center">
            <button
              className="w-[50%] h-20 bg-green-500 text-white rounded-lg hover:bg-amber-300"
              onClick={() => setConvert(true)}
            >
              Convert To Excel
            </button>
            <button
              className="w-[50%] h-20 bg-blue-500 text-white rounded-lg hover:bg-purple-400"
              onClick={async () => {
                await processFiles();
                setExportSheet(true);
              }}
            >
              Export to GoogleSheet
            </button>
          </div>
          <div className="w-full">
            <button
              className="w-[100%] border py-3 border-blue-400 text-blue-400 rounded-lg"
              onClick={() => setFiles(null)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : !exportSheet ? (
        <ConvertToExcel
          files={files}
          excelFileUrl={excelFileUrl}
          setExcelFileUrl={setExcelFileUrl}
          setConvert={setConvert}
          handleOriginalExcel={handleOriginalExcel}
          handleSummaryExcel={handleSummaryExcel}
        />
      ) : (
        <ExportToSheet endpoint={endpoint} jsonData={jsonData} />
      )}
    </div>
  );
};

export default FileActions;
