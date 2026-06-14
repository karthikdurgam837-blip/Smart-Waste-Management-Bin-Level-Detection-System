/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Truck, Calendar, FileDown, Download, AlertOctagon, CheckCircle2, ChevronRight, Activity, Trash, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BinNode, BinLog } from '../types';

interface DashboardProps {
  nodes: BinNode[];
  selectedNode: BinNode;
  onSelectNode: (node: BinNode) => void;
  logs: BinLog[];
  onEmptyNode: (nodeId: string) => void;
  onClearLogs: () => void;
}

export default function Dashboard({ nodes, selectedNode, onSelectNode, logs, onEmptyNode, onClearLogs }: DashboardProps) {
  const [clearingState, setClearingState] = useState<string | null>(null);

  // Derive global counters
  const totalBinsCount = nodes.length;
  const criticalCount = nodes.filter(b => (b.currentFillCm / b.binHeightCm * 100) >= 80).length;
  const standardCount = nodes.filter(b => (b.currentFillCm / b.binHeightCm * 100) < 80).length;

  // Average Fill Rate
  const averageFillPercent = Math.round(
    nodes.reduce((acc, curr) => acc + (curr.currentFillCm / curr.binHeightCm * 100), 0) / totalBinsCount
  );

  // Dispatch Clearance Truck simulator
  const handleDispatchTruck = (nodeId: string, nodeName: string) => {
    setClearingState(nodeId);
    setTimeout(() => {
      onEmptyNode(nodeId);
      setClearingState(null);
    }, 2000);
  };

  // CSV Exporter
  const exportToCSV = () => {
    const headers = 'ID,Timestamp,Location Node,Empty Space Gap (cm),Fill Level (%),Temp (C),Odor (PPM),Status,Critical Alarm Activated\n';
    const rows = logs.map(l => 
      `"${l.id}","${l.timestamp}","${l.nodeName}",${l.distanceCm},${l.fillPercent},${l.tempCelsius},${l.gasPpm},"${l.status}","${l.alertTriggered ? 'YES' : 'NO'}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartBin_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a mock summary printable report window
  const printDetailedReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups to see the printable Audit Report.');
      return;
    }

    const compiledRows = logs.map(l => `
      <tr>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; font-family: monospace;">${l.timestamp}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">${l.nodeName}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center;">${l.distanceCm} cm</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center; color: ${l.fillPercent >= 80 ? 'red' : 'green'};">${l.fillPercent}%</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center;">${l.tempCelsius}°C</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center;">${l.gasPpm} PPM</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd; text-align: center;">
          <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: ${l.fillPercent >= 80 ? '#fee2e2' : '#ecfdf5'};">
            ${l.status}
          </span>
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Smart Waste Management System | Academic Audit Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
            h1 { color: #0f172a; margin-bottom: 4px; }
            .meta { color: #64748b; font-size: 13px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #f1f5f9; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 12px; font-weight: bold; text-transform: uppercase; text-align: left; }
            .card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #fafafa; }
            .card h3 { margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; }
            .card p { margin: 5px 0 0 0; font-size: 22px; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <h1>IoT Smart Bin Registry & Clearance Log Audit</h1>
          <div class="meta">
            Academic Coursework Submission File &middot; Generated On: ${new Date().toLocaleString()} &middot; Operator Email: karthikdurgam837@gmail.com
          </div>

          <div class="card-grid">
            <div class="card">
              <h3>Total Monitored Nodes</h3>
              <p>${totalBinsCount}</p>
            </div>
            <div class="card">
              <h3>Avg Network Fill Rate</h3>
              <p>${averageFillPercent}%</p>
            </div>
            <div class="card">
              <h3>Critical Bins (&gt;80%)</h3>
              <p style="color: red;">${criticalCount}</p>
            </div>
            <div class="card">
              <h3>Healthy Bins</h3>
              <p style="color: green;">${standardCount}</p>
            </div>
          </div>

          <h2>Telemetry State & Backlog</h2>
          <table>
            <thead>
              <tr>
                <th style="padding: 8px;">Timestamp</th>
                <th style="padding: 8px;">Bin Location</th>
                <th style="padding: 8px; text-align: center;">Distance (Empty Gap)</th>
                <th style="padding: 8px; text-align: center;">Fill level</th>
                <th style="padding: 8px; text-align: center;">Heat Telemetry</th>
                <th style="padding: 8px; text-align: center;">Odor Density</th>
                <th style="padding: 8px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${compiledRows.length > 0 ? compiledRows : '<tr><td colspan="7" style="text-align:center; padding: 20px;">No telemetry records yet. Move the sliders to test.</td></tr>'}
            </tbody>
          </table>

          <div style="margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center;">
            Smart Waste Management & Bin Level Detection System &copy; 2026. All rights reserved.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6" id="dashboard_panel">
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bins</h4>
            <p className="text-xl font-extrabold text-slate-800">{totalBinsCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Fill Rate</h4>
            <p className="text-xl font-extrabold text-slate-800">{averageFillPercent}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className={`p-3 rounded-lg ${criticalCount > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alert Zones</h4>
            <p className={`text-xl font-extrabold ${criticalCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {criticalCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Operator status</h4>
            <p className="text-sm font-semibold text-slate-700 leading-tight">Dynamic Dispatch</p>
          </div>
        </div>

      </div>

      {/* Primary Section Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Map & List Node Select (Column LHS) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Node Selector Cards */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
              <span>📍 IoT Nodes Registry</span>
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-3">
              {nodes.map((node) => {
                const fillPct = Math.round((node.currentFillCm / node.binHeightCm) * 100);
                const isFull = fillPct >= 80;
                const isOrganicDanger = node.tempCelsius >= 55;

                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectNode(node)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      selectedNode.id === node.id
                        ? 'border-indigo-600 bg-indigo-50/20 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{node.name}</span>
                      {isFull && <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{node.location}</span>

                    <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center w-full">
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          fillPct >= 80 ? 'bg-red-500' : fillPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="font-mono text-xs font-bold text-slate-700">{fillPct}%</span>
                      </div>
                      
                      {isOrganicDanger && (
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Vector Campus Visualization */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" /> Campus Smart Map
              </h3>
              <span className="text-[10px] font-mono text-slate-400">SELECT TO RE-FOCUS SIMULATOR</span>
            </div>

            {/* Scaled SVG Campus Layout */}
            <div className="relative w-full aspect-video md:aspect-[3/2] bg-slate-55 rounded-xl border border-slate-100 overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4">
              
              {/* Dynamic Map graphics overlay */}
              <svg className="absolute inset-0 w-full h-full text-slate-200 select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Simulated streets / paths */}
                <path d="M 0,100 L 800,100" stroke="#f1f5f9" strokeWidth="24" fill="none" />
                <path d="M 120,0 L 120,400" stroke="#f1f5f9" strokeWidth="20" fill="none" />
                <path d="M 400,0 L 400,400" stroke="#f1f5f9" strokeWidth="24" fill="none" />
                {/* Landmarks labels */}
                <text x="50" y="80" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">CAFETERIA RING</text>
                <text x="415" y="40" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">ADMIN BLOCK</text>
                <text x="20" y="280" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">STUDENT DORMITORY</text>
              </svg>

              {/* Graphic Trucks or clearing vehicle indicator popping on active dispatch */}
              <AnimatePresence>
                {clearingState && (
                  <motion.div
                    className="absolute z-30 bg-slate-900 border border-slate-800 text-emerald-400 p-2.5 rounded-lg flex items-center gap-1 text-xs font-mono font-bold shadow-lg"
                    initial={{ x: -100, y: 100, opacity: 0 }}
                    animate={{ x: 20, y: 20, opacity: 1 }}
                    exit={{ x: 300, y: -50, opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  >
                    <Truck className="w-4 h-4 animate-bounce" />
                    <span>Dynamic Sweeper Enroute...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bins on the map */}
              <div className="absolute inset-0 z-10">
                {nodes.map((node) => {
                  const fillPct = Math.round((node.currentFillCm / node.binHeightCm) * 100);
                  const isFull = fillPct >= 80;
                  
                  // Position relative coordinates
                  const topPct = node.lat; // as percentage
                  const leftPct = node.lng;

                  return (
                    <button
                      key={node.id}
                      onClick={() => onSelectNode(node)}
                      className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none focus:outline-none"
                      style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                    >
                      {/* Pulsing glow if alert is triggered */}
                      {isFull && (
                        <span className="absolute -inset-4 rounded-full bg-red-500/30 animate-ping block" style={{ animationDuration: '1.5s' }} />
                      )}
                      
                      <div className={`p-2 rounded-full border shadow-md flex items-center justify-center transition-all ${
                        selectedNode.id === node.id
                          ? 'bg-slate-900 border-indigo-500 scale-125 z-20 text-white'
                          : isFull
                          ? 'bg-red-50 border-red-300 text-red-600'
                          : fillPct >= 50
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>

                      {/* Micro hover label */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xs">
                        {node.name}: {fillPct}%
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs p-2 rounded-lg border border-slate-100 text-[9px] font-sans text-slate-500 space-y-1 z-20 shadow-xs leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600 block" />
                  <span>Healthy (&lt;50%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600 block" />
                  <span>Half-Full (50%-80%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500 animate-pulse block" />
                  <span>Alert Zone (&gt;80%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Real-time Cloud Telemetry Streams & Log Panel (Column RHS) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Overfill Dispatcher Box */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
              <span>🚨 Critical Sweeper Dispatch panel</span>
            </h3>

            {criticalCount === 0 ? (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center flex flex-col items-center">
                <span className="text-xl">🎉</span>
                <h4 className="text-xs font-bold text-emerald-800 mt-1">All bins are safe!</h4>
                <p className="text-[11px] text-emerald-600 mt-1">No dynamic dispatch or scheduling clearings are needed at this moment.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {nodes.filter(n => (n.currentFillCm / n.binHeightCm * 100) >= 80).map((node) => {
                  const pct = Math.round((node.currentFillCm / node.binHeightCm) * 100);
                  const isClearing = clearingState === node.id;

                  return (
                    <div key={node.id} className="p-3 bg-red-50/30 rounded-xl border border-red-100/70 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{node.name}</span>
                        <span className="text-[10px] text-red-600 font-bold mb-1 font-mono">Fill: {pct}% | Gas: {node.gasPpm} PPM</span>
                        <span className="text-[9px] text-slate-400">{node.location}</span>
                      </div>
                      
                      <button
                        onClick={() => handleDispatchTruck(node.id, node.name)}
                        disabled={isClearing}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold select-none flex items-center gap-1 transition-all ${
                          isClearing
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {isClearing ? 'Dispatching...' : 'Clear Bin'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Audit telemetry export console */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col flex-1">
            <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" /> Audit Log Console
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Continuous telemetry backlog of simulated edge nodes</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={exportToCSV}
                  disabled={logs.length === 0}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none"
                  title="Export telemetry database to CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={printDetailedReport}
                  disabled={logs.length === 0}
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer select-none"
                  title="Publish printable academic audit report PDF"
                >
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Live Table Logging */}
            <div className="flex-1 overflow-y-auto max-h-[280px] text-xs font-mono space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  ⚡ Move the simulation sliders to trigger data acquisition and register logging sequences.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {logs.map((log) => (
                    <div key={log.id} className="p-2 rounded bg-slate-50 border border-slate-100 text-[10px] flex justify-between items-start leading-tight">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-sans">{log.timestamp}</span>
                        <span className="font-bold text-slate-800">{log.nodeName}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">
                          Temp: {log.tempCelsius}°C | Gas: {log.gasPpm} PPM | Dist: {log.distanceCm} cm
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          log.fillPercent >= 80
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {log.fillPercent}% Fill
                        </span>
                        <div className="text-[8px] text-slate-400 mt-1 uppercase tracking-wider">{log.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {logs.length > 0 && (
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-right">
                <button
                  onClick={onClearLogs}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 select-none flex items-center justify-end gap-1 ml-auto"
                >
                  <Trash className="w-3.5 h-3.5" /> Wipe Log Book
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
