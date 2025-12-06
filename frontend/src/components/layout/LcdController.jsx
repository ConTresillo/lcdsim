import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all Layout/Display Components (They are now 'Dumb' presenters)
import GpioPanel from './GpioPanel';
import ActionPanel from './ActionPanel';
import StatePanel from './StatePanel';
import LcdScreen from '../display/LcdScreen';
import Terminal from '../display/Terminal';

// Import UI Atoms
import DataPin from '../ui/DataPin';
import NeonButton from '../ui/NeonButton';
import NeonDropdown from '../ui/NeonDropdown';
import PulseButton from '../ui/PulseButton';

const LcdController = () => {
  // --- STATE ---
  const [logs, setLogs] = useState(["> Initializing LCD...", "> Mode set to 4-Bit.", "> Backlight turned ON."]);
  const [gpio, setGpio] = useState({ rs: true, rw: false });
  const [enState, setEnState] = useState(false);
  const [dataBus, setDataBus] = useState([0, 0, 0, 0, 1, 1, 0, 0]);
  const [inputValue, setInputValue] = useState("");
  const [inputFormat, setInputFormat] = useState("Hex");
  const [backlight, setBacklight] = useState("ON");
  const [lcdRows, setLcdRows] = useState({
     row1: Array(16).fill(32),
     row2: Array(16).fill(32)
  });

  // --- LOGIC ---
  const addLog = (msg) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const toggleDataBit = (index) => {
    const newBus = [...dataBus];
    newBus[index] = newBus[index] === 1 ? 0 : 1;
    setDataBus(newBus);
  };

  const handleManualEn = () => {
    const newState = !enState;
    setEnState(newState);
    addLog(`EN Line set to ${newState ? 'HIGH' : 'LOW'}`);
  };

  const handleEnPulse = () => {
    setEnState(true);
    addLog("Pulse: EN (High -> Low)");
    setTimeout(() => { setEnState(false); }, 200);
  };

  const handleBacklightChange = (newStatus) => {
    setBacklight(newStatus);
    addLog(`Backlight turned ${newStatus}`);
  };

  const handleSend = () => {
    if(!inputValue) return;
    addLog(`Sending ${inputFormat}: '${inputValue}'...`);
    setInputValue("");
  };

  const sendCommand = async (hexCode) => {
    const hexStr = '0x' + hexCode.toString(16).toUpperCase().padStart(2,'0');
    addLog(`Sending Command: ${hexStr}`);
  };

  const getPlaceholder = () => {
    if (inputFormat === "Hex") return "e.g. 0x4A";
    if (inputFormat === "Decimal") return "e.g. 65";
    if (inputFormat === "Binary") return "e.g. 00011000";
    return "e.g. A";
  };

  // --- DYNAMIC THEME CALCULATIONS ---
  const isDataMode = gpio.rs;
  const borderColor = isDataMode ? "border-cyan-500/30" : "border-yellow-500/30";
  const titleColor  = isDataMode ? "text-cyan-400" : "text-yellow-500";
  const subTextColor = isDataMode ? "text-cyan-600" : "text-yellow-700";
  const labelText   = isDataMode ? "DATA REGISTER (DR)" : "INSTRUCTION REGISTER (IR)";
  const statusText  = isDataMode ? "RS=1 (HIGH)" : "RS=0 (LOW)";


  // --- COMPONENT RENDER LOGIC ---

  const DataInputUI = (
    <div className="flex flex-col gap-4">
       <div className="bg-slate-900 border border-cyan-500/30 rounded flex items-center px-3 py-2 w-full">
          <input
            className="bg-transparent border-none text-cyan-300 w-full focus:outline-none font-mono"
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
       </div>
       <div className="flex gap-2">
          <div className="w-28 relative">
              <NeonDropdown
                 value={inputFormat}
                 options={["Hex", "Decimal", "Binary", "ASCII"]}
                 onChange={setInputFormat}
              />
          </div>
          <div className="flex-1">
              <NeonButton label="SEND DATA" onClick={handleSend} />
          </div>
       </div>
    </div>
  );

  const CommandInputUI = (
    <div className="flex-1">
      <ActionPanel onExecute={sendCommand} />
    </div>
  );


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl w-full">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 min-w-0">
            <GpioPanel
                gpio={gpio}
                setGpio={setGpio}
                enState={enState}
                onManualEn={handleManualEn}
                backlight={backlight}
                setBacklight={handleBacklightChange}
            />
        </div>

        {/* CENTER COLUMN */}
        <div className="lg:col-span-6 flex flex-col gap-6 items-center min-w-0">
            <div className="w-full flex justify-center transition-all duration-500">
                <LcdScreen
                    row1Data={lcdRows.row1}
                    row2Data={lcdRows.row2}
                    backlight={backlight}
                />
            </div>

            <div className="flex gap-2 justify-center flex-wrap w-full items-center">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((bitIndex) => (
                    <DataPin
                        key={bitIndex}
                        label={`D${bitIndex}`}
                        active={dataBus[bitIndex] === 1}
                        onClick={() => toggleDataBit(bitIndex)}
                    />
                ))}
                <div className="w-2"></div>
                <PulseButton
                    label="EN"
                    isActive={enState}
                    onClick={handleEnPulse}
                />
            </div>

            <Terminal logs={logs}/>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-w-0 relative">

            {/* UNIFIED REGISTER PANEL */}
            <div className={`
              bg-white/5 backdrop-blur-md border rounded-xl p-6 w-full relative z-30
              min-h-[16rem] 
              flex flex-col
              transition-colors duration-500 ease-in-out
              ${borderColor}
           `}>

                {/* Header (Animates Color) */}
                <div
                    className={`flex justify-between items-center mb-4 border-b pb-2 transition-colors duration-500 ${borderColor}`}>
                    <label
                        className={`text-xs font-bold tracking-widest transition-colors duration-500 ${titleColor}`}>
                        {labelText}
                    </label>
                    <span className={`text-[10px] font-mono transition-colors duration-500 ${subTextColor}`}>
                  {statusText}
                </span>
                </div>

                {/* Dynamic Body Content - Framer Motion for Smooth Swap */}
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        {isDataMode ? (
                            <motion.div
                                key="data"
                                layout
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                transition={{duration: 0.3}}
                                className="w-full"
                            >
                                {DataInputUI}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="command"
                                layout
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                transition={{duration: 0.3}}
                                className="w-full"
                            >
                                {CommandInputUI}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* STATE PANEL (Fixed below) */}
            <div className="relative z-10">
                <StatePanel onConfigChange={sendCommand}/>
            </div>

        </div>

    </div>
  );
};

export default LcdController;