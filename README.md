# 🚀 Telegram Message Scheduler

A powerful Telegram bot application that allows users to schedule messages for future delivery. Built with Go backend and React frontend, featuring user authentication, message scheduling, and automated delivery.

## ✨ Features

### 🔐 User Authentication
- **Phone Number Linking**: Users can link their phone numbers to their Telegram accounts
- **Multiple Invitation Methods**: Support for both direct userA invitations and Gilgamesh bot invitations
- **Secure Mapping**: Phone numbers are securely mapped to Telegram chat IDs in MongoDB

### 📅 Message Scheduling
- **Future Message Scheduling**: Schedule messages for any future date and time
- **Time Zone Support**: Built-in support for Asia/Kolkata timezone
- **Automated Delivery**: Background scheduler checks and delivers messages automatically
- **Message Status Tracking**: Track sent/unsent message status

### 🌐 API Endpoints
- **User Verification**: Check if a phone number is registered
- **Message Scheduling**: Schedule new messages via HTTP API
- **CORS Support**: Full CORS support for frontend integration

### 🤖 Telegram Bot Features
- **Command Handling**: `/start` commands with invitation parameters
- **Real-time Updates**: Live message processing and delivery
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Architecture

```
telegram-scheduler/
├── go_backend/
│   ├── main.go              # Main Go server with bot logic
│   └── go.mod               # Go dependencies
├── src/                     # React frontend
├── package.json             # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Go 1.19+** - Backend runtime
- **Node.js 16+** - Frontend runtime
- **MongoDB** - Database (local or cloud)
- **Telegram Bot Token** - From [@BotFather](https://t.me/botfather)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd TELEGRAM_SCHEDULER/go_backend
   ```

2. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

3. **Create environment file:**
   ```bash
   # Create .env file
   BOT_TOKEN=your_telegram_bot_token_here
   MONGO_URI=mongodb://localhost:27017
   ```

4. **Install godotenv package:**
   ```bash
   go get github.com/joho/godotenv
   ```

5. **Run the backend:**
   ```bash
   go run main.go
   ```

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd TELEGRAM_SCHEDULER
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `go_backend` directory:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_bot_token_from_botfather

# Database Configuration
MONGO_URI=mongodb://localhost:27017

# Optional: Custom timezone (default: Asia/Kolkata)
TIMEZONE=Asia/Kolkata
```

### Bot Token Setup

1. **Create a bot with @BotFather:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` command
   - Follow instructions to create your bot
   - Copy the bot token

2. **Set the token:**
   - Add the token to your `.env` file
   - Restart the backend server

## 📡 API Endpoints

### 1. Check User Existence
```http
GET /check-user?phone=1234567890
```

**Response:**
```json
{
  "exists": true
}
```

### 2. Schedule Message
```http
GET /sendmessage?phone=1234567890&userAphone=9876543210&message=Hello&time=14:30&date=2024-01-15
```

**Parameters:**
- `phone`: Recipient's phone number
- `userAphone`: Sender's phone number
- `message`: Message content
- `time`: Time in HH:MM format
- `date`: Date in YYYY-MM-DD format

**Response:**
```json
{
  "status": "scheduled"
}
```

## 🤖 Bot Commands

### User Registration

1. **Direct UserA Invitation:**
   ```
   /start from_userA_1234567890
   ```

2. **Gilgamesh Bot Invitation:**
   ```
   /start invited_by_9999999999_7230038789
   ```

## 📊 Database Schema

### User Mappings Collection
```json
{
  "phone": "1234567890",
  "chat_id": 123456789
}
```

### Scheduled Messages Collection
```json
{
  "_id": "ObjectId",
  "phone": "1234567890",
  "user_a_phone": "9876543210",
  "message": "Hello World!",
  "send_at": "2024-01-15T14:30:00Z",
  "sent": false
}
```

## 🔄 Message Flow

1. **User Registration:**
   - User clicks invitation link
   - Bot receives `/start` command with phone number
   - Phone number is mapped to Telegram chat ID

2. **Message Scheduling:**
   - Frontend calls `/sendmessage` API
   - Message is stored in database with scheduled time
   - Background scheduler monitors for due messages

3. **Message Delivery:**
   - Scheduler checks every minute for due messages
   - Messages are sent via Telegram Bot API
   - Status is updated to "sent"

## 🛠️ Development

### Backend Structure

```go
// Main components
- UserMapping struct      // Phone to ChatID mapping
- ScheduledMessage struct // Message scheduling data
- HTTP server            // API endpoints
- Telegram bot           // Message handling
- Scheduler              // Background message delivery
```

### Key Functions

- `startHTTPServer()` - HTTP API server
- `startScheduler()` - Background message scheduler
- `sendMessage()` - Send Telegram messages
- `saveMapping()` - Save user mappings

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Database Errors**: Logged and reported to users
- **Bot API Errors**: Graceful handling with retry logic
- **Invalid Input**: Validation and user-friendly error messages
- **Network Issues**: Timeout handling and connection management

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in .env files
- **Input Validation**: All user inputs are validated
- **Database Security**: MongoDB with proper access controls
- **CORS Configuration**: Controlled cross-origin requests

## 📈 Monitoring & Logging

The application provides detailed logging:

- **User Registration**: Phone number mapping logs
- **Message Scheduling**: Schedule creation and timing logs
- **Message Delivery**: Success/failure logs
- **Error Tracking**: Comprehensive error logging

## 🚀 Deployment

### Production Setup

1. **Environment Configuration:**
   ```bash
   # Set production environment variables
   export BOT_TOKEN=your_production_bot_token
   export MONGO_URI=your_production_mongodb_uri
   ```

2. **Build Backend:**
   ```bash
   cd go_backend
   go build -o telegram-scheduler
   ```

3. **Run Production Server:**
   ```bash
   ./telegram-scheduler
   ```

### Docker Deployment

```dockerfile
FROM golang:1.19-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .
EXPOSE 5000
CMD ["./main"]
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Telegram Bot API** for the messaging infrastructure
- **MongoDB** for the database solution
- **Go Team** for the amazing programming language
- **React Team** for the frontend framework

## 📞 Support

Having issues? We're here to help!

- 📧 **Email**: bagrimadhav92@gmail.com
- 💬 **Telegram**: @your_support_bot
- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions

---

**Made with ❤️ by the Telegram Scheduler Team**

⭐ Star this repo if you found it helpful!

