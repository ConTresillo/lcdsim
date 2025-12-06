import React from 'react';

// Import Layouts
import Navbar from './components/layout/Navbar';
import LcdController from './components/layout/LcdController'; // <-- NEW IMPORT

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-4 flex flex-col items-center">

      <Navbar />

      {/* The entire application logic is now managed by LcdController */}
      <LcdController />

      <div className="mt-12 text-gray-600 text-xs">Copyright © -. All rights reserved</div>
    </div>
  );
};

export default App;