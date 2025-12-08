// src/hooks/useLcdSim.js (The Orchestrator)

import { useLcdState } from './useLcdState';
import { toInt, toHexStr, getFunctionSetCommand, getDDRAMCommand } from '../utils/LcdParser';
import { executeClearDisplay } from '../utils/LcdLogic'; // <--- UPDATED IMPORT HERE

export const useLcdSim = () => {
  // Pull all state and setters from the centralized state hook
  const { state, setters } = useLcdState();
  const {
    setLogs, setGpio, setEnState, setDataBus, setInputValue, setInputFormat,
    setBacklight, setLcdRows, setBusWidth, setLineCount, setEntryMode,
    setDisplayVisible, setCursorStyle, setCursorRow, setCursorCol
  } = setters;


  // --- UTILITY HANDLERS ---

  const addLog = (msg) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const processCommand = (hexVal) => {
    // This is where you would implement the switch-case logic for every command

    // Command 0x01: Clear Display
    if (hexVal === 0x01) {
      setLcdRows(executeClearDisplay(state.lcdRows));
      setCursorRow(0);
      setCursorCol(0);
    }
    // Command 0x80-0xFF: Set DDRAM Address
    else if ((hexVal & 0x80) === 0x80) {
      // Decode R/C from DDRAM command for UI state only
      const address = hexVal & 0x7F;
      const row = address < 0x40 ? 0 : 1;
      const col = address % 40; // Use 40 as max address in DDRAM for calculation

      setCursorRow(row);
      setCursorCol(col);
    }

    // Add other command logic here...
  };

  const sendCommand = (hexCode) => {
    const hexVal = toInt(hexCode);
    addLog(`Sending Command: ${toHexStr(hexVal)}`);
    processCommand(hexVal); // Route to internal command processor
  };


  // --- INTERACTION HANDLERS ---

  const toggleDataBit = (index) => {
    const newBus = [...state.dataBus];
    newBus[index] = newBus[index] === 1 ? 0 : 1;
    setDataBus(newBus);
  };

  const handleManualEn = () => {
    const newState = !state.enState;
    setEnState(newState);
    addLog(`EN Line set to ${newState ? 'HIGH' : 'LOW'}`);
  };

  const handleEnPulse = () => {
    setEnState(true);
    addLog("Pulse: EN (High -> Low)");
    // In a full sim, the command/data would be read HERE on the falling edge (High->Low)
    setTimeout(() => { setEnState(false); }, 200);
  };

  const handleBacklightChange = (newStatus) => {
    setBacklight(newStatus);
    addLog(`Backlight turned ${newStatus}`);
  };

  const handleSend = () => {
    if(!state.inputValue) return;
    // In a full sim, this would parse inputValue and send as data (RS=1)
    addLog(`Sending ${state.inputFormat}: '${state.inputValue}'...`);
    setInputValue("");
  };

  const handleCellClick = (row, col) => {
    const hexCommand = getDDRAMCommand(row, col);
    addLog(`Cursor set to: R${row}, C${col}`);
    sendCommand(hexCommand);
  };

  const handleConfigChange = ({ newConfig, changedProp, commands }) => {
    // Update config states
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
        commands.forEach(cmd => sendCommand(cmd));
    }
  };


  // --- FINAL RETURN OBJECT ---
  return {
    state: state,
    setters: {
      setGpio, setInputFormat, setInputValue, setBacklight, // Exposed simple setters
    },
    handlers: {
      addLog, sendCommand, handleConfigChange, handleCellClick,
      toggleDataBit, handleManualEn, handleEnPulse, handleBacklightChange, handleSend
    },
  };
};