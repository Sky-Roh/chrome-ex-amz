import { useState, FC } from "react";
import {
  handleOriginalExcel,
  handleSummaryExcel,
} from "../ConvertToExcel/ExcelExporter";
import FileListRenderer from "../SelectRenderFiles/FileListRenderer";
import SelectFile from "../SelectRenderFiles/SelectFile";
import FileActions from "../FileActions/FileActions";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import homeIcon from "../../assets/house-door.svg";

const DragAndDrop: FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);
  const [convert, setConvert] = useState<boolean>(false);
  const [exportSheet, setExportSheet] = useState<boolean>(false);

  const homeButton = () => {
    if (files) {
      setFiles(null);
      setConvert(false);
      setExcelFileUrl(null);
      setExportSheet(false);
    }
  };

  const backButton = () => {
    if (excelFileUrl) {
      setExcelFileUrl(null);
    } else if (convert) {
      setConvert(false);
    } else if (exportSheet) {
      setExportSheet(false);
    } else if (files) {
      setFiles(null);
    }
  };
  return (
    <div className="flex flex-col h-full w-full flex-grow">
      <div className="flex justify-start mb-1">
        <button
          onClick={backButton}
          className="text-white px-2 py-1 my-1 rounded"
        >
          <img src={arrowLeftIcon} alt="back" className="h-4 w-4" />
        </button>
        <button
          onClick={homeButton}
          className="text-white px-2 py-1 my-1 rounded"
        >
          <img src={homeIcon} alt="home" className="h-4 w-4" />
        </button>
      </div>
      {!files ? (
        <SelectFile setFiles={setFiles} setExcelFileUrl={setExcelFileUrl} />
      ) : (
        <div className="flex flex-col flex-grow h-full justify-between">
          <FileListRenderer files={files} setFiles={setFiles} />
          <FileActions
            files={files}
            excelFileUrl={excelFileUrl}
            setExcelFileUrl={setExcelFileUrl}
            handleOriginalExcel={handleOriginalExcel}
            handleSummaryExcel={handleSummaryExcel}
            setFiles={setFiles}
            convert={convert}
            setConvert={setConvert}
            exportSheet={exportSheet}
            setExportSheet={setExportSheet}
          />
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
