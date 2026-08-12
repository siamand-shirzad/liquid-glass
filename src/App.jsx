import { useState, useRef } from 'react';
import MagnifyingGlass from './components/MagnifyGlass';
import { Searchbox } from './components/Searchbox';
import { Navbar } from './components/searchBoxControl';
import { LiquidNavbar } from './FilterTest';
import { Switch } from './components/Switch';
import { Slider } from './components/Slider';

function App() {
  const [activeSection, setActiveSection] = useState('all');
  const magnifyRef = useRef(null);

  const sections = [
    { id: 'navbar', label: 'Liquid Navbar', component: <LiquidNavbar /> },
    { id: 'searchbox', label: 'Searchbox', component: <Searchbox /> },
    { id: 'switch', label: 'Switch', component: <Switch /> },
    { id: 'slider', label: 'Slider', component: <Slider /> },
    { id: 'magnifier', label: 'Magnifying Glass', component: <MagnifyingGlass containerRef={magnifyRef} /> },
    { id: 'control', label: 'Navbar Control', component: <Navbar /> },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Liquid Glass Components
            </h1>
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'all'
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                All
              </button>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        {/* Liquid Navbar Section */}
        {(activeSection === 'all' || activeSection === 'navbar') && (
          <section className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/nature.jpg"
                alt="Background"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <LiquidNavbar />
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Liquid Navbar</h2>
              <p className="text-sm text-white/60">Expandable navigation with glassmorphism effect</p>
            </div>
          </section>
        )}

        {/* Searchbox Section */}
        {(activeSection === 'all' || activeSection === 'searchbox') && (
          <section className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/pic.jpg"
                alt="Background"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <Searchbox />
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Searchbox</h2>
              <p className="text-sm text-white/60">Interactive search input with refraction effect</p>
            </div>
          </section>
        )}

        {/* Switch Section */}
        {(activeSection === 'all' || activeSection === 'switch') && (
          <section className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-8">
                <Switch />
              </div>
            </div>
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Liquid Switch</h2>
              <p className="text-sm text-white/60">Toggle switch with realistic glass physics</p>
            </div>
          </section>
        )}

        {/* Slider Section */}
        {(activeSection === 'all' || activeSection === 'slider') && (
          <section className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-8">
                <Slider />
              </div>
            </div>
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Liquid Slider</h2>
              <p className="text-sm text-white/60">Range slider with glass thumb and refraction</p>
            </div>
          </section>
        )}

        {/* Magnifying Glass Section */}
        {(activeSection === 'all' || activeSection === 'magnifier') && (
          <section className="relative h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/sia.png"
                alt="Background"
                className="w-full h-full object-contain opacity-80"
              />
            </div>
            <div ref={magnifyRef} className="absolute inset-0">
              <MagnifyingGlass containerRef={magnifyRef} />
            </div>
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Magnifying Glass</h2>
              <p className="text-sm text-white/60">Draggable lens with dynamic magnification</p>
            </div>
          </section>
        )}

        {/* Navbar Control Section */}
        {(activeSection === 'all' || activeSection === 'control') && (
          <section className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Navbar />
            </div>
            <div className="absolute bottom-4 left-6 text-white/80">
              <h2 className="text-xl font-semibold">Navbar Control Panel</h2>
              <p className="text-sm text-white/60">Interactive controls for glass parameters</p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-white/40 text-sm">
            Liquid Glass Components — Built with React, Motion, and SVG Filters
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
