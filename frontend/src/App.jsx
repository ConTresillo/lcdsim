import React from 'react';

// Import Layouts
import Navbar from './components/layout/Navbar';
import LcdController from './components/layout/LcdController';

const App = () => {
  return (
    // FIX APPLIED: Use h-screen (exact height) and overflow-hidden to contain the page.
    // Use p-2 or p-4 on an inner container or margin on elements instead of the outer wrapper.
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white flex flex-col items-center overflow-hidden">

      {/* 1. Navbar (Fixed at top) */}
      <Navbar />

      {/* 2. Main Controller: Uses remaining height for scrollable content */}
      <div className="flex-1 w-full flex justify-center p-4 overflow-y-auto">
          <LcdController />
      </div>

      {/* 3. Footer/Copyright: Fixed position at the very bottom (optional) or inside the scroll area */}
      <div className="mt-2 text-gray-600 text-xs flex-shrink-0">Copyright © -. All rights reserved</div>
    </div>
  );
};

export default App;