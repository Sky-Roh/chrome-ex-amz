import amzLogo from "./assets/amazon-logo-seller.png";
import DragAndDrop from "./components/DragAndDrop";
const APP_NAME = import.meta.env.VITE_APPNAME || "Amazon Profit Tracker";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5 m-0 min-w-72">
      {/* Header */}
      <header className="flex items-center justify-center py-4 px-5 w-full">
        <div className="flex justify-center items-center">
          <a
            href="https://sell.amazon.ca/"
            target="_blank"
            className="w-[1.5rem] h-[1.5rem] flex rounded"
          >
            <img
              src={amzLogo}
              className="object-cover rounded"
              alt="Amazon logo"
            />
          </a>
        </div>
        <h1 className="text-[1.2rem] font-bold text-black ml-2">{APP_NAME}</h1>
      </header>

      {/* Card */}
      <main className="h-[70vh] bg-white w-full shadow-md rounded-lg p-4 text-center flex flex-col flex-grow">
        <DragAndDrop />
      </main>

      <footer className="py-2">
        <p className="text-gray-500 text-xs">&copy; Copyright 2024 Sky Roh</p>
      </footer>
    </div>
  );
}

export default App;
