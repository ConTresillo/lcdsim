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

// Helper to convert hex string to integer, needed for sendCommand
const hexStringToInt = (hexStr) => parseInt(hexStr.replace('0x', ''), 16);

// ------------------------------------------
// CORE LOGIC: FUNCTION SET COMMAND CALCULATION
// ------------------------------------------
const getFunctionSetCommand = (width, lines) => {
  // Logic based on combining the setting bits (F, N, DL bits)
  const is2Line = lines.includes('2 Lines');
  const is8Bit = width.includes('8-Bit');

  if (is8Bit && is2Line) return '0x38'; // 8-bit, 2 Line
  if (is8Bit && !is2Line) return '0x30'; // 8-bit, 1 Line
  if (!is8Bit && is2Line) return '0x28'; // 4-bit, 2 Line
  if (!is8Bit && !is2Line) return '0x20'; // 4-bit, 1 Line

  return '0x??'; // Fallback
};


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

  // NEW: STATES FOR CONFIGURATION
  const [busWidth, setBusWidth] = useState('4-Bit Mode');
  const [lineCount, setLineCount] = useState('2 Lines (16x2)');
  const [entryMode, setEntryMode] = useState('Left to Right (Inc)');
  const [displayVisible, setDisplayVisible] = useState('Display OFF');
  const [cursorStyle, setCursorStyle] = useState('Hidden');

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
    // If input is already a hex string, convert to integer first
    const hexVal = typeof hexCode === 'string' ? hexStringToInt(hexCode) : hexCode;
    const hexStr = '0x' + hexVal.toString(16).toUpperCase().padStart(2,'0');
    addLog(`Sending Command: ${hexStr}`);
  };

  // HANDLER FOR CLICKING A CELL (Set DDRAM Address command)
  const handleCellClick = (row, col) => {
    // Base Command: 0x80 (Set DDRAM Address)
    // Row 0 address: 0x00 to 0x0F
    // Row 1 address: 0x40 to 0x4F
    const rowOffset = row === 0 ? 0x00 : 0x40;

    // Calculate the final command address (0x80 | row offset | column)
    const ddramAddress = 0x80 | rowOffset | col;

    // Format to hexadecimal string (e.g., 0x80 to 0x8F, 0xC0 to 0xCF)
    const hexCommand = '0x' + ddramAddress.toString(16).toUpperCase().padStart(2, '0');

    addLog(`Cursor set to: R${row}, C${col}`);
    sendCommand(hexCommand);
  };


// MODIFIED: UNIFIED HOMOGENEOUS HANDLER FOR STATEPANEL CHANGES
const handleConfigChange = ({ newConfig, changedProp, commands }) => {
    // 1. Update all component states first
    setBusWidth(newConfig.busWidth);
    setLineCount(newConfig.lineCount);
    setEntryMode(newConfig.entryMode);
    setDisplayVisible(newConfig.displayVisible);
    setCursorStyle(newConfig.cursorStyle);

    let commandToSend = undefined;

    // --- HOMOGENEOUS COMMAND LOGIC ---
    if (changedProp === 'busWidth' || changedProp === 'lineCount') {
        // 1. Send the calculated Function Set command
        commandToSend = getFunctionSetCommand(newConfig.busWidth, newConfig.lineCount);
        addLog(`Function Set determined by: ${newConfig.busWidth} + ${newConfig.lineCount}`);
        sendCommand(commandToSend);
    } else if (commands && commands.length > 0) {
        // 2. Handle single command or constraint sequence
        commands.forEach(cmd => {
            sendCommand(cmd);
        });
    }
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

  // START OF THE STRUCTURAL FIX
  return (
    // Outer Container: Max width for the whole simulator panel, consumes full height.
    <div className="max-w-6xl w-full h-full">

        {/* Main Grid: Takes available width and manages content flow for the columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-full">

            {/* LEFT COLUMN: Fixed content height relative to container. Scrollable if content overflows. */}
            <div className="lg:col-span-3 min-w-0 flex flex-col h-full overflow-y-auto">
                <GpioPanel
                    gpio={gpio}
                    setGpio={setGpio}
                    enState={enState}
                    onManualEn={handleManualEn}
                    backlight={backlight}
                    setBacklight={handleBacklightChange}
                />
            </div>

            {/* CENTER COLUMN: Allow internal vertical scroll for logs/terminal. */}
            <div className="lg:col-span-6 flex flex-col gap-6 items-center min-w-0 h-full overflow-y-auto">
                <div className="w-full flex justify-center transition-all duration-500 flex-shrink-0">
                    <LcdScreen
                        row1Data={lcdRows.row1}
                        row2Data={lcdRows.row2}
                        backlight={backlight}
                        onCellClick={handleCellClick}
                    />
                </div>

                <div className="flex gap-2 justify-center flex-wrap w-full items-center flex-shrink-0">
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

            {/* RIGHT COLUMN: Allow internal vertical scroll for expanding menus. */}
            <div className="lg:col-span-3 flex flex-col gap-4 min-w-0 relative h-full overflow-y-auto">
                 {/* UNIFIED REGISTER PANEL */}
                <div className={`
                    flex-shrink-0
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
                <div className="relative z-10 flex-shrink-0">
                    <StatePanel
                        config={{ busWidth, lineCount, entryMode, displayVisible, cursorStyle }}
                        onConfigChange={handleConfigChange}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default LcdController;