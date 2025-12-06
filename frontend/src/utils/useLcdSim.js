import { useState, useEffect } from 'react'; // <-- Import useEffect

// NOTE: Assuming LcdCommands and other necessary utilities are available in the scope
// If you need to access specific constants (like CURSOR_HIDDEN_HEX), you must import them.
// import { CURSOR_HIDDEN_HEX } from './LcdCommands';

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

  // Configuration States
  const [busWidth, setBusWidth] = useState('4-Bit Mode');
  const [lineCount, setLineCount] = useState('2 Lines (16x2)');
  const [entryMode, setEntryMode] = useState('Left to Right (Inc)');
  const [displayVisible, setDisplayVisible] = useState('Display OFF');
  const [cursorStyle, setCursorStyle] = useState('Hidden');
  const [cursorRow, setCursorRow] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);

  // ✅ NEW: Global state to control blinking phase (for synchronous blink)
  const [isCursorVisibleInCycle, setIsCursorVisibleInCycle] = useState(true);

  // --- EFFECT HOOK FOR SYNCHRONOUS BLINKING ---
  useEffect(() => {
    // Only run the timer if the cursor style is set to Blinking Block
    if (cursorStyle === 'Blinking Block') {
        const interval = setInterval(() => {
            // Flip the state every 500ms for a synchronous blink across the whole app
            setIsCursorVisibleInCycle(prev => !prev);
        }, 500);

        // Cleanup function to stop the timer when the component unmounts
        // or cursorStyle changes away from Blinking Block.
        return () => clearInterval(interval);
    } else {
        // Ensure the cursor is always visible (not blinking) when the style isn't 'Blinking Block'
        setIsCursorVisibleInCycle(true);
    }
  }, [cursorStyle]); // Only re-run if the desired cursor style changes


  // --- UTILITY HANDLERS ---
  const addLog = (msg) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const sendCommand = (hexCode) => {
    // If input is already a hex string, convert to integer first
    const hexVal = typeof hexCode === 'string' ? hexStringToInt(hexCode) : hexCode;
    const hexStr = '0x' + hexVal.toString(16).toUpperCase().padStart(2,'0');
    addLog(`Sending Command: ${hexStr}`);
  };

  // --- INTERACTION HANDLERS ---

  // HANDLER: Toggle Data Pin (used by DataPin buttons)
  const toggleDataBit = (index) => {
    const newBus = [...dataBus];
    newBus[index] = newBus[index] === 1 ? 0 : 1;
    setDataBus(newBus);
  };

  // HANDLER: Manual EN Switch (Toggle)
  const handleManualEn = () => {
    const newState = !enState;
    setEnState(newState);
    addLog(`EN Line set to ${newState ? 'HIGH' : 'LOW'}`);
  };

  // HANDLER: Handle EN Pulse
  const handleEnPulse = () => {
    setEnState(true);
    addLog("Pulse: EN (High -> Low)");
    setTimeout(() => { setEnState(false); }, 200);
  };

  // HANDLER: Handle Backlight Change
  const handleBacklightChange = (newStatus) => {
    setBacklight(newStatus);
    addLog(`Backlight turned ${newStatus}`);
  };

  // HANDLER: Handle Send (Data Register)
  const handleSend = () => {
    if(!inputValue) return;
    addLog(`Sending ${inputFormat}: '${inputValue}'...`);
    setInputValue("");
  };

  // HANDLER: Handle Cell Click (Set DDRAM Address command)
  const handleCellClick = (row, col) => {
    const rowOffset = row === 0 ? 0x00 : 0x40;
    const ddramAddress = 0x80 | rowOffset | col;
    const hexCommand = '0x' + ddramAddress.toString(16).toUpperCase().padStart(2, '0');

    setCursorRow(row);
    setCursorCol(col);

    addLog(`Cursor set to: R${row}, C${col}`);
    sendCommand(hexCommand);
  };

  // HANDLER: Move Cursor Right (simulates the 0x14 command visually)
  const moveCursorRight = () => {
    let newCol = cursorCol;
    let newRow = cursorRow;

    if (cursorCol < 15) {
        newCol = cursorCol + 1;
    } else if (cursorCol === 15 && cursorRow === 0) {
        newRow = 1;
        newCol = 0;
    } else if (cursorCol === 15 && cursorRow === 1) {
        return;
    }

    setCursorRow(newRow);
    setCursorCol(newCol);

    const rowOffset = newRow === 0 ? 0x00 : 0x40;
    const ddramAddress = 0x80 | rowOffset | newCol;
    const hexCommand = '0x' + ddramAddress.toString(16).toUpperCase().padStart(2, '0');

    addLog("Action: Cursor Move Right");
    sendCommand(hexCommand);
  };

  // HANDLER: Move Cursor Left (simulates the 0x10 command visually)
  const moveCursorLeft = () => {
    let newCol = cursorCol;
    let newRow = cursorRow;

    if (cursorCol > 0) {
        newCol = cursorCol - 1;
    } else if (cursorCol === 0 && cursorRow === 1) {
        newRow = 0;
        newCol = 15;
    } else if (cursorCol === 0 && cursorRow === 0) {
        return;
    }

    setCursorRow(newRow);
    setCursorCol(newCol);

    const rowOffset = newRow === 0 ? 0x00 : 0x40;
    const ddramAddress = 0x80 | rowOffset | newCol;
    const hexCommand = '0x' + ddramAddress.toString(16).toUpperCase().padStart(2, '0');

    addLog("Action: Cursor Move Left");
    sendCommand(hexCommand);
  };

  // THE MAIN CONFIGURATION HANDLER (Used by StatePanel)
  const handleConfigChange = ({ newConfig, changedProp, commands }) => {
    // 1. Update states via their setters
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
      busWidth, lineCount, entryMode, displayVisible, cursorStyle,
      cursorRow, cursorCol,
      isCursorVisibleInCycle // ✅ EXPOSED STATE FOR SYNCHRONOUS BLINKING
    },
    // Setters (Data for modifying state/input)
    setters: {
      setGpio, setInputFormat, setInputValue, setBacklight,
    },
    // Handler functions (Logic/Actions)
    handlers: {
      addLog, sendCommand, handleConfigChange, handleCellClick,
      toggleDataBit, handleManualEn, handleEnPulse, handleBacklightChange, handleSend,
      moveCursorLeft, moveCursorRight
    },
    // Utility for the Command Logic
    utils: {
      getFunctionSetCommand,
    }
  };
};