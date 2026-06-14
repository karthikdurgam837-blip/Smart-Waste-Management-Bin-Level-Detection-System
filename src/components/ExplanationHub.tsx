/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Cpu, Database, Activity, GitCommit, HelpCircle, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ExplanationHub() {
  const [activeTab, setActiveTab] = useState<'problem' | 'how_it_works' | 'relevance'>('problem');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8" id="explanation_hub">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Conceptual Blueprint
          </span>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Smart Waste System Pedagogy</h2>
          <p className="text-sm text-slate-500">Comprehensive educational overview for academic assessment and presentation</p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'problem'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            The Problem & Impact
          </button>
          <button
            onClick={() => setActiveTab('how_it_works')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'how_it_works'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            IoT Architecture
          </button>
          <button
            onClick={() => setActiveTab('relevance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'relevance'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Industry Alignment
          </button>
        </div>
      </div>

      {activeTab === 'problem' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
              <h3 className="text-base font-semibold text-rose-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 block"></span>
                The Traditional Waste Inefficiency
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Static Route Scheduling:</strong> Trucks clear bins on fixed timers regardless of true fill level. Half-empty bins waste vehicle wear and employee hours, while overflow incidents trigger disease vector breeding.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Excess Carbon Footprint:</strong> Continuous driving of heavy-duty waste management trucks generates excessive diesel fumes, worsening urban environmental strain.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>Zero Predictive Capability:</strong> Lack of historical trend data prevents optimization of bin counts during high-impact localized social gatherings or seasons.</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 block"></span>
                Our Engineered IoT Solution
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Dynamic Dynamic Pickups:</strong> Authorities dispatch sanitation vehicles ONLY when bins cross strict filled configurations (e.g., &gt; 80%), maximizing labor force utility.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Real-Time Environmental Hygiene:</strong> Immediate alarm alerts warn staff before bin debris spills onto campus streets, preserving health compliance.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Carbon and Cost Minimization:</strong> Intelligent route plotting reduces fleet fuel expenditure and wear metrics by 25% to 35%, supporting ESG principles.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">A Student-Proof Key Takeaway</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              This system acts as a perfect embodiment of <strong>End-To-End IoT Engineering</strong>. It demonstrates physical sensor data acquisition (Ultrasonic Echoes), localized edge processing (microcontroller time-to-distance mathematics), data transportation protocols (Wi-Fi, HTTP, or MQTT Brokers), cloud telemetry logging, and direct action triggers (alarms and reports).
            </p>
          </div>
        </motion.div>
      )}

      {activeTab === 'how_it_works' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Functional Flow Chart */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4 text-center">IoT System Signal & Processing Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              {[
                { step: '1', title: 'Ultrasonic Emission', desc: 'HC-SR04 Trigger is pulsed via 10µs signal firing 40kHz sound waves.', icon: ShieldCheck, color: 'border-blue-200 bg-blue-50 text-blue-700' },
                { step: '2', title: 'Echo Duration', desc: 'Echo pin transitions HIGH during flight time. Microcontroller measures duration.', icon: Activity, color: 'border-orange-200 bg-orange-50 text-orange-700' },
                { step: '3', title: 'Edge Calculate', desc: 'ESP32 computes distance = (duration * 0.0343) / 2 and infers Fill %.', icon: Cpu, color: 'border-violet-200 bg-violet-50 text-violet-700' },
                { step: '4', title: 'Edge Alerts', desc: 'Compares level to 80% threshold. Fires local Buzzer and LED state if full.', icon: Leaf, color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
                { step: '5', title: 'MQTT Publish', desc: 'Encodes data to JSON payload and publishes to MQTT Broker or ThingSpeak.', icon: Database, color: 'border-violet-200 bg-purple-50 text-purple-700' },
                { step: '6', title: 'Cloud Dashboard', desc: 'Municipal servers receive payload, compile charts, dispatch notifications.', icon: GitCommit, color: 'border-rose-200 bg-rose-50 text-rose-700' }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col items-center p-3 rounded-xl border ${item.color} shadow-xs relative`}>
                  <div className="absolute top-2 left-2 w-5 h-5 bg-white border border-slate-200 flex items-center justify-center rounded-full text-[10px] font-bold text-slate-600">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 my-1" />
                  <h4 className="text-xs font-bold mt-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Distance Conversion Physics</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Since sound travels at <strong>343 meters per second</strong> under standard ambient temperature conditions, the velocity of the sound wave can be formalized as:
              </p>
              <div className="bg-slate-800/90 text-emerald-400 p-3 rounded-lg text-xs font-mono text-center mb-3">
                Velocity = 343 m/s = 0.0343 cm/µs
                <br />
                Distance (One Way) = (Time of Flight * 0.0343) / 2
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The division by 2 is critical because the sonic pulse has to travel to the surface of the trash, bounce, and return back to the receiver, doubling the net elapsed time.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Fill Level Conversion Formula</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Assuming a static known bin installation height (e.g., 30cm or 50cm deep empty configuration), the volume calculation proceeds downwards:
              </p>
              <div className="bg-slate-800/90 text-emerald-400 p-3 rounded-lg text-xs font-mono text-center mb-3">
                Fill Level = (Height - Distance) / Height * 100
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                For example, if the sensor reads an empty depth of 10cm on a 50cm tall bin, this implies the waste is 40cm high, translating directly to an <strong>80% Fill Status</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'relevance' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="text-sm text-slate-600 leading-relaxed">
            Smart waste systems represent a major standard of industrial automation. Understanding how diverse markets monetize this technology is invaluable for academic evaluations and design defenses.
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Smart Campuses', desc: 'Institutions utilize these installations near student cafeterias and student housing, ensuring visual neatness and pest reductions without requiring frequent facility labor sweeping.' },
              { title: 'Airports & Terminals', desc: 'High-density hubs locate transponders in rest stops and food rings. Alerts prioritize rapid cleaning schedules, keeping user approval scores high.' },
              { title: 'Municipal Smart Cities', desc: 'Municipalities coordinate large-scale networks with visual GPS maps. Rubbish trucks adapt schedules and only navigate to red triggers, saving immense diesel budgets.' },
              { title: 'Railway/MRT Hubs', desc: 'Stations map high passenger density spikes. Early predictions alert on-station sweepers before garbage can block passenger turnstiles or egress routes.' },
              { title: 'Malls & Retail Parks', desc: 'Malls deploy customized indoor enclosures. Fast alerting routes store attendants to maintain prestige and keep common spaces pleasant.' },
              { title: 'Logistics Complexes', desc: 'Waste brokers lease bins with levels, ensuring collections happen only on optimal container weight capacities to boost logistical revenues.' }
            ].map((facility, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all">
                <h4 className="text-sm font-bold text-slate-800 mb-1.5">{facility.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{facility.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Pioneers In Industry</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Companies including <strong>Bigbelly (US)</strong>, <strong>Enevo (Finland)</strong>, and <strong>Ecube Labs (S. Korea)</strong> dominate this global market. Highlighting these corporate names in your presentations demonstrates that your academic IoT build represents a real operational enterprise framework!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
