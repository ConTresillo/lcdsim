import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW: IMPORT THE CUSTOM HOOK ---
import { useLcdSim } from '../../utils/useLcdSim';

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

// NOTE: All prior logic functions (hexStringToInt, getFunctionSetCommand, etc.) are now inside useLcdSim.js

const LcdController = () => {

  // --- 1. USE CUSTOM HOOK TO GET ALL STATE AND HANDLERS ---
  const {
    state,
    handlers,
    setters,
  } = useLcdSim();

  // Destructure for cleaner access in JSX
  const {
    logs, gpio, enState, dataBus, inputValue, inputFormat, backlight, lcdRows,
    busWidth, lineCount, entryMode, displayVisible, cursorStyle,
    // ✅ NEW: Cursor position state pulled from the hook
    cursorRow, cursorCol, isCursorVisibleInCycle
  } = state;

  const {
    handleManualEn, handleEnPulse, handleBacklightChange, handleSend, sendCommand,
    toggleDataBit, handleCellClick, handleConfigChange
  } = handlers;

  const {
    setGpio, setInputFormat, setInputValue, setBacklight // Added setBacklight
  } = setters;


  // --- DYNAMIC THEME CALCULATIONS (Using state values from the hook) ---
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
            placeholder={
              inputFormat === "Hex" ? "e.g. 0x4A" :
              inputFormat === "Decimal" ? "e.g. 65" :
              inputFormat === "Binary" ? "e.g. 00011000" :
              "e.g. A"
            }
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


  // --- START OF STRUCTURAL RENDER ---
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

                        // ✅ PROPS PASSED TO LCD SCREEN FOR CURSOR RENDERING
                        cursorRow={cursorRow}
                        cursorCol={cursorCol}
                        cursorStyle={cursorStyle}
                        isBlinkingPhase={isCursorVisibleInCycle}
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