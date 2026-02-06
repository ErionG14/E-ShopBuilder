import React from "react";
import { Link } from "react-router-dom";
import {
  HiCloudArrowUp,
  HiBolt,
  HiShieldCheck,
  HiServerStack,
  HiGlobeAlt,
  HiCheckCircle,
} from "react-icons/hi2";

const Hosting = () => {
  const features = [
    {
      icon: <HiBolt className="text-yellow-400" />,
      title: "Edge Delivery",
      desc: "Your store is served via optimized microservices for sub-second loading.",
    },
    {
      icon: <HiShieldCheck className="text-blue-500" />,
      title: "SSL Included",
      desc: "Every E-ShopBuilder store is secured with end-to-end encryption by default.",
    },
    {
      icon: <HiServerStack className="text-purple-500" />,
      title: "Isolated Databases",
      desc: "Your data is stored in dedicated clusters to ensure zero cross-talk security.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Enterprise Infrastructure
            </span>
            <h1 className="text-6xl font-black mb-6 leading-tight">
              Hosting that <br />
              <span className="text-blue-500">scales with you.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg">
              Stop worrying about servers. VoltX Systems provides
              high-performance hosting optimized specifically for the
              E-ShopBuilder microservices engine.
            </p>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/40 transition-all inline-block"
            >
              Launch Your Store
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gray-800 border border-gray-700 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-900 px-4 py-1 rounded-lg text-xs text-gray-500 font-mono">
                  voltx.com/shops/your-brand
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-gray-700 rounded-full"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded-full"></div>
                <div className="h-32 w-full bg-gray-900/50 rounded-2xl border border-gray-700 border-dashed flex items-center justify-center">
                  <HiCloudArrowUp className="text-4xl text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Domain/Slug Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="bg-gradient-to-br from-blue-900/40 to-gray-800 border border-blue-500/20 rounded-[3rem] p-12 md:p-20 text-center">
          <HiGlobeAlt className="text-6xl text-blue-500 mx-auto mb-8" />
          <h2 className="text-4xl font-black mb-6">Custom Store Slugs</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            Every store on our platform receives a unique URL identifier. Our
            routing gateway ensures your customers always reach your storefront
            instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <HiCheckCircle className="text-green-500" /> Auto-Provisioning
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <HiCheckCircle className="text-green-500" /> Layer 7 Routing
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <HiCheckCircle className="text-green-500" /> 99.9% Uptime
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Matching your About Us) */}
      <footer className="py-20 border-t border-gray-800 text-center">
        <div className="text-2xl font-black text-gray-700 tracking-tighter leading-tight">
          E-ShopBuilder by <br />
          VOLTX <span className="text-blue-600">SYSTEMS</span>
        </div>
      </footer>
    </div>
  );
};

export default Hosting;