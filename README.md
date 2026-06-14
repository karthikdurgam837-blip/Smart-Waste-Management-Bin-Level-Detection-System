# 🗑️ SMART WASTE MANAGEMENT & BIN LEVEL DETECTION SYSTEM
### Enterprise-Grade IoT System Architecture, Market Analysis, and Technical Specifications
#### Designed as an Academic Capstone project & IoT Portfolio Proof-of-Work

---

## 📈 EXECUTIVE SUMMARY
Traditional municipal waste management utilizes static routing where collection fleets travel on predetermined, timed loops regardless of actual garbage accumulation. This introduces significant operational inefficiencies: sanitization vehicles waste fuel, manpower, and vehicle lifespan visiting empty bins, while overflowing bins go unnoticed for days, resulting in biohazard conditions, pest infestation, and odors.

This project introduces an end-to-end **Smart Waste Management & Bin Level Detection System** that uses edge-computing microcontrollers, sonar-based distance transducers, environmental index sensors, and remote telemetry pipelines. By logging bin data in real time and analyzing metric dynamics—such as gas concentration (decay index) and temperature—municipal centers can execute a **dynamic dispatch model**, routing fleets only to bins requiring clearance. 

### 💡 Estimated Core Economic Dynamics & Business ROI:
* **Fleet Mileage & Fuel Savings:** Reductions of **28% to 42%** in daily vehicle operational expenditures.
* **Labor Optimization:** Double the capacity of operational sweep routes without increasing full-time headcount.
* **Asset Durability:** Decreased fleet maintenance overhead due to fewer redundant runs.
* **Environmental Impact:** Significant decrease in carbon emissions, directly aligned with international ESG (Environmental, Social, Governance) benchmarks.

---

## ⚠️ PROBLEM STATEMENT
Rapid urbanization has escalated global municipal solid waste production, placing heavy strain on sanitation management systems. Inefficiencies in the traditional model can be summarized across three dimensions:

1. **Blind Logistics & Static Schedules:** Collectors travel on fixed routes. This means vehicles often clear bins containing negligible rubbish, wasting municipal budgets on fuel, while highly active sections (e.g., student plazas, transport terminals) experiences garbageoverflow prior to scheduled collection windows.
2. **Environmental Degradation:** Organic decomposition in unmanaged bins produces methane ($CH_4$) and volatile organic compounds (VOCs). High heat accelerates bacterial decomposition, attracting pests and creating public health hazards.
3. **Absence of Central Analytics:** City planners lack historical empirical telemetry datasets. This makes it impossible to dynamically scale trash bin counts or model waste accumulation patterns based on seasonal foot traffic, holiday events, or weather changes.

---

## 🎯 OBJECTIVES
The technical and operational objectives of this project include:
* **Microcontroller-Edge Processing:** Build an embedded firmware scheme based on the **ESP32 DevKIT** to capture sonar transducer duration and calculate accurate fill heights with millimeter resolution.
* **Multisensor Fusion:** Deploy a sensor payload incorporating **HC-SR04** (level), **MQ-135** (air quality/gas index), and **DHT11** (ambient temperature/humidity) to compile a multi-dimensional environment telemetry packet.
* **Lightweight Transport Protocol:** Ship telemetry payloads to cloud services using secure, efficient, low-bandwidth communication protocols (**JSON/MQTT** or **HTTPS REST**).
* **Responsive Command Dashboard:** Build a high-performance, real-time control room console mapping individual node levels and firing automated dispatch recommendations.
* **Empirical Audits:** Provide clear logging, comprehensive analytical code generators, and simulated placement examinations for rapid verification of college-level coursework criteria.

---

## 📊 MARKET RESEARCH & BENCHMARKS

A comprehensive analysis of corporate smart city deployments reveals a rapidly expanding global market driven by sustainability and municipal efficiency mandates.

### Competitor Landscape & Corporate Case Studies
The primary commercial offerings in this domain include:

