import { FC } from "react";

interface Props {
  files: FileList;
  excelFileUrl: string | null;
  setConvert: React.Dispatch<React.SetStateAction<boolean | false>>;
  setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleOriginalExcel: (
    files: FileList,
    setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  handleSummaryExcel: (
    files: FileList,
    setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
}
const ConvertToExcel: FC<Props> = ({
  files,
  excelFileUrl,
  setExcelFileUrl,
  setConvert,
  handleOriginalExcel,
  handleSummaryExcel,
}) => {
  const handleDonwnloadOrigianl = async () => {
    handleOriginalExcel(files, setExcelFileUrl);
  };

  const handleDownloadSummary = async () => {
    handleSummaryExcel(files, setExcelFileUrl);
  };
  return (
    <>
      {!excelFileUrl ? (
        <>
          <div className="w-full flex gap-3">
            <button
              className="w-full h-20 bg-blue-500 text-white rounded-lg"
              onClick={handleDonwnloadOrigianl}
            >
              Download Original
            </button>
            <button
              className="w-full h-20 bg-blue-500 text-white rounded-lg"
              onClick={handleDownloadSummary}
            >
              Download Summary
            </button>
          </div>
          <div className="w-full">
            <button
              className="w-[100%] border py-3 border-blue-400 text-blue-400 rounded-lg"
              onClick={() => setConvert(false)}
            >
              Back
            </button>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col justify-center gap-3">
          <a
            href={excelFileUrl}
            download="files.xlsx"
            className="w-full h-20 flex items-center justify-center h-20 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Download Excel
          </a>
          <button
            className="w-[100%] border py-3 border-blue-400 text-blue-400 rounded-lg"
            onClick={() => setExcelFileUrl(null)}
          >
            Back
          </button>
        </div>
      )}
    </>
  );
};

export default ConvertToExcel;
