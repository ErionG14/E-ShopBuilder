import React from "react";
import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/shared/Footer/Footer"

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
