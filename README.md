![Logo](https://raw.githubusercontent.com/phorgemakerspace/upkeep/refs/heads/main/static/upkeep.png)
# UpKeep (Machine Maintainance Tracking Tool)

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![Build Status](https://img.shields.io/badge/status-active-green.svg)  
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)  

A web-based equipment tracking system designed for makerspaces, hackerspaces, and workshops. This tool provides a dashboard to monitor the status of all machines, track usage logs, and manage machine details efficiently.  

## 🚀 Features  

### Current Features  
✅ **Dashboard Overview** – See all machines and their current status in a centralized view.  
✅ **Machine Details Page** – View specific machine details, including a usage log.  
✅ **QR Code Access** – Each machine has a QR code for easy log access.  
✅ **Machine Management** – Add, edit, reset usage hours, or delete machines.  
✅ **Docker Support** – Easy deployment using [Docker](https://hub.docker.com/repository/docker/kodaxx/upkeep/general). 

### Upcoming Features  
🔒 **User Authentication** – Secure login system for users.  
🔧 **Maintenance Mode** – Mark a machine as under maintenance.  
✔️ **Training Acknowledgment** – Users can check a box to confirm they have completed training.  
👤 **User Profiles** – Manage user data and permissions.  
🔑 **RFID-Based Access** – Restrict machine access based on RFID cards.  
📡 **Public API** – Allow external plugins to log usage automatically.  

## 📸 Screenshots  
(Will add screenshots here) 

## 🛠️ Installation  

### Prerequisites  
- Node.js & npm (or yarn)  
- Docker (optional, for containerized deployment)  

### Steps  
1. Clone the repository:  
   ```sh
   git clone https://github.com/phorgemakerspace/upkeep
   cd upkeep
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Configure environment variables:  
   - Copy `.env.example` to `.env` and set options.  

4. Start the development server:  
   ```sh
   npm run dev
   ```  

## 🐳 Docker Setup (Coming Soon)  
A `docker-compose.yml` file will be provided for easy deployment.  

## 🛡️ Authentication (Planned)  
- Users will log in to access machine logs and manage equipment.  
- Permissions will be role-based for different access levels.  

## 📡 API (Planned)  
A public REST API will allow external devices and plugins to log machine usage automatically.  

## 🤝 Contributing  
Contributions are welcome! Please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.  

## 📝 License  
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.  

## 📧 Contact  
For questions, feature requests, or contributions, open an issue or contact:  
📩 Email: spencer@phorgemakerspace.com
📌 GitHub: [phorgemakerspace/upkeep](https://github.com/phorgemakerspace/upkeep)  