import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Configurator from './pages/Configurator';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      <div className={`min-h-screen flex flex-col font-sans text-foreground bg-background transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Router>
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configurator" element={<Configurator />} />
            </Routes>
          </main>

          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;
