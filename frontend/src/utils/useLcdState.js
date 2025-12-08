// src/hooks/useLcdState.js

import { useState } from 'react';

const ASCII_SPACE = 32;
const DDRAM_WIDTH = 40; // DDRAM is 40 cells wide

/**
 * Hook to initialize and manage all primary state variables for the LCD simulation.
 */
export const useLcdState = () => {
  const [logs, setLogs] = useState(["> Initializing LCD...", "> Mode set to 4-Bit.", "> Backlight turned ON."]);
  // FIX: Start in Command Write Mode (RS=0, R/W=0)
  const [gpio, setGpio] = useState({ rs: false, rw: false });
  const [enState, setEnState] = useState(false);
  const [dataBus, setDataBus] = useState([0, 0, 0, 0, 1, 1, 0, 0]);
  const [inputValue, setInputValue] = useState("");
  const [inputFormat, setInputFormat] = useState("Hex");
  const [backlight, setBacklight] = useState("ON");

  // DDRAM: Initialized to 40 columns
  const [lcdRows, setLcdRows] = useState({
     row1: Array(DDRAM_WIDTH).fill(ASCII_SPACE),
     row2: Array(DDRAM_WIDTH).fill(ASCII_SPACE)
  });

  // Configuration States
  const [busWidth, setBusWidth] = useState('4-Bit Mode');
  const [lineCount, setLineCount] = useState('2 Lines (16x2)');
  const [entryMode, setEntryMode] = useState('Left to Right (Inc)');
  const [displayVisible, setDisplayVisible] = useState('Display OFF');
  const [cursorStyle, setCursorStyle] = useState('Hidden');

  const [cursorRow, setCursorRow] = useState(0);
  const [cursorCol, setCursorCol] = useState(0); // DDRAM column (0-39)

  // FIX: DDRAM Display Offset starts at 0 (meaning visible area = DDRAM addresses 0-15)
  const [ddramOffset, setDdramOffset] = useState(0);

  return {
    state: { logs, gpio, enState, dataBus, inputValue, inputFormat, backlight, lcdRows, busWidth, lineCount, entryMode, displayVisible, cursorStyle, cursorRow, cursorCol, ddramOffset },
    setters: { setLogs, setGpio, setEnState, setDataBus, setInputValue, setInputFormat, setBacklight, setLcdRows, setBusWidth, setLineCount, setEntryMode, setDisplayVisible, setCursorStyle, setCursorRow, setCursorCol, setDdramOffset }
  };
};