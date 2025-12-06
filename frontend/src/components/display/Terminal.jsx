import React, { useEffect, useRef } from 'react';

const Terminal = ({ logs }) => {
  const bottomRef = useRef(null);

  // LOGIC: Auto-scroll to the bottom whenever 'logs' change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full bg-[#050b14] border border-cyan-500/30 rounded-xl p-4 shadow-inner mt-4 font-mono h-64 flex flex-col relative">

      {/* 1. TERMINAL HEADER */}
      <div className="flex justify-between items-center border-b border-cyan-900/50 pb-2 mb-2 bg-[#050b14]">
         {/* Increased header size to text-xs */}
         <span className="text-cyan-500 text-xs font-bold tracking-widest uppercase">System Logs</span>

         {/* Fake Window Controls */}
         <div className="flex gap-1.5 opacity-50">
           <div className="w-2.5 h-2.5 rounded-full bg-cyan-800"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-cyan-800"></div>
         </div>
      </div>

      {/* 2. LOG OUTPUT AREA */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
         {logs.map((log, i) => (
           // INCREASED FONT SIZE: text-sm -> text-base
           <div key={i} className="text-base font-medium text-cyan-300/90 hover:bg-white/5 px-2 py-1 rounded transition-colors break-words leading-relaxed">

             {/* Visual separation: If log starts with '>', style it differently */}
             {log.startsWith('>') ? (
               <>
                 <span className="text-cyan-600 select-none mr-3 font-bold">{'>'}</span>
                 <span className="drop-shadow-[0_0_2px_rgba(34,211,238,0.3)]">{log.substring(2)}</span>
               </>
             ) : (
               log
             )}
           </div>
         ))}

         {/* 3. BLINKING CURSOR & SCROLL ANCHOR */}
         <div className="flex items-center text-cyan-500 mt-2 pl-2" ref={bottomRef}>
            <span className="mr-3 text-cyan-700 text-lg">{'>'}</span>
            <span className="animate-pulse bg-cyan-500 w-3 h-5 block shadow-[0_0_5px_#00F0FF]"></span>
         </div>
      </div>
    </div>
  );
};

export default Terminal;