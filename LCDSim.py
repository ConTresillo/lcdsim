# ==========================================================
#  CLASS: Cell
#  - Represents one DDRAM cell on the LCD
#  - Stores character code + resolved 5x8 pixel pattern
#  - Handles cursor bar operations
# ==========================================================

class Cell:
    def __init__(self):
        self.char_code = 0
        self.pixel_data = [0] * 8  # 8 rows of 5 pixels each

    def set_char(self, code, CGROM, CGRAM):
        """
        Store char code and fetch corresponding pixel pattern.
        If code < 8 → from CGRAM
        Else       → from CGROM
        """
        self.char_code = code

        if code < 8:
            self.pixel_data = CGRAM[code].copy()
        else:
            self.pixel_data = CGROM.get(code, [0] * 8).copy()

    def render(self):
        """
        Render the 5x8 pixel data.
        In actual hardware: send rows to display driver.
        """
        # Placeholder for real pixel rendering
        print(f"Render char {self.char_code}: {self.pixel_data}")

    def cursor_set_bar(self):
        """Turns ON last row (cursor underline)."""
        self.pixel_data[7] = 0b11111

    def cursor_toggle_bar(self):
        """Blink effect: XOR last row."""
        self.pixel_data[7] ^= 0b11111


# ==========================================================
#  CLASS: LCDDisplay
#  - Manages DDRAM, CGRAM
#  - Handles address counter, entry modes, shifts
#  - Maintains visible window (start..end)
#  - Added RS, R/W, EN simulation
# ==========================================================
class LCDDisplay:
    def __init__(self):
        # === Geometry ===
        self.rows = 2
        self.total_cols = 40
        self.visible_cols = 16
        self.hidden = self.total_cols - self.visible_cols

        # === DDRAM as Cell matrix ===
        self.cells = [[Cell() for _ in range(self.total_cols)]
                      for _ in range(self.rows)]

        # === CGRAM: 8 custom chars, 8 bytes each ===
        self.CGRAM = [[0] * 8 for _ in range(8)]

        # Visible window
        self.start = self.hidden // 2
        self.end = self.start + self.visible_cols - 1

        # Address Counter
        self.AC = self.start

        # Entry mode & display flags
        self.entry_mode = "INC"
        self.shift_mode = "NONE"
        self.display_on = True
        self.cursor_on = True
        self.blink_on = True

        # Fake CGROM
        self.CGROM = {i: [0] * 8 for i in range(256)}

        # === Control signals ===
        self.RS = 0  # 0 = instruction, 1 = data
        self.RW = 0  # 0 = write, 1 = read
        self.EN = 0  # falling edge triggers execution
        self._last_EN = 0  # track last EN state

    # ------------------------------------------------------
    def set_control(self, RS, RW, EN, data_byte):
        """
        Simulate MCU writing to control pins + databus.
        RS: 0=instruction, 1=data
        RW: 0=write, 1=read (read ignored for now)
        EN: 0->1 latching happens on falling edge
        data_byte: 8-bit bus
        """
        self.RS = RS
        self.RW = RW

        # Detect falling edge
        if self._last_EN == 1 and EN == 0:
            # Execute the byte based on RS/RW
            if self.RW == 0:  # write
                if self.RS == 0:
                    self._process_instruction(data_byte)
                else:
                    self.write_data(data_byte)
            else:
                # Read ignored for now or implement busy flag later
                pass

        self._last_EN = EN

    # ------------------------------------------------------
    def _process_instruction(self, instr):
        """Handle instructions (simplified)"""
        # For demo, let's implement shift left/right and clear
        if instr == 0x1C:  # shift right
            self.shift_right()
        elif instr == 0x18:  # shift left
            self.shift_left()
        elif instr == 0x01:  # clear display
            for r in range(self.rows):
                for c in range(self.total_cols):
                    self.cells[r][c].set_char(0, self.CGROM, self.CGRAM)
            self.AC = self.start
        # Add more instructions as needed

    # ------------------------------------------------------
    def write_data(self, byte):
        """Write data byte to DDRAM via AC"""
        row, col = self._decode_address(self.AC)
        self.cells[row][col].set_char(byte, self.CGROM, self.CGRAM)

        # Auto screen shifting
        if self.shift_mode == "RIGHT":
            self.shift_right()
        elif self.shift_mode == "LEFT":
            self.shift_left()

        # Cursor movement
        if self.entry_mode == "INC":
            self.AC += 1
        else:
            self.AC -= 1

        self._wrap_address()

    # Existing methods...
    def _decode_address(self, ac):
        if 0x00 <= ac <= 0x27:
            return 0, ac
        if 0x40 <= ac <= 0x67:
            return 1, ac - 0x40
        return 0, 0

    def shift_right(self):
        if self.start > 0:
            self.start -= 1
            self.end -= 1

    def shift_left(self):
        if self.end < self.total_cols - 1:
            self.start += 1
            self.end += 1

    def render(self):
        for r in range(self.rows):
            row_pixels = [self.cells[r][c].char_code for c in range(self.start, self.end + 1)]
            print(f"Row {r} :", row_pixels)

    def update_cursor(self):
        if not self.cursor_on:
            return
        row, col = self._decode_address(self.AC)
        cell = self.cells[row][col]
        cell.cursor_set_bar()
        if self.blink_on:
            cell.cursor_toggle_bar()

    def _wrap_address(self):
        if self.AC == 0x28:
            self.AC = 0x40
        elif self.AC == 0x68:
            self.AC = 0x00


# ==========================================================
#  CLASS: LCD (Controller Wrapper)
#  - MCU talks only to this class
# ==========================================================

class LCD:
    def __init__(self):
        self.display = LCDDisplay()

    def send_data(self, byte):
        """MCU writing to LCD."""
        self.display.write_data(byte)

    def refresh(self):
        """Re-render screen + cursor."""
        self.display.render()
        self.display.update_cursor()


if __name__ == "__main__":
    lcd = LCDDisplay()

    lcd.render()

    # Send 'A' to DDRAM
    lcd.set_control(RS=1, RW=0, EN=1, data_byte=69)  # EN high -> prepare
    lcd.set_control(RS=1, RW=0, EN=0, data_byte=69)  # EN falling -> write

    # Refresh view
    lcd.render()
