import React from "react";
import advertisementImage from "../../assets/photos/Hosting.jpg";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <div className="md:w-full bg-yellow-200">
      <div className="md:flex">
        {/* Main flex container */}
        <div className="md:flex-shrink-0 w-1/2">
          {/* Image container */}
          <img
            className="w-full object-cover"
            src={advertisementImage}
            alt="Advertisement Image"
          />
        </div>
        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          {/* Text container */}
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Special E-ShopBuilder Hosting
          </div>
          <h1 className="block mt-1 text-2xl text-lg leading-tight font-medium text-black py-4">
            High-Performance WordPress Hosting
          </h1>
          <p className="mt-2 text-gray-500 my-4">
            We have partnered with SiteGround to bring you full-service
            WordPress hosting for all types of Avada websites. Starting from
            $1.99 /mo.
          </p>
          <button className="bg-black text-white rounded-md py-2 w-1/4 flex items-center justify-center gap-2">
            Sign Up Now <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
    
     
  );
};

export default Home;
