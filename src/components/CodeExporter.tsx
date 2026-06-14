/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cpu, Terminal, Copy, Check, Settings, Info, CloudLightning } from 'lucide-react';
import { motion } from 'motion/react';

export default function CodeExporter() {
  const [activeTab, setActiveTab] = useState<'esp32' | 'python' | 'thingspeak'>('esp32');
  const [copied, setCopied] = useState(false);
  
  // Custom Configuration state
  const [wifiSsid, setWifiSsid] = useState('Home_WiFi_Network');
  const [wifiPass, setWifiPass] = useState('secure_password123');
  const [mqttServer, setMqttServer] = useState('broker.hivemq.com');
  const [binDepth, setBinDepth] = useState('30.0');
  const [threshold, setThreshold] = useState('80');

  const triggerCopy = (codeString: string) => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Automated customizable Arduino script
  const getArduinoCode = () => `/**
 * Smart Waste Management & Bin Level Detection System
 * Target Device: ESP32 NodeMCU DevModule
 * Sensors: HC-SR04 Ultrasonic, MQ-135 Gas Sensors
 * Protocol: JSON over MQTT (TCP 1883)
 * Course: College IoT Capstone IoT Laboratory
 */

#include <WiFi.h>
#include <PubSubClient.h>

// --- USER HARDWARE CONFIGURATION ---
#define TRIG_PIN 5       // Trigger Pin (Output to HC-SR04)
#define ECHO_PIN 18      // Echo Pin (Input from HC-SR04)
#define ANALOG_GAS 34    // MQ-135 Analog Feed (ADC1_CH6)
#define LOCAL_BUZZER 23  // Piezo alarm horn (Active)
#define STATUS_LED 4     // Visual trigger marker LED

const float BIN_DEPTH_CM = ${binDepth}; // Installation height inside lid
const float UPPER_THRESHOLD_PCT = ${threshold}.0; // Solid waste alert percentage

// --- NETWORK CLIENT SETTINGS ---
const char* WIFI_SSID = "${wifiSsid}";
const char* WIFI_PASS = "${wifiPass}";
const char* MQTT_BROKER = "${mqttServer}";
const uint16_t MQTT_PORT = 1883;

// --- MQTT TOPIC REGISTRY ---
const char* TOPIC_DATA  = "smartbin/node1/telemetry";
const char* TOPIC_ALERT = "smartbin/node1/alarm";

WiFiClient espClient;
PubSubClient client(espClient);

void setupWiFi() {
  Serial.print("Connecting to SSID: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\\nWiFi connected securely!");
  Serial.print("Assigned IP Address: ");
  Serial.println(WiFi.localIP());
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection client: ESP32SmartBin...");
    if (client.connect("ESP32SmartBinNode1")) {
      Serial.println("Connected to Broker successfully!");
    } else {
      Serial.print("Failed. State error code: ");
      Serial.print(client.state());
      Serial.println(". Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Set Pin Modes
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LOCAL_BUZZER, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  
  // Initialize peripherals
  digitalWrite(LOCAL_BUZZER, LOW);
  digitalWrite(STATUS_LED, LOW);
  
  setupWiFi();
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // 1. Measure Distance of Garbage surface
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  
  // Speed of sound = 343 m/s = 0.0343 cm/microsecond
  float measuredDistanceCm = (duration * 0.0343) / 2.0;

  // Protect calculations from false range readings
  if (measuredDistanceCm > BIN_DEPTH_CM) {
    measuredDistanceCm = BIN_DEPTH_CM;
  }

  // 2. Compute fill percentage
  float fillPercent = ((BIN_DEPTH_CM - measuredDistanceCm) / BIN_DEPTH_CM) * 100.0;
  if (fillPercent < 0) fillPercent = 0.0;

  // 3. Read MQ-135 local Odor
  int rawGasAdc = analogRead(ANALOG_GAS);
  float mockPpm = map(rawGasAdc, 0, 4095, 20, 1000); // Scale raw reading to mock PPM

  // Print results
  Serial.print("Gap: "); Serial.print(measuredDistanceCm); Serial.print("cm | ");
  Serial.print("Fill: "); Serial.print(fillPercent); Serial.print("% | ");
  Serial.print("Gas: "); Serial.print(mockPpm); Serial.println(" PPM");

  // 4. Verify triggers
  bool hasTriggered = fillPercent >= UPPER_THRESHOLD_PCT;
  if (hasTriggered) {
    // Blast local Piezo warning
    digitalWrite(LOCAL_BUZZER, HIGH);
    digitalWrite(STATUS_LED, HIGH);
    
    // Broadcast immediately over MQTT
    client.publish(TOPIC_ALERT, "{\\"alert\\": true, \\"message\\": \\"⚠️ Bin 1 is almost full! Please schedule pickup.\\"}");
  } else {
    digitalWrite(LOCAL_BUZZER, LOW);
    digitalWrite(STATUS_LED, LOW);
  }

  // 5. Package and publish main payload
  char payload[180];
  snprintf(payload, sizeof(payload), 
           "{\\"depth_gap_cm\\":%.2f,\\"fill_pct\\":%.1f,\\"odor_ppm\\":%.0f,\\"alarm_status\\":%s}",
           measuredDistanceCm, fillPercent, mockPpm, hasTriggered ? "true" : "false");
           
  client.publish(TOPIC_DATA, payload);
  Serial.println("Payload published to server.");

  // Idle for telemetry cycle (5 seconds)
  delay(5000);
}`;

  // Automated customizable Python Script
  const getPythonCode = () => `import time
import random
import json
import csv
from datetime import datetime
import paho.mqtt.client as mqtt

# --- CONFIGURATION PROFILE ---
MQTT_BROKER = "${mqttServer}"
MQTT_PORT = 1883
TOPIC_DATA = "smartbin/node1/telemetry"
TOPIC_ALERT = "smartbin/node1/alarm"
BIN_HEIGHT = ${binDepth}
ALERT_THRESHOLD_PCT = ${threshold}

csv_filename = "simulated_waste_log.csv"

# Write CSV Headers initially
with open(csv_filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Timestamp", "Measured Distance (cm)", "Fill Percentage (%)", "Odor (PPM)", "Alert Triggered"])

print("Connecting to MQTT broker:", MQTT_BROKER)
client = mqtt.Client()

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    print("Broker Handshake Completed!")
except Exception as e:
    print("Failed to bind broker:", e)
    print("Simulation running in offline-logger mode.")

# Maintain virtual bin state
current_fill_cm = 2.0  # starts empty

print("\\nStarting Standalone Virtual IoT Smart Bin Sandbox...")
print("To dump trash, let the code run. It will increase refuse dynamically.")

try:
    while True:
        # Simulate randomized student dump interaction
        current_fill_cm += random.uniform(0.1, 3.5)
        if current_fill_cm > BIN_HEIGHT:
            current_fill_cm = BIN_HEIGHT # Clamps at max height

        raw_distance = BIN_HEIGHT - current_fill_cm
        fill_percentage = round((current_fill_cm / BIN_HEIGHT) * 100, 1)
        mock_odor = round(random.uniform(20.0, 45.0) + (fill_percentage * 6.5)) # odor scales matching decay

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        is_alert = fill_percentage >= ALERT_THRESHOLD_PCT

        # Prepare JSON packet
        payload = {
            "timestamp": timestamp,
            "measured_distance_cm": round(raw_distance, 2),
            "fill_percentage": fill_percentage,
            "odor_ppm": mock_odor,
            "alert": is_alert
        }

        # 1. Log to Local CSV Database File
        try:
            with open(csv_filename, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([timestamp, round(raw_distance, 2), fill_percentage, mock_odor, "YES" if is_alert else "NO"])
        except Exception as csv_err:
            print("CSV Write fail:", csv_err)

        # 2. Transmit packet over MQTT
        try:
            client.publish(TOPIC_DATA, json.dumps(payload))
            if is_alert:
                client.publish(TOPIC_ALERT, f"⚠️ WARNING: Node 1 has reached {fill_percentage}% fill capacity!")
        except Exception as mqtt_err:
            pass

        print(f"[{timestamp}] Telemetry -> Dist: {round(raw_distance, 1)}cm | Fill: {fill_percentage}% | Odor: {mock_odor}PPM | Alarm: {is_alert}")
        
        # Quick simulation tick - 3 seconds
        time.sleep(3)

except KeyboardInterrupt:
    print("\\nSimulation terminated cleanly by user.")
`;

  const getThingSpeakGuide = () => `Setup & Integration Guide for ThingSpeak Cloud IoT:

1. Create a free account at https://thingspeak.com
2. Click "Channels" -> "My Channels" -> "New Channel"
3. Configure the list fields as follows:
   - Field 1: Distance (cm)
   - Field 2: Fill Percentage (%)
   - Field 3: Gas/Odor (PPM)
   - Field 4: Temperature (°C)
4. Save the Channel to generate your unique "Write API Key"
5. Integrate with ESP32 or Python using standard HTTP POST requests:
   
   Endpoint: http://api.thingspeak.com/update
   Query Format:
   http://api.thingspeak.com/update?api_key=YOUR_WRITE_KEY&field1=GAP&field2=PERCENT&field3=GAS&field4=TEMP`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8" id="code_source_exporter">
      
      {/* Parameter Configuration panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Settings className="w-4 h-4 text-indigo-600 animate-spin-slow" /> Config Parameters Dynamic Injector
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Type your SSID and target thresholds below. The code blocks update recursively! When you copy or review, it matches your network variables instantly.
        </p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Wi-Fi SSID</label>
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Wi-Fi Password</label>
            <input
              type="text"
              value={wifiPass}
              onChange={(e) => setWifiPass(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Broker Address</label>
            <input
              type="text"
              value={mqttServer}
              onChange={(e) => setMqttServer(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Bin Depth (cm)</label>
            <input
              type="number"
              value={binDepth}
              onChange={(e) => setBinDepth(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Threshold (%)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Code tab header */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('esp32'); setCopied(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold select-none transition-all flex items-center gap-1 ${
              activeTab === 'esp32'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> ESP32 Arduino Sketch
          </button>
          
          <button
            onClick={() => { setActiveTab('python'); setCopied(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold select-none transition-all flex items-center gap-1 ${
              activeTab === 'python'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Python Simulation
          </button>

          <button
            onClick={() => { setActiveTab('thingspeak'); setCopied(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold select-none transition-all flex items-center gap-1 ${
              activeTab === 'thingspeak'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" /> ThingSpeak Integration
          </button>
        </div>

        <button
          onClick={() => {
            const code = activeTab === 'esp32' ? getArduinoCode() : activeTab === 'python' ? getPythonCode() : getThingSpeakGuide();
            triggerCopy(code);
          }}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Custom Code!' : 'Copy Code'}
        </button>
      </div>

      {/* Code Textbox Area */}
      <div className="relative">
        <textarea
          readOnly
          value={activeTab === 'esp32' ? getArduinoCode() : activeTab === 'python' ? getPythonCode() : getThingSpeakGuide()}
          className="w-full h-[380px] bg-slate-950 text-slate-200 border border-slate-900 p-4 rounded-xl font-mono text-xs focus:outline-none resize-none leading-relaxed overflow-y-auto"
        />
        
        {/* Helper overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 py-1.5 px-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 max-w-xs flex items-start gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
          <span>Failsafe, fully executable source. Paste directly into the Arduino IDE or python execution terminal.</span>
        </div>
      </div>

    </div>
  );
}
