import logo from "./logo.svg";
import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="text-center">
        <img src={logo} className="mx-auto mb-6 w-32 h-32" alt="logo" />
        <p className="mt-8 text-lg">
          Edit <code className="font-mono text-yellow-300">src/App.js</code> and
          save to reload.
        </p>
        <p className="mt-4 text-lg">Edited by TailwindCSS!</p>
        <a
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
