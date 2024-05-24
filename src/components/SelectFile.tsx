import { useRef, ChangeEvent, DragEvent, FC } from "react";
import { handleFileChange } from "./FileHandlers";

interface SelectFileProps {
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  setExcelFileUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectFile: FC<SelectFileProps> = ({ setFiles, setExcelFileUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div
      className="border-4 border-blue-500 border-dashed bg-slate-300 flex flex-grow items-center justify-center h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center">
        <h1 className="mb-3">Drag and Drop Files</h1>
        <h1 className="mb-3 uppercase">Or</h1>
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-2"
        >
          Select Files
        </button>
      </div>
    </div>
  );
};

export default SelectFile;
