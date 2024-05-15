// import { useState, useRef, ChangeEvent, DragEvent, FC } from "react";

// const DragAndDrop: FC = () => {
//   const [files, setFiles] = useState<FileList | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = (newFiles: FileList | null) => {
//     setFiles(newFiles);
//   };

//   const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event: DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     handleFileChange(event.dataTransfer.files);
//   };

//   const readFileContent = (file: File) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           resolve({ name: file.name, content: e.target.result });
//         } else {
//           reject(new Error("Failed to read file"));
//         }
//       };
//       reader.onerror = (e) => {
//         reject(new Error("Error reading file: " + e.target?.error?.message));
//       };
//       reader.readAsText(file);
//     });
//   };

//   const handleUpload = async () => {
//     if (!files) return;

//     try {
//       const filesContents = await Promise.all(
//         Array.from(files).map(readFileContent)
//       );
//       console.log("All files read, contents are:", filesContents);
//       // Proceed with uploading filesContents or further processing
//     } catch (error) {
//       console.error("Error processing files:", error);
//     }
//   };

//   const renderFileList = () => (
//     <ul>
//       {Array.from(files || []).map((file, idx) => (
//         <li key={idx} className="text-[1rem] mt-4">
//           {file.name}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <div className="h-40">
//       {files ? (
//         <div className=" flex flex-col h-full justify-between ">
//           {renderFileList()}
//           <div className="flex gap-3 items-center mt-auto">
//             <button
//               className="w-[50%] border py-3 border-blue-400 text-blue-400 rounded-lg"
//               onClick={() => handleFileChange(null)}
//             >
//               Cancel
//             </button>
//             <button
//               className="w-[50%] py-3 bg-blue-500 text-white rounded-lg"
//               onClick={handleUpload}
//             >
//               Upload
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div
//           className="border border-black bg-slate-300 flex items-center justify-center h-40"
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//         >
//           <div className="flex flex-col items-center">
//             <h1>Drag and Drop Files</h1>
//             <h1>Or</h1>
//             <input
//               type="file"
//               multiple
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 handleFileChange(e.target.files)
//               }
//               hidden
//               accept="text/plain, text/xml, image/png, image/jpeg"
//               ref={inputRef}
//             />
//             <button
//               onClick={() => inputRef.current?.click()}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//             >
//               Select Files
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DragAndDrop;

import { useState, useRef, ChangeEvent, DragEvent, FC } from "react";
import * as XLSX from "xlsx";


const DragAndDrop: FC = () => {
  const [files, setFiles] = useState<XLSX.WorkSheet[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const workbook = XLSX.read(fileArray[0], { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    setFiles([worksheet]);
  };
  

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  };

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    if (files) {
      XLSX.utils.book_append_sheet(wb, files, "Transactions");
      XLSX.writeFile(wb, "Transactions.xlsx");
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Sheet1");
    workbook.Sheets["Sheet1"] = files[0];
    XLSX.writeFile(workbook, "uploadedFile.xlsx");
    setFiles(null);
  };

  const renderFileList = () => (
    <ul>
      {files?.map((file, idx) => (
        <li key={idx} className="text-[1rem] mt-4">
          {file.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="h-40">
      {files ? (
        <div className=" flex flex-col h-full justify-between ">
          {renderFileList()}
          <div className="flex gap-3 items-center mt-auto">
            <button
              className="w-[50%] border py-3 border-blue-400 text-blue-400 rounded-lg"
              onClick={() => setFiles(null)}
            >
              Cancel
            </button>
            <button
              className="w-[50%] py-3 bg-blue-500 text-white rounded-lg"
              onClick={handleUpload}
            >
              Upload
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
                handleFileChange(e.target.files)
              }
              hidden
              accept=".xlsx, .xls, .csv"
              ref={inputRef}
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Select Files
            </button>
            {files && <button onClick={handleDownload}>Download Excel</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
