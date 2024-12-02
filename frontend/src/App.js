import React from "react";
import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./pages/Home/Home"; // Import the Home component

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
