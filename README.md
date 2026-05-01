# AI-Driven Digital Twin for Aerobic Landfill Remediation and Rapid Stabilization

## Project overview
A high-fidelity, presentation-ready React + TypeScript demo of an AI-driven digital twin platform for aerobic landfill remediation and rapid stabilization. It visualizes the closed-loop workflow from monitoring and sensing to AI optimization, equipment execution, and reporting.

## Installation
```bash
npm install
```

## Run
```bash
npm run dev
```

## Main features
- Futuristic command-center UI with dark glassmorphism styling.
- Multi-page tabs: Home, Site Twin, Subsurface, AI Control, Equipment, Simulation, Reports.
- Interactive 3D twin scene (React Three Fiber) with selectable zones, sensor pulses, and subsurface layers.
- KPI strip with live simulated drift.
- Layer toggles: O₂, Temperature, Humidity, Pollutant, Microbial, Sensor Layout.
- AI recommendation workflow with Apply Recommendation feedback and toast.
- Alerts panel with click-to-focus zone behavior.
- Timeline/phase/mode controls with Manual Mode sliders and AI Auto Mode emphasis.
- Recharts mini-trends for O₂, Temperature, Degradation Rate, Stabilization Index.
- Reports summary cards and export action buttons.

## Mock data
- 4 remediation zones (A/B/C/D) with O₂, temperature, humidity, pH, degradation rate, stabilization index, risk, and status.
- 3 active alerts (high temperature, low O₂, leachate rise MW-12).
- Simulated real-time KPI and zone drift updates.

## Recommended future extensions
- MQTT integration for real sensor streams.
- Time-series database (TimescaleDB/InfluxDB) for telemetry history.
- AI model API integration for predictive optimization and what-if analysis.
- Control cabinet / PLC integration for hardware execution feedback.
- Authentication, role-based control, and audit logging.
- Scenario replay persistence and PDF/Excel report generation.
