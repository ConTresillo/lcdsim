import React from 'react';
import { Menu, Home, FileText } from 'lucide-react';

const Navbar = () => (
  <nav className="w-full max-w-6xl flex justify-between items-center py-6 mb-8 border-b border-white/5">
    <div className="flex gap-4 text-gray-400"><Menu /><Home className="text-neon" /><FileText /></div>
    <h1 className="text-4xl font-bold text-neon tracking-widest drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">LCD 16x2 SIMULATOR</h1>
    <div className="flex gap-6 text-sm font-bold text-gray-400"><span className="text-neon">HOME</span><span>DOCS</span><span>ABOUT</span></div>
  </nav>
);

export default Navbar;