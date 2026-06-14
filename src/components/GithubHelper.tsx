/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitBranch, Github, Copy, Check, Info, FileText, Settings, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function GithubHelper() {
  const [copied, setCopied] = useState(false);
  
  // Custom README parameters
  const [studentName, setStudentName] = useState('Karthik Durgam');
  const [facultyName, setFacultyName] = useState('Dr. Amit Kumar');
  const [courseName, setCourseName] = useState('IoT Laboratory & Microcontrollers (ECE-305)');
  const [collegeName, setCollegeName] = useState('National Institute of Technology');

  const generateMarkdown = () => `# 🗑️ Smart Waste Management & Bin Level Detection System

An advanced, industry-oriented IoT project that automatically monitors garbage bin fill levels using ultrasonic sensors, computes telemetry on local microcontroller nodes, updates cloud dashboards in real time, and fires dynamic alarms to optimize collection routing.

## 🚀 Overview
Traditional municipal waste management suffers from static, blind collection loops where sanitation vehicles visit half-empty bins, wasting substantial labor, fuel, and municipal budget, or miss overflowing bins entirely. 

This project solves this operational bottleneck by placing **HC-SR04 ultrasonic sensors** inside trash bin lids in a network configuration, managed by **ESP32 NodeMCU microcontrollers**. Telemetry is processed on the edge, logged locally, and transmitted via lightweight brokers (**MQTT** or **HTTP**) to cloud platforms (**ThingSpeak / Node-RED / Blynk**) for dashboard visualizations.

---

## 🏷️ Technical Profile
* **Lead Student Researcher:** ${studentName}
* **Project Mentor:** ${facultyName}
* **Coursework Reference:** ${courseName}
* **Institution:** ${collegeName}

---

## 🛠️ Hardware Peripherals
* **Controller:** ESP32 Module (with on-board Wi-Fi and FreeRTOS support)
* **Sonar Array:** HC-SR04 Ultrasonic Transducers
* **Indicators:** Green, Yellow, Red Status LEDs
* **Local Alert Trigger:** Active Piezo Buzzer (880Hz Beep)
* **Sensors (Optional):** MQ-135 Gas/Odor, DHT11 Temperature/Humidity

---

## 🗂️ Proposed Repository Layout
\`\`\`text
Smart-Waste-Management-Bin-Level-Detection-System/
│
├── arduino_code/
│   └── esp32_smart_bin.ino           # ESP32 C++ Production Sketch
│
├── python_simulation/
│   └── virtual_bin_simulator.py      # Standalone Python sandbox sim
│
├── dashboard/
│   └── dashboard_node_red_flow.json  # Node-Red visual flow mapping
│
├── circuit_diagram/
│   └── schematic_design.png          # High-resolution wire scheme
│
├── reports/
│   └── simulated_waste_log.csv       # Telemetry logging output
│
├── requirements.txt                  # Python dependencies
├── main.py                           # Virtual Simulation orchestrator
└── README.md                         # Project documentation
\`\`\`

---

## 📡 Working Principles & Distance Mathematics
The HC-SR04 transducer emits a high-frequency **40kHz sound bubble** which travels downward, bounces off the waste surface, and reflects back to the matching receiver cup.
The ESP32 measures the high level timing pulse ($T$) of the Echo pin:

$$\\text{Distance (cm)} = \\frac{T \\times 0.0343}{2}$$

The volume level is normalized relative to a customizable maximum static installation bin depth ($D$):

$$\\text{Fill Percent (\\%)} = \\frac{D - \\text{Distance}}{D} \\times 100$$

---

## ⚡ Setup & Flashing Instructions

### 1. Arduino IDE ESP32 Setup
1. In Arduino IDE, navigate to \`File -> Preferences -> Additional Board Manager URLs\` and append:
   \`https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json\`
2. Search and install \`ESP32 by Espressif\` in Board Manager.
3. Install the \`PubSubClient\` library by Nick O'Leary.
4. Open the C++ sketch in \`/arduino_code/esp32_smart_bin.ino\`, update your Wi-Fi credentials, and choose \`ESP32 Dev Module\`. Click **Upload**.

### 2. Standalone Python Sandbox
Install dependencies and trigger the offline sandbox logs:
\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

---

## 📊 Cloud Telemetry Preview
* **Fields Configured:**
  * Field 1: Ultrasonic Clearance Gap (cm)
  * Field 2: Net Fill Rate (%)
  * Field 3: Gas Concentration (PPM)
  * Field 4: Thermal decomposition index (°C)
* **Webhook Rules:** If Fill level crosses 80%, fire warnings immediately.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8" id="github_mentor">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white mb-2">
            <Github className="w-3.5 h-3.5" /> Repository Deployment Coach
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">GitHub Upload Strategy</h2>
          <p className="text-xs text-slate-500">Perfect your portfolio index and construct clean markdown metadata readme assets</p>
        </div>
        
        <div className="bg-emerald-50 text-emerald-800 text-xs rounded-lg p-2 max-w-sm flex items-start gap-1.5 border border-emerald-100 font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>This strategy serves to bolster your professional profile for junior developer roles and academic honors.</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left LHS Side: Repository Best Practice Profile */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-150 bg-slate-50/70 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1">
                <GitBranch className="w-4 h-4 text-indigo-600" /> Repository Target Frame
              </h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended Repo Name:</span>
                  <span className="font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 font-semibold block mt-0.5">
                    Smart-Waste-Management-Bin-Level-Detection-System
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Descriptive Repository Description:</span>
                  <span className="text-slate-600 leading-normal block mt-0.5">
                    "ESP32-based Smart Refuse bin utilizing ultrasonic level tracking, MQ-135 sensors, and MQTT. Packed with standalone python sandbox and cloud tracking capabilities."
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Suggested Meta Search Tags:</span>
                  <span className="font-mono text-[10px] text-indigo-700 block mt-0.5 leading-relaxed">
                    #iot-project #esp32-arduino #smart-city #ultrasonic-sensor #thingspeak #python-simulation
                  </span>
                </div>
              </div>
            </div>

            {/* Structured commit plan for student profile */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Git Commit Road-mapping</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-normal">
                <li><code>feat: Initial commit with repository directory outline</code></li>
                <li><code>feat: Add esp32_smart_bin.ino firmware sketch with MQTT</code></li>
                <li><code>feat: Add standalone python telemetry sim logger module</code></li>
                <li><code>docs: Embed system wire connections and telemetry math formulas</code></li>
                <li><code>docs: Ship optimized production READY markdown documentation</code></li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <div className="text-[10px] text-indigo-700 leading-normal font-sans">
              <strong>Professional Tip:</strong> Record a quick 60-second video of this virtual dashboard running, generate a <code>demo.gif</code>, and embed it inside your README! It triples recruiter engagement on your profile!
            </div>
          </div>
        </div>

        {/* Right RHS Side: Automated Interactive README Generator Box */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" /> Custom Student Details Injector
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Project Mentor / Professor</label>
                <input
                  type="text"
                  value={facultyName}
                  onChange={(e) => setFacultyName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-550 mb-1">Course Code & Module Title</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-550 mb-1">University / College Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded-t-xl border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> GENERATED README.MD</span>
              <button
                onClick={handleCopy}
                className="hover:text-white flex items-center gap-1 transition-colors select-none font-bold text-emerald-400"
              >
                {copied ? <Check className="w-3" /> : <Copy className="w-3" />}
                {copied ? 'Copied Markdown!' : 'Copy Code'}
              </button>
            </div>
            <textarea
              readOnly
              value={generateMarkdown()}
              className="w-full h-[180px] bg-slate-950 text-slate-300 border-x border-b border-slate-900 p-4 rounded-b-xl font-mono text-[11px] focus:outline-none resize-none leading-relaxed overflow-y-auto flex-1 h-[210px]"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
