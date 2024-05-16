import { FC } from "react";

interface FileListRendererProps {
  files: FileList;
}

const FileListRenderer: FC<FileListRendererProps> = ({ files }) => (
  <ul>
    {Array.from(files).map((file, idx) => (
      <li key={idx} className="text-[1rem] mt-4">
        {file.name}
      </li>
    ))}
  </ul>
);

export default FileListRenderer;
