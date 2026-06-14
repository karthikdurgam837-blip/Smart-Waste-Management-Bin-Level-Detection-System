/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star, Award, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionData } from '../types';

export default function InterviewPrep() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [studentResponse, setStudentResponse] = useState<string>('');
  const [testNodeIdx, setTestNodeIdx] = useState<number>(0);
  const [matchPercentage, setMatchPercentage] = useState<number>(0);

  const interviewQuestions: QuestionData[] = [
    {
      id: 1,
      question: "Explain your Smart Waste Management & Bin Level Detection System project.",
      answer: "I designed and deployed an end-to-end IoT system that continuously monitors rubbish bin fill rates. Its edge node consists of an ESP32 microcontroller paired with an HC-SR04 ultrasonic sensor situated under the bin lid pointing downwards. The distance to the refuse surface is resolved through ultra-short acoustic flight pulses. The node calculates volume percentages and publishes JSON payloads over HTTP or MQTT to clean cloud dashboards (visualized on a mock university campus map). Elevated overfill thresholds automatically route alert notifications to sanitation workers, while optimizing truck-dispatching logic to slash fleet operation overheads.",
      evaluationKeywords: ["ultrasonic", "esp32", "fill rate", "distance", "dashboard", "alert", "route"],
      tips: "Break this down into the classic IoT trifecta: Sensing (HC-SR04), Computation (ESP32 calculations), and Cloud Transport (MQTT to dashboards)."
    },
    {
      id: 2,
      question: "What problem does this project solve for modern smart cities?",
      answer: "It resolves the extreme economic and ecological waste of static collection routes. Traditionally, municipal trucks clear waste scheduled on fixed clocks. This means they routinely service empty bins (burning high-cost diesel fuel and causing urban traffic) or arrive too late to find trash spilling onto streets, attracting disease vectors. Dynamic level tracking allows data-driven routing, clearing only bins exceeding 80% capacity.",
      evaluationKeywords: ["static", "optimizing", "fuel", "hygiene", "spill", "dynamic routing"],
      tips: "Discuss fuel savings (around 25-30% reduction), labor efficiency, and real-time public hygiene compliance."
    },
    {
      id: 3,
      question: "Which sensory array is deployed for level assessment, and what are its physical principles?",
      answer: "The primary sensor is the HC-SR04 Ultrasonic Sensor. It operates on the 'Time-of-Flight' (TOF) principle. The module emits an ultrasonic trigger burst at 40kHz, which travels through the blank space within the bin, hits the solid trash obstacle, and bounces back to the receiver module. The elapsed time of this flight corresponds directly to the total roundtrip distance.",
      evaluationKeywords: ["reflection", "time of flight", "echo", "40khz", "burst", "bounce"],
      tips: "Familiarize yourself with the speed of sound: 343 m/s or 0.0343 cm/µs. State clearly that we divide time by 2 to isolate the single-direction path."
    },
    {
      id: 4,
      question: "Why did you use ESP32 instead of a traditional Arduino Uno?",
      answer: "The ESP32 is significantly superior for industrial IoT applications. Firstly, it features native integrated Wi-Fi and Bluetooth Low Energy (BLE), which eliminates the need for expensive outer communication shields. Secondly, its dual-core processor operates up to 240MHz with 520KB SRAM, easily facilitating complex RTOS threading, secure MQTT brokers, and JSON encoder serialization, which would trivially crash an Arduino Uno's memory limit.",
      evaluationKeywords: ["wi-fi", "integrated", "dual-core", "sram", "broker", "power", "ram", "memory"],
      tips: "Mention memory sizes: ESP32 has 520KB RAM vs Uno which has just 2KB of SRAM. Native connectivity is the key!"
    },
    {
      id: 5,
      question: "How is the fill percentage calculated from raw distance?",
      answer: "We establish a fixed baseline parameter representing the total structural depth of the empty bin (e.g., 30cm). The ultrasonic measures the empty air-gap gap. Volume percentage is formulated as: Fill% = ((Bin Height - Measured Air Distance) / Bin Height) * 100. For example: if air distance is 6cm in a 30cm bin, the trash is 24cm high, which equals 80% fill capacity.",
      evaluationKeywords: ["baseline", "height", "formula", "gap", "empty distance", "%", "divided"],
      tips: "Maintain boundary logic in your code to prevent negative calculation dumps if refuse climbs above the physical sensor."
    },
    {
      id: 6,
      question: "What output logs and notification alarms are generated?",
      answer: "Our system emits multiple reactive vectors. Locally, the ESP32 activates red LEDs and fires a piezo alarm buzzer to warn walk-by users. Remotely, MQTT packages push alerts directly to dispatch panels. Log records capture timestamp data alongside other optional metrics like MQ-135 decomposing sulfur gas indicators to monitor odor decay.",
      evaluationKeywords: ["led", "buzzer", "logs", "gas", "timestamp", "payload", "mqtt"],
      tips: "Highlight that remote alerts protect administrators from having to stand directly next to bins to notice fill updates."
    },
    {
      id: 7,
      question: "How does the alert notification threshold work?",
      answer: "We implement software boundary triggers set to 80% or 90% fill rate. When the calculated telemetry exceeds this threshold, the ESP32 skips normal sleep-cycle periods to publish an urgent MQTT warning flag to an alarm channel. The dashboard listens to this channel to flash visual warnings and dispatch collection trucks.",
      evaluationKeywords: ["threshold", "trigger", "alarm", "warning", "80%", "broker", "event"],
      tips: "Discuss software debouncing: to prevent fake spikes (e.g., a tall cup momentarily floating under the light), we take an average of 5 sonar sweeps before triggering the alarm."
    },
    {
      id: 8,
      question: "How does IoT enable real-time dashboard operations?",
      answer: "IoT frameworks establish constant communication pipelines. Rather than manual inspection walking, low-power edge nodes periodically transmit brief payloads over standard Wi-Fi. This eliminates physical inspection, organizing multiple independent nodes onto a single geospatial control map.",
      evaluationKeywords: ["pipeline", "payload", "network", "remote", "geospatial", "transmits"],
      tips: "Reference the benefits of centralized management: coordinates dispatching across large universities, theme parks, or commercial centers."
    },
    {
      id: 9,
      question: "What core engineering challenges did you face?",
      answer: "Calibration was the key obstacle. Unlike flat liquids, solid refuse is highly uneven, causing ultrasonic soundwaves to scatter randomly (sound echoing off angles). We solved this by implementing a software moving-average filter to smooth sudden anomalous spikes. Additionally, protecting the low-voltage ESP32 from the 5V Echo pin of the ultrasonic sensor required a calculated resistor step-down voltage divider.",
      evaluationKeywords: ["calibration", "divider", "scattered", "angle", "voltage", "step-down", "resistor", "average"],
      tips: "Professors love when you discuss practical hardware hurdles, like logic level-shifting or sonar beam reflections!"
    },
    {
      id: 10,
      question: "What are some practical future enhancements for this system?",
      answer: "For real-world deployment scale, I would integrate dedicated GPS receivers for dynamic location mapping. Secondly, implementing solar-harvesting batteries (like a LiFePO4 cell with a TP4056 charge chip) combined with deep-sleep modes would make the node run off-grid indefinitely. Finally, deploying machine-learning route optimization (Dijkstra's or Genetic algorithms) would auto-generate optimal paths for collection trucks.",
      evaluationKeywords: ["gps", "deep-sleep", "solar", "harvesting", "route optimization", "dijkstra", "machine learning"],
      tips: "Fusing GPS tracking, route optimization, and clean solar grids shows incredible advanced IoT architecture competency."
    }
  ];

  // Evaluate Student Response dynamically
  useEffect(() => {
    if (!studentResponse.trim()) {
      setMatchPercentage(0);
      return;
    }

    const currentQ = interviewQuestions[testNodeIdx];
    const rawInput = studentResponse.toLowerCase();
    
    // Check keywords matches
    let matchCount = 0;
    currentQ.evaluationKeywords.forEach(word => {
      if (rawInput.includes(word.toLowerCase())) {
        matchCount++;
      }
    });

    const percent = Math.round((matchCount / currentQ.evaluationKeywords.length) * 100);
    setMatchPercentage(percent);
  }, [studentResponse, testNodeIdx]);

  const selectTestQuestion = (idx: number) => {
    setTestNodeIdx(idx);
    setStudentResponse('');
    setMatchPercentage(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8" id="interview_viva_module">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <Award className="w-3.5 h-3.5 animate-bounce" /> Viva Vocale Examiner
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Interview & Placement Coach</h2>
          <p className="text-xs text-slate-500">Perfect your project defenses and audit your confidence levels through dynamic keywords scoring</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 10 Expandable Questions */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5">
            📋 Top 10 Technical Placement Questions
          </h3>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {interviewQuestions.map((q, idx) => {
              const isSelected = selectedQuestion === idx;
              return (
                <div key={q.id} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/40">
                  <button
                    onClick={() => setSelectedQuestion(isSelected ? null : idx)}
                    className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 pr-4">
                      <span className="text-xs font-bold text-indigo-600 font-mono mt-0.5">Q{q.id}.</span>
                      <span className="text-xs font-bold text-slate-800 leading-normal">{q.question}</span>
                    </div>
                    {isSelected ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-slate-50/70 border-t border-slate-100 p-4 space-y-3"
                      >
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-600 block mb-1">Expert Answer Score Card</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{q.answer}</p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-3.5 pt-3.5 border-t border-slate-200/50">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-indigo-500 block mb-1">Key scoring terms</span>
                            <div className="flex flex-wrap gap-1">
                              {q.evaluationKeywords.map((k, kIdx) => (
                                <span key={kIdx} className="bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold text-indigo-700">
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-100 text-[10px] leading-relaxed text-yellow-800">
                            <span className="font-bold block text-[9px] mb-0.5">💡 Prof's Tip:</span>
                            {q.tips}
                          </div>
                        </div>

                        <div className="pt-2 text-right">
                          <button
                            onClick={() => selectTestQuestion(idx)}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold select-none transition-all inline-flex items-center gap-1"
                          >
                            <Search className="w-3 h-3" /> Practice This Question
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Mock Quiz Viva Machine */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-850 flex flex-col justify-between self-stretch h-full min-h-[440px]">
          <div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 mb-4">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">MOCK ASSESSMENT TERMINAL</span>
              <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold">VIRTUAL EXAMINER</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-indigo-400 block mb-1 font-mono">SELECTED QUESTION TO PRACTICE</span>
                <h4 className="text-xs font-bold text-white leading-normal font-sans">
                  Q{interviewQuestions[testNodeIdx].id}. {interviewQuestions[testNodeIdx].question}
                </h4>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1.5 font-mono">TYPE YOUR VIVA RESPONSE</label>
                <textarea
                  value={studentResponse}
                  onChange={(e) => setStudentResponse(e.target.value)}
                  placeholder="Insert key technical arguments here... E.g. ESP32 has integrated Wi-Fi and utilizes Time-of-flight HC-SR04 ultrasonic signals to calculate fill capacity levels..."
                  className="w-full h-[120px] bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed placeholder:text-slate-600 placeholder:text-xs"
                />
              </div>

              {/* Dynamic Analysis metric */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">SCORING ACCURACY:</span>
                  <span className={`font-mono font-extrabold ${matchPercentage >= 70 ? 'text-emerald-400' : matchPercentage >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {matchPercentage}% CONFIDENCE
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${matchPercentage >= 70 ? 'bg-emerald-400' : matchPercentage >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    style={{ width: `${matchPercentage}%` }}
                    animate={{ width: `${matchPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Score breakdown alerts */}
                <div className="text-[10px] text-slate-500 leading-normal pr-1 font-mono">
                  {matchPercentage >= 75 ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> High-impact vocabulary recognized! Perfectly prepared for top scores.
                    </span>
                  ) : matchPercentage >= 40 ? (
                    <span className="text-amber-300">
                      💡 Good direction! Try adding terms like: {interviewQuestions[testNodeIdx].evaluationKeywords.filter(k => !studentResponse.toLowerCase().includes(k)).slice(0, 3).join(', ')}.
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Include vital project tags (e.g. TOF, HC-SR04, dynamic routing) to boost your credibility score dynamically.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3.5 mt-5">
            <span className="text-[11px] text-slate-400 block font-mono">Viva Vocale Evaluation Checklist:</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 mt-2 font-mono">
              <div className="flex items-center gap-1">✅ <strong>HC-SR04 Sensor</strong></div>
              <div className="flex items-center gap-1">✅ <strong>ESP32 Microchip</strong></div>
              <div className="flex items-center gap-1">✅ <strong>JSON over MQTT</strong></div>
              <div className="flex items-center gap-1">✅ <strong>Deep Sleep modes</strong></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