| Metric | Bigbelly (US) | Enevo (Finland) | Ecube Labs (S. Korea) | Open IoT Reference System (This Project) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Sensor** | High-durability Ultrasonic | Dual Laser / ToF | Ultrasonic Sonar Grid | **HC-SR04 Sound Transducer** |
| **Power Integration** | Built-in Solar Compactor | Lithium Battery Pack | solar-powered Bin Enclosure | **ESP32 Edge Sleep/Static AC** |
| **Connectivity** | 4G LTE Cellular / NB-IoT | Cellular (LTE-M) | LTE-M / LoRaWAN | **Wi-Fi / MQTT Broker (ThingSpeak)** |
| **Additional Metrics** | Compaction pressure, GPS | Accelerometer (Tilt/Dump) | Compactor pressure, GPS | **MQ-135 Gas, Temp, Humidity** |
| **Application Layer** | Enterprise Web Platform | Predictive Schedule Platform | CleanCityNetworks Cloud | **Vite-React Dashboard & Hardware Lab** |
| **Target Field** | High-budget urban centers | Commercial waste brokers | Regional municipalities | **University campuses & Smart Quads** |

### Key Market Trends
1. **Edge AI Classification:** Standard bin sensors are upgrading from simple level detection to integrated machine learning vision models that identify and classify recyclables, compostable waste, and hazardous items directly at the edge.
2. **LoRaWAN & LPWAN Dominance:** For large municipal deployments, long-range, low-power networks (like LoRaWAN) are preferred over Wi-Fi/LTE due to their ability to provide multi-kilometer signal coverage and multi-year battery life on low-cost coin cells.
3. **Gamification & Smart Incentives:** Integrated RFID card scanners allow cities to reward residents with financial credits for proper sorting, transforming trash containers into active community assets.

---

## ⚙️ SYSTEM ARCHITECTURE & DATA FLOW

The platform is designed around a decoupled, 4-tier modular IoT architecture to ensure maximum performance, clean separation of concerns, and reliable horizontal scaling.

```text
               +-----------------------------------------------------------+
               |                    PERCEPTION LAYER                       |
               |                                                           |
               |   [HC-SR04 Sonar]    [MQ-135 Gas]        [DHT11 Temp]     |
               |          |                 |                  |           |
               |          +-----------------+------------------+           |
               |                            | (Analog/Digital Signals)      |
               |                            v                             |
               |                     [ESP32 MCU Node]                      |
               |          (Time-of-flight Math & Local Alerts)             |
               +----------------------------+------------------------------+
                                            |
                                            | (Wi-Fi Protocol / WPA2 Sec)
                                            v
               +-----------------------------------------------------------+
               |                     TRANSPORT LAYER                       |
               |                                                           |
               |     [HTTPS REST Client]     OR     [MQTT Client Node]     |
               |       (api.thingspeak.com)           (broker.hivemq.com)  |
               +----------------------------+------------------------------+
                                            |
                                            | (SSL/TLS encrypted Packets)
                                            v
               +-----------------------------------------------------------+
               |                  CLOUD INTEGRATION LAYER                  |
               |                                                           |
               |      [ThingSpeak API]      [Node-RED Broker]              |
               |             |                      |                      |
               |             +-----------+----------+                      |
               |                         |                                 |
               |                         v                                 |
               |          [Telemetry DB / Firestore Logs]                  |
               +-------------------------+---------------------------------+
                                         |
                                         | (Indexed Web Socket API Queries)
                                         v
               +-----------------------------------------------------------+
               |                    APPLICATION LAYER                      |
               |                                                           |
               |    [Dynamic React UI]     [Routing Optimization Planner]  |
               |   (Operations Cockpit)     (Overfill Dispatch Webhooks)   |
               +-----------------------------------------------------------+
```

### Detailed Layer Breakdown:

#### 1. Perception Layer (Edge Hardware Node)
* **ESP32 Microcontroller:** Runs concurrent routines using FreeRTOS. Measures flight patterns, processes local threshold triggers, updates active RGB diodes, and triggers piezo sirens when fill levels cross the critical 80% mark.
* **HC-SR04 Sonar Array:** Measures distance using high-frequency 40kHz sound impulses.
* **DHT11 Thermal Sensor:** Monitors the ambient environment and tracks waste temperature spike anomalies, which can indicate heat-producing composting risks or potential hazards.
* **MQ-135 Air Quality Sensor:** Monitors gas levels to detect rotting or decay of organic waste, helping prioritize bin clearances.

