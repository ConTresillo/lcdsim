// src/hooks/useLcdState.js

import { useState } from 'react';

// ASCII for space character
const ASCII_SPACE = 32;

/**
 * Hook to initialize and manage all primary state variables for the LCD simulation.
 * @returns {object} State object containing all getters and setters.
 */
export const useLcdState = () => {
  const [logs, setLogs] = useState(["> Initializing LCD...", "> Mode set to 4-Bit.", "> Backlight turned ON."]);
  const [gpio, setGpio] = useState({ rs: true, rw: false });
  const [enState, setEnState] = useState(false);
  const [dataBus, setDataBus] = useState([0, 0, 0, 0, 1, 1, 0, 0]);
  const [inputValue, setInputValue] = useState("");
  const [inputFormat, setInputFormat] = useState("Hex");
  const [backlight, setBacklight] = useState("ON");

  // DDRAM: Initialize 16x2 with ASCII space (32)
  const [lcdRows, setLcdRows] = useState({
     row1: Array(16).fill(ASCII_SPACE),
     row2: Array(16).fill(ASCII_SPACE)
  });

  // Configuration States
  const [busWidth, setBusWidth] = useState('4-Bit Mode');
  const [lineCount, setLineCount] = useState('2 Lines (16x2)');
  const [entryMode, setEntryMode] = useState('Left to Right (Inc)');
  const [displayVisible, setDisplayVisible] = useState('Display OFF');
  const [cursorStyle, setCursorStyle] = useState('Hidden');
  const [cursorRow, setCursorRow] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);

  return {
    state: { logs, gpio, enState, dataBus, inputValue, inputFormat, backlight, lcdRows, busWidth, lineCount, entryMode, displayVisible, cursorStyle, cursorRow, cursorCol },
    setters: { setLogs, setGpio, setEnState, setDataBus, setInputValue, setInputFormat, setBacklight, setLcdRows, setBusWidth, setLineCount, setEntryMode, setDisplayVisible, setCursorStyle, setCursorRow, setCursorCol }
  };
};