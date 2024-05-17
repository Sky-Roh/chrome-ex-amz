import { useState, FC } from "react";
import { handleOriginalExcel, handleSummaryExcel } from "./ExcelExporter";
import FileListRenderer from "./FileListRenderer";
import SelectFile from "./SelectFile";
import FileActions from "./FileActions";

const DragAndDrop: FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [excelFileUrl, setExcelFileUrl] = useState<string | null>(null);

  return (
    <div className="h-full w-full">
      {!files ? (
        <SelectFile setFiles={setFiles} setExcelFileUrl={setExcelFileUrl} />
      ) : (
        <div className="flex flex-col h-full justify-between">
          <FileListRenderer files={files} />
          <FileActions
            files={files}
            excelFileUrl={excelFileUrl}
            setExcelFileUrl={setExcelFileUrl}
            handleOriginalExcel={handleOriginalExcel}
            handleSummaryExcel={handleSummaryExcel}
            setFiles={setFiles}
          />
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