#### 2. Network Transport Layer
* Uses native Wi-Fi drivers to connect to campus WLAN access points.
* Telemetry payloads are compiled into lightweight JSON strings to minimize bandwidth and transport latency.
* Utilizes **MQTT brokers** (e.g., HiveMQ, Mosquito) or **HTTP POST endpoints** (e.g., ThingSpeak REST API) over SSL/TLS (HTTPS) to prevent telemetry eavesdropping.

#### 3. Integration & Storage Layer
* Webhooks process inbound telemetry payloads.
* Time-series data is stored in specialized analytics databases (like TimescaleDB, PostgreSQL, or Firestore).
* Rule engines evaluate active variables and trigger instant system notifications when safety thresholds are breached.

#### 4. Application Presentation Layer
* **Operations Control Room:** High-fidelity dashboard mapping live nodes, system status alerts, and log exports.
* **Schematic Wiring Lab:** Educational schematic reference showing the accurate wiring map of ESP32 pins to hardware interfaces to assist students during practical labs.
* **Interactive Simulator:** Software representation implementing authentic physical logic, allowing developers to test threshold conditions and view console outputs.

---

## 🔬 FEATURE LIST

1. **Operations Dashboard Console:**
   * Live telemetry graphing showing real-time trends for Fill levels, gas PPM, and temperatures.
   * Smart overfill detection visualizer colored by risk (Teal/Green for empty/normal, Amber/Yellow for filled, Red/Flashing for imminent spill hazards).
   * One-click "Sweep / Empty" dispatch button that simulates sanitation trucks clearing waste on the spot.

2. **Interactive Hardware Simulator:**
   * Sliders to adjust simulated trash density, gas concentration, temperature, and humidity.
   * Sound generator based on the **Web Audio API** that emits an 880Hz alert tone to mimic an active piezo buzzer when levels cross 80%.
   * Real-time console log mimicking serial interfaces to assist developers with diagnostics.

3. **Schematic Designer Lab:**
   * Interactive, detailed wire circuit mapping ESP32 pins to the HC-SR04 sonar module, 3 LEDs, MQ-135, and active piezo buzzer.
   * Clear, high-contrast pin wiring tables detailing power inputs, signal directions, and grounding paths.

4. **IoT C++ Block Exporter:**
   * Optimized, compile-ready Arduino C++ source code blocks using the **PubSubClient** and **WiFi** libraries.
   * Dynamic variables that update automatically as users configure Wi-Fi SSIDs, device access secret keys, or broker addresses.

5. **Placement Viva Simulator & Practice Deck:**
   * Interactive, voice-assisted interview prep tools featuring real-world IoT examination questions.
   * Custom grading and evaluation system that analyzes user answers and highlights key terms.

6. **GitHub Portfolio Deployment Assistant:**
   * Automated, customized README builder that injects student names, class titles, and university details.
   * Guidelines for clean Git commit histories to help students format their portfolios for recruiter review.

---

## 📈 SYSTEM USER FLOW

The following flow chart describes the operational lifecycle of a Smart Node, from boot-up to municipal central dispatch clearance:

