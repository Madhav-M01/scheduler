# 🚀 Telegram Message Scheduler

A beautiful, modern React application for scheduling messages through Telegram Bot API. Built with a sleek dark theme, smooth animations, and an intuitive user experience.

![Telegram Message Scheduler](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Lucide React](https://img.shields.io/badge/Lucide-Icons-FF6B6B?style=for-the-badge)

## ✨ Features

### 🎯 Core Functionality
- **Smart Phone Verification**: Seamless user authentication with phone number validation
- **Message Scheduling**: Schedule messages for any future date and time
- **Quick Templates**: Pre-built message templates for common scenarios
- **Real-time Validation**: Instant feedback on form inputs and scheduling conflicts
- **Telegram Integration**: Direct integration with Telegram Bot API

### 🎨 Design Excellence
- **Modern Dark Theme**: Elegant glass-morphism design with subtle gradients
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Responsive Layout**: Perfect experience across all device sizes
- **Accessibility First**: Keyboard navigation and screen reader support
- **Loading States**: Beautiful loading animations and progress indicators

### 🛠️ Technical Features
- **React Hooks**: Modern functional components with state management
- **Form Validation**: Comprehensive input validation and error handling
- **Character Limits**: Smart text limits with real-time character counting
- **Date/Time Constraints**: Intelligent scheduling with minimum date/time validation
- **Copy to Clipboard**: One-click invite link sharing

## 🏗️ Project Structure

```
telegram-scheduler/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # User authentication & phone verification
│   │   └── MessageScheduler.jsx # Message scheduling interface
│   ├── utils/
│   │   └── validation.js      # Input validation helpers
│   └── styles/
│       └── globals.css        # Global styles and animations
├── public/
│   └── index.html
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/telegram-scheduler.git
   cd telegram-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   REACT_APP_BOT_USERNAME=your_bot_username
   REACT_APP_API_URL=your_api_endpoint
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradients (`from-purple-600 to-violet-600`)
- **Background**: Dark slate (`from-slate-950 via-purple-950 to-slate-900`)
- **Surface**: Semi-transparent slate (`bg-slate-900/60`)
- **Text**: White primary, slate-400 secondary

### Typography
- **Headings**: Bold, gradient text with purple-violet transitions
- **Body**: Clean, readable text with proper contrast ratios
- **Labels**: Semibold with icon accompaniments

### Components
- **Glass Morphism**: Backdrop blur with semi-transparent backgrounds
- **Rounded Corners**: Consistent border radius (xl = 12px, 2xl = 16px)
- **Shadows**: Subtle drop shadows for depth and hierarchy

## 📱 User Flow

1. **Phone Verification**
   - User enters phone number
   - System checks if user exists
   - New users redirected to Telegram bot
   - Existing users proceed to scheduling

2. **Friend Invitation** (Optional)
   - Add friend's phone number
   - Generate invite link
   - Share via Telegram or copy link

3. **Message Scheduling**
   - Choose from quick templates or write custom message
   - Select date and time
   - Confirm and schedule message

## 🔄 API Integration

### Telegram Bot Setup
```javascript
// Bot commands structure
/start - Initialize user session
/help - Show available commands
/schedule - Quick schedule interface
/list - Show scheduled messages
/cancel - Cancel scheduled message
```

### Expected API Endpoints
```javascript
POST /api/users/verify          # Phone verification
POST /api/users/invite          # Generate invite links  
POST /api/messages/schedule     # Schedule new message
GET  /api/messages/list         # List scheduled messages
DELETE /api/messages/:id        # Cancel scheduled message
```

## 🎯 Message Templates

Built-in templates include:
- 🌅 **Morning Greetings**: "Good morning! Hope you have a wonderful day!"
- 📅 **Meeting Reminders**: "Don't forget about our meeting today!"
- 🎉 **Birthday Wishes**: "Happy Birthday! Wishing you all the best!"
- ⏰ **Appointment Alerts**: "Reminder: Your appointment is scheduled for today"

## 🔧 Configuration

### Environment Variables
```env
# Telegram Bot Configuration
REACT_APP_BOT_USERNAME=your_bot_username
REACT_APP_BOT_TOKEN=your_bot_token

# API Configuration  
REACT_APP_API_URL=https://your-api.com
REACT_APP_API_KEY=your_api_key

# Feature Flags
REACT_APP_ENABLE_TEMPLATES=true
REACT_APP_MAX_MESSAGE_LENGTH=1000
REACT_APP_TIMEZONE=UTC
```

## 📦 Dependencies

### Core Dependencies
- **React**: ^18.2.0 - UI library
- **React DOM**: ^18.2.0 - DOM rendering
- **Lucide React**: ^0.263.1 - Beautiful icon library

### Development Dependencies
- **Tailwind CSS**: ^3.3.0 - Utility-first CSS framework
- **PostCSS**: ^8.4.24 - CSS processing
- **Autoprefixer**: ^10.4.14 - CSS vendor prefixing

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Telegram Bot API** for the messaging infrastructure
- **Tailwind CSS** for the beautiful styling system
- **Lucide React** for the gorgeous icon set
- **React Team** for the amazing framework

## 📞 Support

Having issues? We're here to help!

- 📧 **Email**: support@yourapp.com
- 💬 **Telegram**: [@your_support_bot](https://t.me/your_support_bot)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/telegram-scheduler/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/telegram-scheduler/discussions)

## 🔮 Roadmap

### Version 2.0
- [ ] Multi-language support
- [ ] Recurring message scheduling
- [ ] Message templates customization
- [ ] Advanced scheduling (timezone support)
- [ ] Message analytics and delivery reports

### Version 2.1
- [ ] Group message scheduling
- [ ] File and media scheduling
- [ ] Integration with calendar apps
- [ ] Voice message scheduling

---

<div align="center">

**Made with ❤️ by [Madhav Bagri](https://github.com/Madhav-M01)**

⭐ Star this repo if you found it helpful!

</div>
#   s c h e d u l e r  
 