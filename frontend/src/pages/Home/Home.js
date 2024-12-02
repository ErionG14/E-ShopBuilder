import React from "react";
import advertisementImage from "../../assets/photos/Hosting.jpg";
import secondCard from "../../assets/photos/card2.png"
import thirdCard from "../../assets/photos/card3.png"
import design from "../../assets/photos/design.jpg"
import AllSet from "../../assets/photos/allset.png"
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <>
      <div className="md:w-full bg-yellow-200">
        <div className="md:flex">
          {/* Main flex container */}
          <div className="md:flex-shrink-0 w-1/2">
            {/* Image container */}
            <img
              className="w-full object-cover"
              src={advertisementImage}
              alt="Hosting"
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            {/* Text container */}
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Special E-ShopBuilder Hosting
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black py-4">
              High-Performance WordPress Hosting
            </h1>
            <p className="mt-2 text-gray-500 my-4">
              We have partnered with SiteGround to bring you full-service
              WordPress hosting for all types of websites. Starting from $1.99
              /mo.
            </p>
            <button className="bg-black text-white rounded-md py-2 w-1/4 flex items-center justify-center gap-2">
              Sign Up Now <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
      <div className="block mt-1 text-lg font-medium text-center py-24">
        <h1>Premium WordPress Hosting Solutions</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden place-items-center">
            <img
              className="w-45 h-45 object-cover"
              src={secondCard}
              alt="Feature 1"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Feature One</h2>
              <p className="text-gray-700 mb-4">
                Description of the first feature. It's awesome and you should
                definitely consider it.
              </p>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Learn More
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden place-items-center">
            <img
              className="w-45 h-45 object-cover"
              src={secondCard}
              alt="Feature 2"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">
                Click To Sign Up For Hosting
              </h2>
              <p className="text-gray-700 mb-4">
                Description of the second feature. It's amazing and you should
                not miss it.
              </p>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Learn More
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden place-items-center">
            <img
              className="w-45 h-45 object-cover py-1"
              src={thirdCard}
              alt="Feature 3"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Feature Three</h2>
              <p className="text-gray-700 mb-4">
                Description of the third feature. It's fantastic and you should
                definitely check it out.
              </p>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-full p-16">
        <div className="md:flex">
          {/* Text container */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black py-4">
              Design youre E-commerce With 1-Click
            </h1>
            <p className="mt-2 text-gray-500 my-4">
              The Live Design Interface gives you complete creative freedom,
              allowing for an intuitive workflow that will empower you to create
              any website style of choice. The only limit is your imagination.
            </p>
          </div>
          {/* Image container */}
          <div className="md:flex-shrink-0 w-1/2">
            <img
              className="w-full object-cover rounded"
              src={design}
              alt="Beautiful design"
            />
          </div>
        </div>
      </div>

      <div className="md:w-full p-16">
        <div className="md:flex">
          {/* Image container */}
          <div className="md:flex-shrink-0 w-1/2">
            <img
              className="w-full object-cover rounded"
              src={AllSet}
              alt="Beautiful design"
            />
          </div>
          {/* Text container */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black py-4">
              Start Customizing Your Website
            </h1>
            <p className="mt-2 text-gray-500 my-4">
              More than just a Website Builder, E-ShopBuilder is a set of
              intuitive workflow tools that gives you complete creative control
              and gives you the confidence to design and build websites like a
              professional.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <button className="bg-black text-white rounded-md py-2 w-1/4 flex items-center justify-center gap-2">
          Sign Up For Hosting Now <FaArrowRight />
        </button>
      </div>
      <p className="text-center text-gray-400">
        * Hosting offer valid for existing E-ShopBuilder customers only;
        E-ShopBuilder purchase required. Terms and Conditions apply.
      </p>

      <div className="md:w-full p-16 bg-blue-50">
        <div className="md:flex">
          {/* Text container */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black py-4">
              Design youre E-commerce With 1-Click
            </h1>
            <p className="mt-2 text-gray-500 mb-4">
              The Live Design Interface gives you complete creative freedom,
              allowing for an intuitive workflow that will empower you to create
              any website style of choice. The only limit is your imagination.
            </p>
            <button className="bg-black text-white rounded-md py-2 w-1/4 flex items-center justify-center gap-2">
              Take the step <FaArrowRight />
            </button>
          </div>
          {/* Image container */}
          <div className="md:flex-shrink-0 w-1/2">
            <img
              className="w-full object-cover rounded"
              src={design}
              alt="Beautiful design"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