```text
       +-------------------------+
       |   System Power Boot     | (ESP32 Initialized, Sensors Powered)
       +------------+------------+
                    |
                    v
       +-------------------------+
       |   WLAN Wi-Fi Handshake  | <--------------+ (Retry Connection count)
       +------------+------------+                |
                    |                             |
          [Connection Successful?] --(No)---------+
                    |
                  (Yes)
                    v
       +-------------------------+
       | Trigger Pin Pulsed 10µs |
       +------------+------------+
                    |
                    v
       +-------------------------+
       | Read Echo Pulse Duration| (Time of flight computed in µs)
       +------------+------------+
                    |
                    v
       +-------------------------+
       |  Calculate Distance/Fill| (D = T * 0.0343 / 2 ; Fill % = (H-D)/H )
       +------------+------------+
                    |
                    v
       +-------------------------+
       | Read gas PPM & DHT Temp |
       +------------+------------+
                    |
                    +-----+-----------------------+
                    |                             |
                    v                             v
         [Level >= 80% threshold?]     [Temp >= 55°C or gas PPM > 400?]
                    |                             |
           +--------+--------+           +--------+--------+
           |                 |           |                 |
         (Yes)              (No)       (Yes)              (No)
           |                 |           |                 |
           v                 v           v                 v
   +---------------+ +-------------+ +-----------+ +---------------+
   | Sound Buzzer! | | Turn Green  | | High Temp | | Normal Safe   |
   | Blink Red LED!| | LED ON!     | | Hazard    | | Environment   |
   | Set Alert Flag| | Alert=False | | Warning   | | State Logged  |
   +-------+-------+ +-------+-----+ +-----+-----+ +-------+-------+
           |                 |             |               |
           +-----------------+-------------+---------------+
                    |
                    v
       +-------------------------+
       | Compile Telemetry JSON  | (Data = {id, fill, temp, gas, alert})
       +------------+------------+
                    |
                    v
       +-------------------------+
       | Publish to MQTT Broker  | (topic: devices/node/telemetry)
       +------------+------------+
                    |
                    v
       +-------------------------+
       | Central Cloud Server   |
       | Processes & Updates UI  |
       +------------+------------+
                    |
                    v
       +-------------------------+
       | Overfill Alert Trigger? |-----(No)-------+
       +------------+------------+                |
                    |                             |
                  (Yes)                           |
                    v                             v
       +-------------------------+       +-------------------+
       | Dynamic Route Selected  |       | Standby Routine:  |
       | Fleet Dispatched!       |       | Sleep 30 Seconds  |
       +------------%------------+       +---------+---------+
                    |                              |
                    v                              |
       +-------------------------+                 |
       | Bin Swept / Emptied     |                 |
       +-------------------------+                 |
                    |                              |
                    +------------------------------+
```

---

## 🛠️ TECHNICAL STACK

### 🔌 Hardware Peripherals Specifications
* **ESP32 NodeMCU Module:** 32-bit dual-core Xtensa LX6 processor running at 240MHz. Features 4MB SPI Flash, on-board 802.11 b/g/n Wi-Fi, and low-power sleep modes.
* **HC-SR04 Sonar Transducer:** Computes distance profiles from 2cm to 400cm with 3mm precision. Operating Voltage: 5V DC.
* **MQ-135 Gas Air Index Sensor:** Tin dioxide ($SnO_2$) semiconductor detects degradation elements (ammonia, sulfides, smoke, CO2) with sensitivity ranging from 10 to 1000 PPM.
* **DHT11 Thermo-Hygrometer:** Integrated capacitive humidity and thermistor sensor. Measures temperature from 0°C to 50°C and humidity from 20% to 90% RH.
* **Piezoelectric Sound Transducer:** High-frequency, low-draw active piezo buzzer (typical operational frequency: 2.3kHz - 880Hz tone).
* **LED Indicator Cluster:** 3 standard 5mm light-emitting diodes (Green = OK, Amber = Warning, Red = Overfill).

### 💻 Web Platform Implementation
* **Build System & Framework:** Vite for speed, React 19, and full static TypeScript compiler configuration.
* **State Management:** Local React state, custom event triggers, and persistent browser configurations.
* **Animations:** **Motion** (from `motion/react`) for fluid transitions between interface modules, physical liquid level scaling, and real-time alerts.
* **Icons:** **Lucide React** for ultra-clean, vectorized developer iconography.
* **Audio Engine:** HTML5 Web Audio API, generating low-latency interactive frequencies to simulate piezoelectric buzzers.
* **Style Engine:** Tailwind CSS utilizing high-contrast typography, clear border rails, and spacious layouts.

---

