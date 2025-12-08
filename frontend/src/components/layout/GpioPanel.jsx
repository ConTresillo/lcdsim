import React from 'react';
import ToggleSwitch from '../ui/ToggleSwitch';
import NeonDropdown from '../ui/NeonDropdown';

const GpioPanel = ({ gpio, setGpio, backlight, setBacklight, enState, onManualEn }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 h-fit">
    <h3 className="text-neon mb-6 font-bold border-b border-white/10 pb-2">GPIO SWITCHES</h3>

    <ToggleSwitch label="RS" subtitle="Register Select" active={gpio.rs} onClick={() => setGpio({...gpio, rs: !gpio.rs})} />

    {/* R/W Switch: Toggles the gpio.rw state */}
    <ToggleSwitch label="RW" subtitle="Read/Write" active={gpio.rw} onClick={() => setGpio({...gpio, rw: !gpio.rw})} />

    {/* EN SWITCH (Linked to Shared State) */}
    <ToggleSwitch
        label="EN"
        subtitle="Enable Line"
        active={enState}      // Visual: Reflects the shared line state
        onClick={onManualEn}  // Action: Toggles the shared state manually
    />

    <div className="mt-8 space-y-4">
       <div>
         <label className="text-xs text-gray-400 block mb-1">BACKLIGHT</label>
         <NeonDropdown
            value={backlight}
            options={["ON", "OFF"]}
            onChange={setBacklight}
         />
       </div>
    </div>
  </div>
);

export default GpioPanel;