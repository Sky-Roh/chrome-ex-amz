import amzLogo from "./assets/amazon-logo-seller.png";
import DragAndDrop from "./components/DragAndDrop";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-5 min-w-72">
      {/* Header */}
      <header className="flex items-center my-4">
        <div className="m-1 flex justify-center">
          <a
            href="https://sell.amazon.ca/"
            target="_blank"
            className="w-[1.5rem] h-[1.5rem] flex rounded relative"
          >
            <img
              src={amzLogo}
              className="object-cover rounded"
              alt="Amazon logo"
            />
          </a>
        </div>
        <h1 className="text-[1.2rem] font-bold text-black">Amazon Profit</h1>
      </header>
      {/* Card  */}
      <main className="bg-white w-[100%] shadow-md rounded-lg p-6 text-center h-60 flex items-center justify-center">
        <DragAndDrop />
      </main>

      <footer className="mt-6">
        <p className="text-gray-500 text-xs">&copy; Copyright 2024 Sky Roh</p>
      </footer>
    </div>
  );
}

export default App;
