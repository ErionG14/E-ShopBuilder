import React from "react";
import advertisementImage from "../../assets/photos/Hosting.jpg";
import setupjpg from "../../assets/photos/setup-icon.png";
import secondCard from "../../assets/photos/card2.png";
import thirdCard from "../../assets/photos/card3.png";
import design from "../../assets/photos/design.jpg";
import AllSet from "../../assets/photos/allset.png";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiSparkles, HiRocketLaunch, HiPaintBrush } from "react-icons/hi2";

const Home = () => {
  return (
    <div className="font-inter antialiased bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
              <HiRocketLaunch className="text-sm" /> Exclusive Infrastructure
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              Scale Your Vision with{" "}
              <span className="text-blue-600">VoltX Hosting.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
              We’ve built a specialized microservices environment to ensure your
              storefront remains fast, secure, and always online. Starting at
              just <span className="text-gray-900 font-bold">$1.99/mo.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95">
                Get Started <FaArrowRight />
              </button>
              <button className="bg-white text-gray-600 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                View Pricing
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-400/20 blur-3xl rounded-full animate-pulse"></div>
              <img
                className="relative w-full rounded-[2.5rem] shadow-2xl object-cover transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
                src={advertisementImage}
                alt="Hosting"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Enterprise Features, Accessible Pricing
          </h2>
          <p className="text-gray-500 font-medium">
            Everything you need to launch and grow your digital empire without
            the technical headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: setupjpg,
              title: "Instant Setup",
              desc: "Your storefront live in seconds with auto-provisioning technology.",
            },
            {
              img: secondCard,
              title: "Global Cloud",
              desc: "Deploy to multiple regions to ensure zero latency for your customers.",
            },
            {
              img: thirdCard,
              title: "24/7 Monitoring",
              desc: "Real-time health checks on every microservice in your stack.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {feature.desc}
              </p>
              <button className="text-blue-600 font-bold text-sm flex items-center gap-1 mx-auto group-hover:gap-2 transition-all">
                Learn More <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- CONTENT BLOCK: DESIGN --- */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">
              <HiPaintBrush />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Design with <br />{" "}
              <span className="text-blue-500">Zero Code.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The VoltX Live Interface empowers you to build exactly what you
              see. Drag, drop, and customize with pixel-perfect precision. No
              templates required.
            </p>
            <ul className="space-y-3">
              {[
                "1-Click Imports",
                "Real-time Rendering",
                "Mobile Optimized",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 font-bold text-sm text-gray-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-10 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <img
                className="relative w-full rounded-[3rem] shadow-2xl border border-gray-800"
                src={design}
                alt="Interface Design"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <HiSparkles className="absolute text-white/10 text-[20rem] -right-20 -top-20" />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
            Ready to build your <br /> storefront today?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-2xl active:scale-95">
              Launch Now
            </button>
            <p className="text-blue-100 text-xs text-left max-w-[150px] leading-tight">
              * Valid for existing E-ShopBuilder customers only.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-gray-100 text-center">
        <div className="text-2xl font-black text-gray-300 tracking-tighter leading-tight">
          E-ShopBuilder by <br />
          VOLTX <span className="text-blue-600">SYSTEMS</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
