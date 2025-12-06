import { useState } from 'react';

// You will likely need to import other utility functions/constants here
// import { ACTION_COMMANDS, ... } from './LcdCommands';

// Helper to convert hex string to integer
const hexStringToInt = (hexStr) => parseInt(hexStr.replace('0x', ''), 16);

// --- CORE LOGIC: FUNCTION SET COMMAND CALCULATION ---
const getFunctionSetCommand = (width, lines) => {
  const is2Line = lines.includes('2 Lines');
  const is8Bit = width.includes('8-Bit');

  if (is8Bit && is2Line) return '0x38';
  if (is8Bit && !is2Line) return '0x30';
  if (!is8Bit && is2Line) return '0x28';
  if (!is8Bit && !is2Line) return '0x20';

  return '0x??';
};

// This is your new Custom Hook
export const useLcdSim = () => {

  // --- STATE (Moved from LcdController) ---
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

  // Configuration States
  const [busWidth, setBusWidth] = useState('4-Bit Mode');
  const [lineCount, setLineCount] = useState('2 Lines (16x2)');
  const [entryMode, setEntryMode] = useState('Left to Right (Inc)');
  const [displayVisible, setDisplayVisible] = useState('Display OFF');
  const [cursorStyle, setCursorStyle] = useState('Hidden');

  // --- HANDLERS (Moved from LcdController) ---

  const addLog = (msg) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const sendCommand = (hexCode) => {
    const hexVal = typeof hexCode === 'string' ? hexStringToInt(hexCode) : hexCode;
    const hexStr = '0x' + hexVal.toString(16).toUpperCase().padStart(2,'0');
    addLog(`Sending Command: ${hexStr}`);
  };

  // You would move handleCellClick and other primary handlers here too

  // THE MAIN CONFIGURATION HANDLER
  const handleConfigChange = ({ newConfig, changedProp, commands }) => {
    // 1. Update states via their setters (use the ones defined inside this hook!)
    setBusWidth(newConfig.busWidth);
    setLineCount(newConfig.lineCount);
    setEntryMode(newConfig.entryMode);
    setDisplayVisible(newConfig.displayVisible);
    setCursorStyle(newConfig.cursorStyle);

    if (changedProp === 'busWidth' || changedProp === 'lineCount') {
        const functionSetHexStr = getFunctionSetCommand(newConfig.busWidth, newConfig.lineCount);
        addLog(`Function Set determined by: ${newConfig.busWidth} + ${newConfig.lineCount}`);
        sendCommand(functionSetHexStr);
    } else if (commands && commands.length > 0) {
        commands.forEach(cmd => {
            sendCommand(cmd);
        });
    }
  };


  // --- RETURN OBJECT (What LcdController uses) ---
  return {
    // Current State values (Data for rendering)
    state: {
      logs, gpio, enState, dataBus, inputValue, inputFormat, backlight, lcdRows,
      busWidth, lineCount, entryMode, displayVisible, cursorStyle
    },
    // Setters (Data for modifying state/input)
    setters: {
      setGpio, /* ... other setters ... */ setInputValue, setInputFormat
    },
    // Handler functions (Logic/Actions)
    handlers: {
      addLog, sendCommand, handleConfigChange, /* handleCellClick, etc. */
    },
    // Utility for the Command Logic
    utils: {
      getFunctionSetCommand,
    }
  };
};