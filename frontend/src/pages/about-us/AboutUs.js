import React from "react";
import {
  HiRocketLaunch,
  HiShieldCheck,
  HiCircleStack,
  HiGlobeEuropeAfrica,
} from "react-icons/hi2";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-20 text-center">
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">
          Behind the platform
        </span>
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
          The future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            Micro-Commerce
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg font-medium leading-relaxed">
          VoltX isn't just a marketplace. It's a high-performance ecosystem
          built on distributed microservices, designed to give every owner total
          control over their digital footprint.
        </p>
      </section>

      {/* The Tech Bento Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Big Card - Our Mission */}
          <div className="md:col-span-2 bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
            <HiRocketLaunch className="text-9xl text-white/5 absolute -right-8 -bottom-8 group-hover:rotate-12 transition-transform duration-700" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed text-lg max-w-lg">
              We built E-ShopBuilder to eliminate the complexity of hosting and
              scale. By utilizing a modular architecture, we ensure that your
              store remains fast, secure, and always available—no matter how big
              you grow.
            </p>
          </div>

          {/* Small Card - Security */}
          <div className="bg-blue-600 rounded-[3rem] p-12 text-white flex flex-col justify-between">
            <HiShieldCheck className="text-5xl" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Secure</h3>
              <p className="text-blue-100 text-sm">
                Identity-server backed authentication and Stripe-encrypted
                payments.
              </p>
            </div>
          </div>

          {/* Small Card - Infrastructure */}
          <div className="bg-gray-100 rounded-[3rem] p-12 text-gray-900 flex flex-col justify-between border border-gray-200">
            <HiCircleStack className="text-5xl text-blue-600" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Scale</h3>
              <p className="text-gray-500 text-sm">
                Powered by .NET Microservices and MySQL distributed databases.
              </p>
            </div>
          </div>

          {/* Big Card - Global */}
          <div className="md:col-span-2 bg-green-50 rounded-[3rem] p-12 border border-green-100 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Global Hosting
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Every shop created on VoltX is assigned a unique slug and
                optimized for global delivery. From product management to order
                tracking, the entire process is handled by dedicated
                sub-systems.
              </p>
            </div>
            <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center">
              <HiGlobeEuropeAfrica className="text-6xl text-green-600 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-gray-100 text-center">
        <div className="text-2xl font-black text-gray-300 tracking-tighter leading-tight">
          E-ShopBuilder by <br />
          VOLTX <span className="text-blue-600">SYSTEMS</span>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;