## 🗄️ ENTERPRISE DATABASE SCHEMA DESIGN

To move beyond prototype setups, a production-level enterprise smart waste deployment requires a normalized, relational SQL database to manage devices, telemetry histories, security access, and dispatch routes.

### Relational Database Model (PostgreSQL / Cloud SQL Engine)

```sql
-- 1. Tenants / Municipality / Organization Table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    country_code VARCHAR(10) DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Operations staff and dispatch drivers
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) CHECK (role IN ('Administrator', 'Operations_Manager', 'Dispatch_Driver')) DEFAULT 'Dispatch_Driver',
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Waste Bin Nodes (Physical placements)
CREATE TABLE bin_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    device_uid VARCHAR(100) UNIQUE NOT NULL, -- Hardware MAC or UUID
    name VARCHAR(100) NOT NULL,
    location_description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    bin_type VARCHAR(50) CHECK (bin_type IN ('Organic', 'Recyclable', 'General_Waste')) DEFAULT 'General_Waste',
    bin_height_cm DECIMAL(5, 2) NOT NULL DEFAULT 30.00,
    fill_warning_threshold_percent DECIMAL(5, 2) DEFAULT 80.00,
    battery_level_percent DECIMAL(5, 2) DEFAULT 100.00,
    current_status VARCHAR(20) CHECK (current_status IN ('Empty', 'Half_Full', 'Nearly_Full', 'Full')) DEFAULT 'Empty',
    last_communication_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Central Telemetry Logging (Time-series optimization)
CREATE TABLE telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    bin_node_id UUID REFERENCES bin_nodes(id) ON DELETE CASCADE,
    distance_measured_cm DECIMAL(6, 2) NOT NULL,
    calculated_fill_percent DECIMAL(5, 2) NOT NULL,
    gas_concentration_ppm INTEGER NOT NULL,
    temperature_celsius DECIMAL(4, 1) NOT NULL,
    humidity_percent DECIMAL(4, 1) NOT NULL,
    is_alert_triggered BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hypertable indexes on recorded_at for scaling time queries
CREATE INDEX idx_telemetry_node_time ON telemetry_logs (bin_node_id, recorded_at DESC);

-- 5. System Alert Logs
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bin_node_id UUID REFERENCES bin_nodes(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) CHECK (alert_type IN ('OVERFILL', 'THERMAL_HAZARD', 'TOXIC_GAS_SPIKE', 'HARDWARE_FAULT')),
    current_reading_value DECIMAL(10, 2) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Dynamic Dispatch Routes
CREATE TABLE dispatch_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    optimized_path_geometry TEXT, -- Encoded route polyline
    route_status VARCHAR(25) CHECK (route_status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'ABANDONED')) DEFAULT 'PLANNED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Route Leg details (Sequential Bins to visit)
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES dispatch_routes(id) ON DELETE CASCADE,
    bin_node_id UUID REFERENCES bin_nodes(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_at TIMESTAMP WITH TIME ZONE
);
```

---

## 🔒 SECURITY CONSIDERATIONS

Securing a connected municipal system is critical to prevent spoofed alerts, malicious hardware firmware flashing, and denial-of-service (DoS) attacks on sanitation tracking.

1. **Transport Layer Encryption (TLS/SSL):**
   * All network exchanges must use HTTPS or MQTT over TLS (Port 8883) using root SSL certificates baked into the ESP32 firmware. This prevents man-in-the-middle attacks on telemetry data.

2. **Access Control & API Security:**
   * **Node-specific Tokens:** Devices must not share a single master credential. Rather, each bin node must use a unique, cryptographically signed bearer token in the HTTP header during data submissions.
   * **Role-Based Access Control (RBAC):** Web dashboards must isolate operator duties. Drivers should have access only to routing logs; municipal operations managers can modify node locations and warning thresholds; platform executives can review overarching cost metrics.

3. **Firmware Integrity Preservation:**
   * Hardware installations must disable local JTAG logging and physical serial readouts once deployed.
   * Secure OTA (Over-The-Air) updates should enforce cryptographic signing of firmware binaries prior to on-chip execution.

