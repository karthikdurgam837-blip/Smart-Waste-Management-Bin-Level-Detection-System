/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info, AlertTriangle, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface WirePin {
  fromPin: string;
  toComponent: string;
  toPin: string;
  wireColor: string;
  role: string;
  criticalInfo: string;
}

export default function CircuitDiagram() {
  const [selectedWire, setSelectedWire] = useState<number | null>(null);

  const wiringData: WirePin[] = [
    {
      fromPin: "5V (Vin)",
      toComponent: "HC-SR04 Ultrasonic Sensor",
      toPin: "VCC",
      wireColor: "🔴 Red",
      role: "Power input",
      criticalInfo: "Ultrasonic sensor requires exactly 5V to fire sonic pulses with maximum acoustic clarity. Powering from 3.3V reduces operational range and causes calculation errors."
    },
    {
      fromPin: "GND",
      toComponent: "HC-SR04 Ultrasonic Sensor",
      toPin: "GND",
      wireColor: "⚫ Black",
      role: "Common Ground",
      criticalInfo: "Always tie all grounds (ESP32, Sensors, Power supplies) together to establish a baseline voltage index."
    },
    {
      fromPin: "GPIO 5",
      toComponent: "HC-SR04 Ultrasonic Sensor",
      toPin: "TRIG",
      wireColor: "🔵 Blue",
      role: "Ultrasonic Trigger Pin",
      criticalInfo: "ESP32 outputs a 10-microsecond HIGH pulse on this line. This triggers the HC-SR04 to emit an array of 8 ultrasonic bursts at 40kHz."
    },
    {
      fromPin: "GPIO 18",
      toComponent: "HC-SR04 Ultrasonic Sensor",
      toPin: "ECHO (via Voltage Divider)",
      wireColor: "🟡 Yellow",
      role: "Ultrasonic Echo Input",
      criticalInfo: "⚠️ IMPORTANT: The HC-SR04 Echo pin outputs 5V. To protect ESP32 (which operates at 3.3V logic), implement a resistive voltage divider (1kΩ and 2kΩ) on the Echo line to scale 5V down to 3.3V."
    },
    {
      fromPin: "5V (Vin)",
      toComponent: "MQ-135 Odor Gas Sensor",
      toPin: "VCC",
      wireColor: "🔴 Red",
      role: "Power input",
      criticalInfo: "The MQ-135 requires 5V to heat its ceramic internal wire element. The heater consumes around 150mA. Do NOT power this from the ESP32 3.3V rail as it will brownout the processor."
    },
    {
      fromPin: "GPIO 34 (Analog-In)",
      toComponent: "MQ-135 Odor Gas Sensor",
      toPin: "A0 (Analog Output)",
      wireColor: "🟣 Purple",
      role: "Analog Sensor telemetry feed",
      criticalInfo: "Outputs variable analog voltage from 0V (no odor) to 5V (toxic saturation). Connect through ADC pins to sample density metrics."
    },
    {
      fromPin: "GPIO 23",
      toComponent: "Active Piezo Buzzer",
      toPin: "Positive Pin (+)",
      wireColor: "🟤 Brown",
      role: "Acoustic Overfill Alarm Trigger",
      criticalInfo: "Pulsing this pin HIGH sends audio pulses. Tie a 100Ω current-limiting resistor in series to shield the ESP32 GPIO pin from excessive current draw."
    },
    {
      fromPin: "GPIO 4",
      toComponent: "Green, Yellow, Red Status LEDs",
      toPin: "Anodes (via 220Ω Resistors)",
      wireColor: "🟢 Green / 🟡 Yellow / 🔴 Red",
      role: "Local status indicator",
      criticalInfo: "Fires localized LEDs matching status: Green (Empty), Yellow (Half Full), Red (Nearly full or danger zone)."
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 h-full" id="circuit_explorer">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> Engineering Schematic
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Interactive Circuit Wiring</h2>
          <p className="text-xs text-slate-500">Safeguard logic levels & configure pull-ups with visual wiring alignments</p>
        </div>
        <div className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg p-2 max-w-xs leading-relaxed">
          💡 Click a wire row in the table below to inspect its purpose, voltage tolerance, and hardware protection guidelines.
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Visual Structural Node Schematic */}
        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative min-h-[380px]">
          
          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Component Interlinks
          </h3>

          {/* Interactive Web Schema Graphic */}
          <div className="w-full relative space-y-6 select-none">
            
            {/* Ultrasonic block */}
            <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                🔊 HC-SR04 (Ultrasonic)
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">
                VCC | GND | TRIG | ECHO
              </span>
            </div>

            {/* Voltage Divider Block */}
            <div className="mx-auto w-3/4 p-2 bg-amber-50 rounded-lg border border-amber-200 text-center relative z-10 shadow-xs">
              <span className="text-[10px] font-mono text-amber-800 font-bold block">
                ⚠️ Voltage Divider (1kΩ + 2kΩ)
              </span>
              <span className="text-[9px] text-amber-600 block leading-tight mt-0.5">
                Clamps 5V Echo input to safe 3.3V logic level
              </span>
            </div>

            {/* ESP32 Core module container */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md relative">
              <div className="absolute top-1 left-4 text-[9px] font-mono text-slate-500">NODE CORE</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-bold text-slate-100 flex items-center gap-1">
                  <Cpu className="w-4 h-4 text-emerald-400" /> ESP32 SoC
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  WIFI / BLE
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mt-3 text-[9px] font-mono text-slate-400">
                <div className="bg-slate-800 p-1 rounded text-center border border-slate-700">G5 (Trig)</div>
                <div className="bg-slate-800 p-1 rounded text-center border border-slate-700">G18 (Echo)</div>
                <div className="bg-slate-800 p-1 rounded text-center border border-slate-700">G34 (MQ)</div>
                <div className="bg-slate-800 p-1 rounded text-center border border-slate-700">G23 (Buzz)</div>
              </div>
            </div>

            {/* MQ-135 Odor block */}
            <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                💨 MQ-135 (Odor Gas)
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-mono">
                VCC | GND | A0
              </span>
            </div>

            {/* Buzzer Block */}
            <div className="p-2.5 bg-white rounded-xl border border-rose-200 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                🚨 Piezo Alarm Buzzer + LED
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono">
                GPIO 23 / 4
              </span>
            </div>

          </div>
        </div>

        {/* Right Side: Connections Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3">ESP32 Pin</th>
                  <th className="p-3">Component Target</th>
                  <th className="p-3">Wire</th>
                  <th className="p-3">Pin Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {wiringData.map((wire, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedWire(selectedWire === idx ? null : idx)}
                    className={`cursor-pointer transition-colors ${
                      selectedWire === idx
                        ? 'bg-blue-50/50 font-medium'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-slate-900">{wire.fromPin}</td>
                    <td className="p-3">{wire.toComponent} ({wire.toPin})</td>
                    <td className="p-3 font-mono text-[11px]">{wire.wireColor}</td>
                    <td className="p-3 text-slate-500">{wire.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Wire Troubleshooting Insights */}
          <div className="bg-slate-950 text-slate-100 rounded-xl p-5 border border-slate-900 relative">
            <div className="absolute top-4 right-4 text-emerald-400">
              <Info className="w-4 h-4 animate-bounce" />
            </div>

            {selectedWire !== null ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2.5"
              >
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-mono tracking-widest font-bold">
                  PIN TARGET DETAILED GUIDE
                </span>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">
                  Connecting {wiringData[selectedWire].fromPin} ➔ {wiringData[selectedWire].toComponent} ({wiringData[selectedWire].toPin})
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {wiringData[selectedWire].criticalInfo}
                </p>
                <div className="pt-2 bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Always power down your ESP32 board before handling interconnect wiring changes.</span>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400">
                  Select any row in the table above to reveal hardware protection tactics, resistor sizing details, and analog signal calibration guides.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
