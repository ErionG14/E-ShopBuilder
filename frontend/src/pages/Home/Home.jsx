import React from 'react';
import Navbar from "./components/shared/Navbar/Navbar";
import Home from './pages/Home/Home';

const home = () => {
  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
};

export default home;
