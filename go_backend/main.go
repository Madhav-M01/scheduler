// package main

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserMapping struct {
	Phone  string `bson:"phone"`
	ChatID int64  `bson:"chat_id"`
}

type ScheduledMessage struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	Phone      string             `bson:"phone"`
	UserAPhone string             `bson:"user_a_phone"`
	Message    string             `bson:"message"`
	SendAt     time.Time          `bson:"send_at"`
	Sent       bool               `bson:"sent"`
}

var collection *mongo.Collection
var scheduleColl *mongo.Collection
var bot *tgbotapi.BotAPI

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
	botToken := os.Getenv("BOT_TOKEN")
	mongoURI := os.Getenv("MONGO_URI")
	

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("MongoDB connection error: %v", err)
	}
	defer mongoClient.Disconnect(ctx)

	db := mongoClient.Database("telegram_bot")
	collection = db.Collection("user_mappings")
	scheduleColl = db.Collection("scheduled_messages")

	go startHTTPServer()

	// Start Telegram bot
	bot, err = tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Fatalf("Telegram bot error: %v", err)
	}
	bot.Debug = true
	log.Printf("Authorized on account %s", bot.Self.UserName)

	// Start scheduler loop
	go startScheduler()

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message != nil {
			chatID := update.Message.Chat.ID
			text := update.Message.Text

			if strings.HasPrefix(text, "/start from_userA_") {
				phone := strings.TrimSpace(strings.TrimPrefix(text, "/start from_userA_"))
				saveMapping(collection, phone, chatID, bot, "✅ Phone %s linked to your account!")
			} else if strings.HasPrefix(text, "/start invited_by_") {
				parts := strings.Split(strings.TrimPrefix(text, "/start invited_by_"), "_")
				if len(parts) >= 2 {
					phone := parts[1]
					saveMapping(collection, phone, chatID, bot, "✅ Phone %s linked to your account via Gilgamesh!")
					// FE me message navigate("/schedule", { state: { userAPhone, userBPhone } }); krna hai ye back end ka code hai 
				} else {
					bot.Send(tgbotapi.NewMessage(chatID, "❌ Invalid invitation format"))
				}
			}
		}
	}
}

func startHTTPServer() {
	http.HandleFunc("/check-user", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		if r.Method == http.MethodOptions {
			return
		}
		phone := r.URL.Query().Get("phone")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		count, err := collection.CountDocuments(ctx, bson.M{"phone": phone})
		if err != nil {
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		
		json.NewEncoder(w).Encode(map[string]bool{"exists": count > 0})
	})

	// New endpoint to schedule message
	http.HandleFunc("/sendmessage", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK) 
			return
		}

		phone := r.URL.Query().Get("phone")
		userAphone := r.URL.Query().Get("userAphone")
		message := r.URL.Query().Get("message")
		timeStr := r.URL.Query().Get("time")
		dateStr := r.URL.Query().Get("date")

		loc, _ := time.LoadLocation("Asia/Kolkata") // or your timezone //addd
		sendTime, err := time.ParseInLocation("15:04_2006-01-02", timeStr+"_"+dateStr, loc)
		if err != nil {
			http.Error(w, "Invalid date/time format", http.StatusBadRequest)
			return
		}
		log.Println("Scheduling message for:", sendTime, "Current time:", time.Now())

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_, err = scheduleColl.InsertOne(ctx, ScheduledMessage{
			Phone:      phone,
			UserAPhone: userAphone,
			Message:    message,
			SendAt:     sendTime,
			Sent:       false,
		})
		if err != nil {
			http.Error(w, "Failed to save schedule", http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(map[string]string{"status": "scheduled"}); err != nil {
			http.Error(w, "failed to encode JSON", http.StatusInternalServerError)
			return
		}
		
		//json.NewEncoder(w).Encode(map[string]string{"status": "scheduled"})
	})

	log.Println("HTTP server running on :5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}

// Scheduler checks every 1 min for due messages
func startScheduler() {

	ticker := time.NewTicker(1 * time.Minute)
	for range ticker.C {

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		

		now := time.Now().UTC()
		cursor, err := scheduleColl.Find(ctx, bson.M{
			"sent":    false,
			"send_at": bson.M{"$lte": now},
		})

		if err != nil {
			log.Println("Error fetching schedules:", err)
			cancel()
			continue
		}

		var messages []ScheduledMessage
		if err := cursor.All(ctx, &messages); err != nil {
			log.Println("Cursor decode error:", err)
			cursor.Close(ctx)
			cancel()
			continue
		}
		cursor.Close(ctx)

		for _, msg := range messages {
			// send and handle error
			if err := sendMessage(msg.Phone, msg.UserAPhone, msg.Message); err != nil {
				log.Println("Error sending scheduled message:", err)
				// optionally continue (we don't mark as sent)
				continue
			}

			// mark as sent (use a fresh ctx per DB update)
			uctx, ucancel := context.WithTimeout(context.Background(), 5*time.Second)
			_, err := scheduleColl.UpdateOne(uctx,
				bson.M{"_id": msg.ID, "sent": false}, // update only if still unsent
				bson.M{"$set": bson.M{"sent": true}})
			ucancel()
			if err != nil {
				log.Println("Error updating sent flag:", err)
			}
		}
		cursor.Close(ctx)
		cancel() // important: release the context for this iteration
	}
}

// Sends Telegram message
func sendMessage(phone string, userAphone string, message string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	

	var mapping UserMapping
	if err := collection.FindOne(ctx, bson.M{"phone": phone}).Decode(&mapping); err != nil {
		return fmt.Errorf("recipient not found for phone %s: %w", phone, err)
	}

	text := fmt.Sprintf("📩 From: %s\n📝 %s", userAphone, message)
	if _, err := bot.Send(tgbotapi.NewMessage(mapping.ChatID, text)); err != nil {
		return fmt.Errorf("failed to send telegram message: %w", err)
	}
	return nil
}

func saveMapping(coll *mongo.Collection, phone string, chatID int64, bot *tgbotapi.BotAPI, successMsg string) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	mapping := UserMapping{
		Phone:  phone,
		ChatID: chatID,
	}

	_, err := coll.InsertOne(ctx, mapping)
	if err != nil {
		log.Printf("DB insert error: %v", err)
		bot.Send(tgbotapi.NewMessage(chatID, "❌ Database error"))
		return
	}

	bot.Send(tgbotapi.NewMessage(chatID, fmt.Sprintf(successMsg, phone)))
	log.Printf("Saved mapping: %s -> %d", phone, chatID)
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // allow all origins
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
