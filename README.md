# School Events Hub 🏫📅

A unified school events hub that syncs calendars, sends timely reminders, and ensures parents never miss important school activities—whether they have one child or several in different schools.

## 🎯 Problem & Mission

**Problem:** Parents struggle to track school events spread across multiple communication channels (email, paper flyers, scattered websites).  
**Mission:** Provide a single, reliable source for event information and timely notifications.

## ✨ Core Features

- 📅 **Centralized Event Calendar** - Per school, per grade, per child
- 🔔 **Customizable Reminders** - Push, SMS, email notifications
- 🔄 **Calendar Sync** - Google Calendar, Apple Calendar, Outlook
- 🏷️ **Event Categories** - Sports, academic, PTA, closures
- 👨‍👩‍👧‍👦 **Multi-child Profile Management**
- ⚙️ **Admin Panel** - Schools/PTAs can add/update events
- 📱 **Offline Access** - View upcoming events without internet

## 🛠️ Tech Stack

- **Frontend:** React (web), React Native (iOS/Android)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Notifications:** Firebase Cloud Messaging, Twilio (SMS), SendGrid (email)
- **Hosting:** AWS/GCP ready

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-events-hub
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
school-events-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── services/         # Business logic
├── database/             # Database migrations & seeds
└── docs/                # Documentation
```

## 🔐 Security & Compliance

- Encrypted user data at rest & in transit (AES-256, TLS 1.2+)
- COPPA and FERPA compliance for children's data
- Role-based access for admins vs parents
- Rate limiting and input validation

## 📱 Target Audience

- Parents with one or more children in K–12 schools
- PTAs/PTOS seeking better communication tools
- School administrators who want efficient parent outreach

## 🗺️ Roadmap

### MVP (Current)
- Core calendar view
- Event details
- Push notifications
- Admin event creation

### V1 (Next)
- Multi-calendar sync
- SMS/email reminders
- Offline mode

### V2 (Future)
- AI-driven smart reminders
- Community discussion threads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@schooleventshub.com or join our Slack channel.

---

Built with ❤️ for better school-parent communication