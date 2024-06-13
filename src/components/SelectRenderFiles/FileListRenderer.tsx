import React, { FC, useRef } from "react";

interface FileListRendererProps {
  files: FileList;
  setFiles: (files: FileList | null) => void;
}

const FileListRenderer: FC<FileListRendererProps> = ({ files, setFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (index: number) => {
    const newFileList = Array.from(files).filter((_, idx) => idx !== index);
    const dataTransfer = new DataTransfer();
    newFileList.forEach((file) => dataTransfer.items.add(file));
    setFiles(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const currentFiles = files ? Array.from(files) : [];
      const allFiles = currentFiles.concat(newFiles);

      const dataTransfer = new DataTransfer();
      allFiles.forEach((file) => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    }
  };

  const handleAddButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <ul>
        {Array.from(files).map((file, idx) => (
          <li
            key={idx}
            className="text-[1rem] mt-4 pl-6 flex justify-between items-center"
          >
            {file.name}
            <button
              className="ml-4 text-red-600"
              onClick={() => handleDelete(idx)}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 p-2 border text-black rounded-lg"
        onClick={handleAddButtonClick}
      >
        Add More Files
      </button>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="text/plain"
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileListRenderer;
