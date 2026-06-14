/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Activity, Cpu, Code, Github, Award, Sparkles, AlertTriangle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExplanationHub from './components/ExplanationHub';
import CircuitDiagram from './components/CircuitDiagram';
import Simulator from './components/Simulator';
import Dashboard from './components/Dashboard';
import CodeExporter from './components/CodeExporter';
import GithubHelper from './components/GithubHelper';
import InterviewPrep from './components/InterviewPrep';
import { BinNode, BinLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'control_room' | 'schematic' | 'codes' | 'git' | 'viva'>('control_room');
  
  // Local sound alerts state
  const [localBuzzerMuted, setLocalBuzzerMuted] = useState<boolean>(true);

  // Initialize 3 Simulated Nodes representing key University areas
  const [nodes, setNodes] = useState<BinNode[]>([
    {
      id: 'node1',
      name: 'Cafeteria food Ring',
      location: 'Section A - Main Cafeteria Plaza',
      type: 'Organic',
      binHeightCm: 30,
      currentFillCm: 4.5,
      tempCelsius: 24,
      humidityPercent: 45,
      gasPpm: 50,
      lat: 25,
      lng: 20,
      lastUpdated: new Date().toLocaleString(),
      status: 'Empty'
    },
    {
      id: 'node2',
      name: 'Library plaza Portal',
      location: 'Section B - South Entrance Quad',
      type: 'Recycle',
      binHeightCm: 30,
      currentFillCm: 16.5,
      tempCelsius: 22,
      humidityPercent: 38,
      gasPpm: 95,
      lat: 68,
      lng: 45,
      lastUpdated: new Date().toLocaleString(),
      status: 'Half Full'
    },
    {
      id: 'node3',
      name: 'Admin Block Gate',
      location: 'Section C - Principal Admin Arch',
      type: 'Standard',
      binHeightCm: 30,
      currentFillCm: 25.5,
      tempCelsius: 38,
      humidityPercent: 64,
      gasPpm: 380,
      lat: 48,
      lng: 80,
      lastUpdated: new Date().toLocaleString(),
      status: 'Nearly Full'
    }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node1');
  const [logs, setLogs] = useState<BinLog[]>([
    {
      id: 'log_seed_1',
      timestamp: new Date(Date.now() - 120000).toLocaleString(),
      nodeName: 'Admin Block Gate',
      distanceCm: 4.5,
      fillPercent: 85,
      tempCelsius: 38,
      gasPpm: 380,
      status: 'Nearly Full',
      alertTriggered: true
    },
    {
      id: 'log_seed_2',
      timestamp: new Date(Date.now() - 60000).toLocaleString(),
      nodeName: 'Library plaza Portal',
      distanceCm: 13.5,
      fillPercent: 55,
      tempCelsius: 22,
      gasPpm: 95,
      status: 'Half Full',
      alertTriggered: false
    }
  ]);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Callback to mutate active node factors (sliders, presets)
  const handleUpdateNode = (updatedNode: BinNode) => {
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n));
  };

  // Empty/sweep specific node (Clearance Simulation)
  const handleEmptyNode = (nodeId: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? {
      ...n,
      currentFillCm: 0,
      gasPpm: 20,
      tempCelsius: 20,
      humidityPercent: 35,
      status: 'Empty',
      lastUpdated: new Date().toLocaleString()
    } : n));

    const targetNode = nodes.find(n => n.id === nodeId);
    if (targetNode) {
      // Log clearance action
      const newLog: BinLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        nodeName: targetNode.name,
        distanceCm: targetNode.binHeightCm,
        fillPercent: 0,
        tempCelsius: 20,
        gasPpm: 20,
        status: 'Empty',
        alertTriggered: false
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  // Add automatic or simulated log events
  const handleAddLog = (
    nodeName: string,
    distanceCm: number,
    fillPercent: number,
    temp: number,
    gas: number,
    status: 'Empty' | 'Half Full' | 'Nearly Full' | 'Full',
    alert: boolean
  ) => {
    const newLog: BinLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      nodeName,
      distanceCm,
      fillPercent,
      tempCelsius: temp,
      gasPpm: gas,
      status,
      alertTriggered: alert
    };
    // Restrict logs window size to maximum 30 elements
    setLogs(prev => [newLog, ...prev.slice(0, 29)]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleToggleMute = () => {
    setLocalBuzzerMuted(!localBuzzerMuted);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800" id="main_app_wrapper">
      
      {/* Top Banner Warning alerts if any node is overflowed */}
      <AnimatePresence>
        {nodes.some(n => (n.currentFillCm / n.binHeightCm * 100) >= 80) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-600 text-white font-medium text-xs py-2 px-4 shadow-sm flex items-center justify-between z-50 text-center gap-2 font-mono"
          >
            <div className="flex items-center gap-1.5 mx-auto">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>OVERFILL WARNING ACTIVE: One or more Smart Bins exceed threshold parameters! Clear immediately via the Dispatch Panel.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header / Navigation rail */}
      <header className="bg-white border-b border-slate-250 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <span className="text-xl font-extrabold font-mono">IoT</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                Smart Waste Management System <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-mono">v1.2</span>
              </h1>
              <p className="text-xs text-slate-500">IoT Coursework Project Implementation & Interactive Testing Labs</p>
            </div>
          </div>

          {/* Practical Access Indicators */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono text-slate-400">STUDENT PROFILE</div>
              <div className="text-xs font-bold text-slate-700 leading-none">karthikdurgam837@gmail.com</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              KD
            </div>
          </div>

        </div>

        {/* Dynamic Interactive Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex overflow-x-auto no-scrollbar scroll-smooth select-none">
          {[
            { id: 'control_room', label: 'Operations Control Room', icon: Activity },
            { id: 'blueprint', label: 'Pedagogy & Concepts', icon: Layers },
            { id: 'schematic', label: 'Schematic wiring lab', icon: Cpu },
            { id: 'codes', label: 'Source code blocks', icon: Code },
            { id: 'git', label: 'Portfolio & Git Mentor', icon: Github },
            { id: 'viva', label: 'Mock Viva Prep', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-bold tracking-tight whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-emerald-600 text-emerald-700 font-extrabold bg-emerald-50/10'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        <AnimatePresence mode="wait">
          
          {/* Operations Tab: Simulator & Dashboard Combined Room! */}
          {activeTab === 'control_room' && (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-indigo-500 animate-spin-slow" /> Operations Control Center
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Dual simulation deck: move hardware factors (LHS) and watch cloud monitoring metrics and maps sync live (RHS).</p>
                </div>
                
                {/* Active Focus selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">ACTIVE NODE TARGET:</span>
                  <select
                    value={selectedNodeId}
                    onChange={(e) => setSelectedNodeId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold text-indigo-700 px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                {/* LHS: The physical node Edge Simulator */}
                <div className="lg:col-span-5 h-full">
                  <Simulator
                    selectedNode={activeNode}
                    onUpdateNode={handleUpdateNode}
                    onAddLog={handleAddLog}
                    localBuzzerMuted={localBuzzerMuted}
                    onToggleMute={handleToggleMute}
                  />
                </div>

                {/* RHS: The simulated municipal Central Dashboards & logging exports */}
                <div className="lg:col-span-7 h-full">
                  <Dashboard
                    nodes={nodes}
                    selectedNode={activeNode}
                    onSelectNode={(node) => setSelectedNodeId(node.id)}
                    logs={logs}
                    onEmptyNode={handleEmptyNode}
                    onClearLogs={handleClearLogs}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Blueprint Conceptual Explanation Tab */}
          {activeTab === 'blueprint' && (
            <motion.div
              key="blue"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ExplanationHub />
            </motion.div>
          )}

          {/* Circuit Wiring Lab Tab */}
          {activeTab === 'schematic' && (
            <motion.div
              key="sch"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CircuitDiagram />
            </motion.div>
          )}

          {/* Source Code blocks Tab */}
          {activeTab === 'codes' && (
            <motion.div
              key="cod"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CodeExporter />
            </motion.div>
          )}

          {/* Git mentoring and README creator Tab */}
          {activeTab === 'git' && (
            <motion.div
              key="gittab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GithubHelper />
            </motion.div>
          )}

          {/* Placement Viva preparator Tab */}
          {activeTab === 'viva' && (
            <motion.div
              key="viva"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <InterviewPrep />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Footer credits and information */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
          <p className="font-mono text-slate-500">Smart Waste Management & IoT Bin Level Detection System &middot; Portfolio Proof of Work</p>
          <p>Designed using premium high-contrast light specifications, Web Audio APIs, and customizable markdown compilers.</p>
          <div className="flex justify-center items-center gap-1 text-[11px] text-slate-600 pt-2 border-t border-slate-850 max-w-sm mx-auto">
            <span>Built for Enterprise & Academic Excellence with</span>
            <span className="text-red-500">♥</span>
            <span>for Modern Smart Cities.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