---

## 🧪 TESTING STRATEGY

Ensuring system reliability across varying network states and weather conditions requires a multi-phase testing protocol.

### 1. Embedded Math Unit Testing
Before flashing, core calculations must be validated. If the sound of speed ($v = 0.0343 \text{ cm/µs}$) is constant, distance calculations must be verified using a representative set of mock values:

```text
Inputs: Pulse time (T) = 583µs
Calculation: Distance = (583 * 0.0343) / 2 = 9.999 cm (~10cm Empty Depth)
If Bin Height (H) = 50cm, Fill % = (50 - 10) / 50 * 100 = 80% (Warning condition)
```

### 2. Mock Hardware-in-the-Loop (HIL) Tests
* Simulated signal lines run automated scripts feeding wave values to the Echo node inputs. 
* System logs are monitored on serial consoles to confirm LEDs alter state at exactly 50% and 80%, and that the buzzer sounds at 80%.

### 3. Queue Buffer Leak Tests
* Networks often experience dropouts. ESP32 nodes must deploy a local circular queue in partition memory.
* If WLAN signal is lost, telemetry payloads must buffer locally. Once connection is restored, the buffered queue must drain sequentially without data loss or memory leaks.

---

## 📦 DEPLOYMENT PLAN

### 1. Arduino IDE ESP32 Manual Flashing
1. **Configuring board preferences:** Navigate to `Preferences -> Additional Board URLs` and append:
   `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
2. **Board Manager:** Search for 'ESP32' and click Install.
3. **Library Dependencies:** Install `PubSubClient` by Nick O'Leary using the library manager.
4. **Deploying the code:** Load the generated sketch in `Source Code Blocks`, update your local Wi-Fi credentials (`ssid`, `password`), select `ESP32 Dev Module`, and upload the code using a micro-USB connection.

### 2. Municipal Web Platform Production Build
Deploy the React web platform using a modern cloud platform:

```bash
# 1. Install production packages
npm install

# 2. Build production assets (Vite leverages highly-optimized roll-up modules)
npm run build
```

This builds a highly compressed static distribution inside the `/dist` directory. The contents of `/dist` can be hosted on globally distributed CDN nodes (like Cloudflare, Firebase Hosting, Netlify, or AWS S3/CloudFront) for fast, low-latency loading worldwide.

### 3. Containerized Replications (Docker Setup)
To support regional on-premise deployments or cloud-native replication in Kubernetes clusters, package the applet via Docker:

```dockerfile
# Dockerfile
FROM node:20-alpine AS build_stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build_stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔮 FUTURE ENHANCEMENTS & ROADMAP

The platform is designed to scale and can be extended with several advanced features:

### 1. Dynamic Predictive Accumulation Machine Learning Models
Rather than simple reactive updates, use cloud-hosted ML algorithms (such as Holt-Winters Exponential Smoothing or LSTM Neural Networks) to model historical fill speeds. Predictions can forecast which bins will reach capacity in the next 12 hours, allowing routers to proactively schedule collection paths.

### 2. Solar Harvesting & Ultra-Low-Power Optimization
* Equip bins with minor $5V$ solar panels to trickle-charge on-board Lithium cells.
* Configure the ESP32 to sleep in **Deep Sleep mode ($0.8\mu A$)**, waking up only every 15 minutes to run a 3-second check, post data, and sleep again, extending device battery life to several years.

### 3. Local Computer Vision & Sorting Cameras
Integrate low-cost edge camera modules (like the ESP32-CAM) running ultra-lightweight MobileNet neural networks. The camera can scan items near the lid opening to automatically detect and flag sorted plastics or contaminated items, and log compliance metrics to the cloud dashboard.

---

### 🎓 Academic Citation & Credits
Project designed and compiled under rigorous IoT coursework and modern municipal logistics research guidelines. Constructed for academic presentation, professional recruiter review, and investor proposal pitches. No proprietary or tool-specific references are baked into the core implementation. All systems are configured for standalone deployment.
