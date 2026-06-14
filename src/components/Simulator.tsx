/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, RefreshCw, Trash2, ShieldAlert, Cpu, Thermometer, Wind, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BinNode } from '../types';

interface SimulatorProps {
  selectedNode: BinNode;
  onUpdateNode: (updatedNode: BinNode) => void;
  onAddLog: (nodeName: string, distanceCm: number, fillPercent: number, temp: number, gas: number, status: 'Empty' | 'Half Full' | 'Nearly Full' | 'Full', alert: boolean) => void;
  localBuzzerMuted: boolean;
  onToggleMute: () => void;
}

export default function Simulator({ selectedNode, onUpdateNode, onAddLog, localBuzzerMuted, onToggleMute }: SimulatorProps) {
  const lastLoggedRef = useRef<number>(0);

  // Derive levels
  const fillPercent = Math.round((selectedNode.currentFillCm / selectedNode.binHeightCm) * 100);
  const distanceCm = Math.round((selectedNode.binHeightCm - selectedNode.currentFillCm) * 10); // in mm or cm. Let's do cm.
  const distanceCmCorrect = parseFloat((selectedNode.binHeightCm - selectedNode.currentFillCm).toFixed(1));
  
  // Ultrasonic wave logic (speed of sound = 343 m/s = 0.0343 cm/us)
  // Echo Round Trip travel time = (Distance * 2) / 0.0343 
  const timeOfFlightUs = Math.round((distanceCmCorrect * 2) / 0.0343);

  // Status mapping
  let status: 'Empty' | 'Half Full' | 'Nearly Full' | 'Full' = 'Empty';
  if (fillPercent >= 85) status = 'Full';
  else if (fillPercent >= 50) status = 'Nearly Full';
  else if (fillPercent >= 15) status = 'Half Full';

  const isAlertLevel = fillPercent >= 80;

  // Sync state upward whenever details are changed, and throttle logging to prevent drowning
  const handleLevelChange = (newFillCm: number) => {
    const updated = { ...selectedNode };
    updated.currentFillCm = Math.min(updated.binHeightCm, Math.max(0, parseFloat(newFillCm.toFixed(1))));
    updated.status = getStatusFromPercent((updated.currentFillCm / updated.binHeightCm) * 100);
    updated.lastUpdated = new Date().toLocaleString();
    onUpdateNode(updated);
  };

  const getStatusFromPercent = (pct: number): 'Empty' | 'Half Full' | 'Nearly Full' | 'Full' => {
    if (pct >= 85) return 'Full';
    if (pct >= 50) return 'Nearly Full';
    if (pct >= 15) return 'Half Full';
    return 'Empty';
  };

  const handleGasChange = (newGas: number) => {
    const updated = { ...selectedNode, gasPpm: Math.round(newGas), lastUpdated: new Date().toLocaleString() };
    onUpdateNode(updated);
  };

  const handleTempChange = (newTemp: number) => {
    const updated = { ...selectedNode, tempCelsius: Math.round(newTemp), lastUpdated: new Date().toLocaleString() };
    onUpdateNode(updated);
  };

  const handleHumidityChange = (newHum: number) => {
    const updated = { ...selectedNode, humidityPercent: Math.round(newHum), lastUpdated: new Date().toLocaleString() };
    onUpdateNode(updated);
  };

  const dumpTrash = (percent: number) => {
    const addedCm = selectedNode.binHeightCm * (percent / 100);
    handleLevelChange(Math.min(selectedNode.binHeightCm, selectedNode.currentFillCm + addedCm));
  };

  const emptyBin = () => {
    handleLevelChange(0);
  };

  // Push periodic log entries when simulation state stabilizes or changes
  useEffect(() => {
    const now = Date.now();
    if (now - lastLoggedRef.current > 3000) {
      onAddLog(
        selectedNode.name,
        distanceCmCorrect,
        fillPercent,
        selectedNode.tempCelsius,
        selectedNode.gasPpm,
        status,
        isAlertLevel
      );
      lastLoggedRef.current = now;
    }
  }, [fillPercent, selectedNode.tempCelsius, selectedNode.gasPpm]);

  // Audio tone buzzer generation (Web Audio context)
  const buzzerSoundedRef = useRef<boolean>(false);
  useEffect(() => {
    if (isAlertLevel && !localBuzzerMuted && !buzzerSoundedRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // Beep frequency
          gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start();
          
          // Sound an intermittent beep-beep
          setTimeout(() => {
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            setTimeout(() => {
              gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
              setTimeout(() => {
                ctx.close();
              }, 150);
            }, 100);
          }, 150);
        }
      } catch (e) {
        console.error('Audio api muted or blocked by iframe permissions', e);
      }
    }
  }, [fillPercent, localBuzzerMuted]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full" id="simulator_container">
      <div className="mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700">
          <Cpu className="w-3.5 h-3.5" /> Edge Embedded Simulator
        </span>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mt-1">Smart Bin Interactive Physics</h3>
        <p className="text-xs text-slate-500">Manually trigger sensor metrics, test algorithms, and audit cloud synchronization</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* Left Column - Manual Refuse Slider Controls */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Height/Level Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5 text-blue-500" /> Bin Fill Level</span>
                <span className="font-mono text-slate-800 font-bold">{fillPercent}% ({selectedNode.currentFillCm} / {selectedNode.binHeightCm}cm)</span>
              </div>
              <input
                type="range"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-emerald-600 focus:outline-none"
                min="0"
                max={selectedNode.binHeightCm}
                step="0.5"
                value={selectedNode.currentFillCm}
                onChange={(e) => handleLevelChange(parseFloat(e.target.value))}
              />
            </div>

            {/* MQ-135 Odor Gas Slider */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-orange-500" /> Gas Level (MQ-135)</span>
                <span className="font-mono text-slate-800 font-bold">{selectedNode.gasPpm} PPM</span>
              </div>
              <input
                type="range"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-orange-500 focus:outline-none"
                min="20"
                max="800"
                step="10"
                value={selectedNode.gasPpm}
                onChange={(e) => handleGasChange(parseInt(e.target.value))}
              />
            </div>

            {/* Temp & Humidity Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-0.5"><Thermometer className="w-3 h-3 text-red-500" /> Temp</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedNode.tempCelsius}°C</span>
                </div>
                <input
                  type="range"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-red-500 focus:outline-none"
                  min="0"
                  max="80"
                  step="1"
                  value={selectedNode.tempCelsius}
                  onChange={(e) => handleTempChange(parseInt(e.target.value))}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Humidity</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedNode.humidityPercent}%</span>
                </div>
                <input
                  type="range"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-ew-resize accent-blue-500 focus:outline-none"
                  min="10"
                  max="100"
                  step="1"
                  value={selectedNode.humidityPercent}
                  onChange={(e) => handleHumidityChange(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Simulation Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => dumpTrash(15)}
                className="text-left text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 select-none flex items-center gap-1 transition-all"
              >
                🎒 Add Trash +15%
              </button>
              <button
                onClick={() => dumpTrash(40)}
                className="text-left text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 select-none flex items-center gap-1 transition-all"
              >
                📦 Add Trash +40%
              </button>
              <button
                onClick={emptyBin}
                className="text-left text-xs p-1.5 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-700 select-none flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Sweep/Empty 0%
              </button>
              <button
                onClick={() => {
                  handleLevelChange(selectedNode.binHeightCm * 0.9);
                  handleGasChange(650);
                  handleTempChange(62);
                }}
                className="text-left text-xs p-1.5 rounded-lg border border-orange-100 bg-orange-50/50 hover:bg-orange-50 text-orange-800 select-none flex items-center gap-1 transition-all"
              >
                🔥 Hazard State
              </button>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-indigo-900 flex items-center gap-1">
                🔊 Audio Alert Buzzer
              </span>
              <button
                onClick={onToggleMute}
                className={`p-1 rounded-md text-xs transition-colors ${
                  localBuzzerMuted
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {localBuzzerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-indigo-700 leading-normal">
              If active and unmuted, navigating level above 80% fires a localized tone using the Web Audio API, mimicking a real ESP32 piezoelectric buzzer.
            </p>
          </div>
        </div>

        {/* Center Column - Beautiful Smart Bin Graphic Animation */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100 relative overflow-hidden min-h-[300px]">
          
          {/* Ultrasonic Sensor Lid Module */}
          <div className="absolute top-4 w-44 h-5 bg-slate-800 rounded-t-lg flex items-center justify-around px-4 border-b-2 border-slate-900 z-10 shadow-sm">
            <div className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">HC-SR04</div>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-700 flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-700" />
            </div>
          </div>

          {/* Glowing Sonic Output Wave effect */}
          <div className="absolute top-9 left-1/2 -translate-x-1/2 w-32 flex flex-col items-center select-none pointer-events-none z-0">
            <svg width="100" height="240" viewBox="0 0 105 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M10 10 Q50 30 90 10"
                stroke={isAlertLevel ? "rgba(239, 68, 68, 0.45)" : "rgba(34, 197, 94, 0.45)"}
                strokeWidth="2.5"
                fill="none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.9, 0.2], y: [0, 80, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              />
              <motion.path
                d="M15 35 Q50 55 85 35"
                stroke={isAlertLevel ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}
                strokeWidth="2.5"
                fill="none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.8, 0.1], y: [10, 110, 10] }}
                transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
              />
              <motion.path
                d="M20 60 Q50 80 80 60"
                stroke={isAlertLevel ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}
                strokeWidth="2"
                fill="none"
                animate={{ scale: [1, 1.1, 1], opacity: [0, 0.6, 0], y: [20, 140, 20] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Bin Body Outer frame */}
          <div className="w-36 h-48 bg-slate-200/50 rounded-b-3xl border-x-4 border-b-4 border-slate-300 relative top-2 flex flex-col justify-end overflow-hidden z-10 shadow-inner">
            
            {/* Trash Filling Graphic */}
            <motion.div
              className={`w-full rounded-b-2xl relative ${
                selectedNode.tempCelsius >= 55
                  ? 'bg-gradient-to-t from-red-800 to-red-600'
                  : fillPercent >= 80
                  ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                  : fillPercent >= 50
                  ? 'bg-gradient-to-t from-amber-500 to-amber-350'
                  : 'bg-gradient-to-t from-teal-600 to-teal-400'
              }`}
              style={{ height: `${fillPercent}%` }}
              animate={{ height: `${fillPercent}%` }}
              transition={{ type: 'spring', stiffness: 60 }}
            >
              {/* Grid or structural texture inside trash level */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:10px_10px]" />
              
              {/* Organic floaties if MQ135 or temp is aggressive */}
              {selectedNode.gasPpm > 180 && (
                <div className="absolute -top-12 inset-x-0 h-10 flex justify-around select-none">
                  {[1, 2, 3, 4].map((n) => (
                    <motion.div
                      key={n}
                      className="w-2.5 h-2.5 bg-green-500/40 rounded-full blur-xs"
                      animate={{ y: [0, -15, 0], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1.5 + n * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              )}

              {/* Float thermal/fire flame icon if on combustion warning */}
              {selectedNode.tempCelsius >= 55 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-2xl filter drop-shadow-md select-none"
                  >
                    🔥
                  </motion.span>
                </div>
              )}

              {/* Status Text overlay inside the solid fill */}
              {fillPercent > 18 && (
                <div className="absolute top-2 inset-x-0 text-center select-none">
                  <span className="bg-slate-900/45 px-2 py-0.5 rounded-full text-[10px] font-mono text-white tracking-widest font-bold">
                    {fillPercent}% FILL
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* LED indicators on simulated physical side panel */}
          <div className="absolute right-4 top-14 flex flex-col gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700 z-10">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full border border-black/40 ${fillPercent >= 80 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-red-950'}`} />
              <span className="text-[8px] font-mono text-slate-400">FL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full border border-black/40 ${fillPercent >= 50 && fillPercent < 80 ? 'bg-amber-500 animate-pulse-slow shadow-[0_0_8px_#f59e0b]' : 'bg-amber-955'}`} />
              <span className="text-[8px] font-mono text-slate-400">HF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full border border-black/40 ${fillPercent < 50 ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-emerald-950'}`} />
              <span className="text-[8px] font-mono text-slate-400">OK</span>
            </div>
          </div>
          
          {/* Physical local warning buzzer flashing wave */}
          {isAlertLevel && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <span className="w-56 h-56 rounded-full border border-red-500/20 bg-red-400/5 animate-ping block" style={{ animationDuration: '1.4s' }} />
            </div>
          )}
        </div>

        {/* Right Column - Deep Mathematical formulas and conversions running live */}
        <div className="lg:col-span-4 bg-slate-950 text-slate-100 rounded-xl p-5 border border-slate-900 flex flex-col justify-between font-mono">
          <div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 text-[10px] text-slate-400 mb-3">
              <span>VARIABLE TELEMETRY</span>
              <span className="bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">SYSTEM ACTIVE</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Bin Maximum Height:</span>
                <span className="text-slate-200">{selectedNode.binHeightCm} cm</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Measured Trash Surface:</span>
                <span className="text-slate-200">{selectedNode.currentFillCm} cm</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Sonic Space Depth:</span>
                <span className="text-emerald-400 font-bold">{distanceCmCorrect} cm</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Roundtrip Sonic TOF:</span>
                <span className="text-orange-400">{timeOfFlightUs} µs</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">MQ-135 Gas Output:</span>
                <span className={selectedNode.gasPpm > 300 ? "text-red-400 font-bold" : "text-slate-200"}>
                  {selectedNode.gasPpm} PPM
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">DHT Temperature:</span>
                <span className={selectedNode.tempCelsius > 50 ? "text-red-400 font-bold" : "text-slate-200"}>
                  {selectedNode.tempCelsius} °C
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-[10px] text-slate-400 leading-normal">
            <div className="text-emerald-500 font-bold text-[11px] mb-1">LIVE LOGGING CONSOLE LOG</div>
            <div className="bg-black/40 p-2 rounded text-[10px] space-y-1 overflow-y-auto max-h-[85px] leading-tight">
              <div>[SYSTEM] Reading ping triggers from trigger pin 5</div>
              <div>[HC-SR04] Sonic flight echoed back at {timeOfFlightUs} µs</div>
              <div>[CALCULATOR] Computed empty distance: {distanceCmCorrect} cm</div>
              <div>[CALCULATOR] Fill calculation completed: {fillPercent}% fill</div>
              {isAlertLevel && <div className="text-red-400 animate-pulse font-bold">⚠️ [ALARM] Fill exceeds 80% threshold! Dispatch payload!</div>}
              {selectedNode.tempCelsius >= 55 && <div className="text-orange-400 font-bold">⚠️ [HAZARD] Thermal spike detected! Organic decomposition decay warning!</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
