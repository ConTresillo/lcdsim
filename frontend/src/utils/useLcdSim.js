// src/hooks/useLcdSim.js

import { useLcdState } from './useLcdState';
import { toInt, toHexStr, getFunctionSetCommand, getDDRAMCommand } from '../utils/LcdParser';
import { executeClearDisplay } from '../utils/LcdLogic';

export const useLcdSim = () => {
  const { state, setters } = useLcdState();
  const {
    setLogs, setGpio, setEnState, setDataBus, setInputValue, setInputFormat,
    setBacklight, setLcdRows, setBusWidth, setLineCount, setEntryMode,
    setDisplayVisible, setCursorStyle, setCursorRow, setCursorCol, setDdramOffset
  } = setters;


  // --- DDRAM OFFSET / SCROLL UTILITY ---

  const DDRAM_WIDTH = 40;
  const VISIBLE_WIDTH = 16;

  /**
   * Adjusts the DDRAM Offset (viewport) to ensure the given internal column is visible.
   */
  const autoScrollDdramOffset = (internalDDRAM_Col, currentOffset) => {
      let newOffset = currentOffset;

      // 1. Cursor moved off the RIGHT edge of the visible window
      if (internalDDRAM_Col >= currentOffset + VISIBLE_WIDTH) {
          // Shift the window right to align the new column to the right edge
          newOffset = internalDDRAM_Col - (VISIBLE_WIDTH - 1);
      }
      // 2. Cursor moved off the LEFT edge of the visible window
      else if (internalDDRAM_Col < currentOffset) {
          // Shift the window left to align the new column to the left edge
          newOffset = internalDDRAM_Col;
      }

      // Ensure offset stays within bounds (0 to 40 - 16 = 24)
      newOffset = Math.min(newOffset, DDRAM_WIDTH - VISIBLE_WIDTH);
      newOffset = Math.max(newOffset, 0);

      return newOffset;
  };

  // --- COMMAND PROCESSOR ---

  const addLog = (msg) => setLogs(prev => [...prev.slice(-4), `> ${msg}`]);

  const processCommand = (hexVal) => {

    // Command 0x01: Clear Display
    if (hexVal === 0x01) {
      setLcdRows(executeClearDisplay());
      setCursorRow(0);
      setCursorCol(0);
      setDdramOffset(0); // FIX: Resets visible window to start at DDRAM address 0x00
    }
    // Command 0x80-0xFF: Set DDRAM Address
    else if ((hexVal & 0x80) === 0x80) {
      const address = hexVal & 0x7F;

      const row = address < 0x40 ? 0 : 1;
      const internalDDRAM_Col = address < 0x40 ? address : address - 0x40;

      setCursorRow(row);
      setCursorCol(internalDDRAM_Col);

      // Automatically scroll the view to ensure the cursor is visible
      const newOffset = autoScrollDdramOffset(internalDDRAM_Col, state.ddramOffset);
      setDdramOffset(newOffset);
    }
    // Add other command logic here...
  };

  const sendCommand = (hexCode) => {
    const hexVal = toInt(hexCode);
    addLog(`Sending Command: ${toHexStr(hexVal)}`);
    processCommand(hexVal);
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
    setTimeout(() => { setEnState(false); }, 200);
  };

  const handleBacklightChange = (newStatus) => {
    setBacklight(newStatus);
    addLog(`Backlight turned ${newStatus}`);
  };

  const handleSend = () => {
    if(!state.inputValue) return;
    addLog(`Sending ${state.inputFormat}: '${state.inputValue}'...`);
    setInputValue("");
  };

  const handleCellClick = (row, col) => {
    // Map the clicked visible column (0-15) to the internal DDRAM column
    // DDRAM address = current DDRAM offset + visible column index
    const ddramCol = state.ddramOffset + col;

    const hexCommand = getDDRAMCommand(row, ddramCol);
    addLog(`Cursor set to: R${row}, C${ddramCol} (Internal DDRAM Address)`);
    sendCommand(hexCommand);
  };

  const handleConfigChange = ({ newConfig, changedProp, commands }) => {
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
      setGpio, setInputFormat, setInputValue, setBacklight, setDdramOffset
    },
    handlers: {
      addLog, sendCommand, handleConfigChange, handleCellClick,
      toggleDataBit, handleManualEn, handleEnPulse, handleBacklightChange, handleSend
    },
  };
};