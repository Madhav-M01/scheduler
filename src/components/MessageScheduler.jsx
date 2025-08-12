import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, Send, Sparkles, ArrowLeft, Check, Zap, Heart, Star, Users } from 'lucide-react';
import { useNavigate , useLocation} from 'react-router-dom'; 

const MessageScheduler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userAPhone, userBPhone } = location.state || {};
  console.log(userAPhone, userBPhone);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const messageTemplates = [
    { id: 1, text: "Good morning! Hope you have a wonderful day! ☀️", icon: "☀️", category: "greeting" },
    { id: 2, text: "Don't forget about our meeting today! 📅", icon: "📅", category: "reminder" },
    { id: 3, text: "Happy Birthday! Wishing you all the best! 🎉", icon: "🎉", category: "celebration" },
    { id: 4, text: "Reminder: Your appointment is scheduled for today", icon: "⏰", category: "reminder" }
  ];

  const handleSchedule = async () => {
    if (!time || !date || !message) {
      alert('Please fill in all fields!');
      return;
    }

    // back end me jana hoga ek function call krna hoga jo bot ko sendmessage name ka ,  krega user b ko and
    //  text me likha hoga form username this and form this no. then the text meassage 
    // message send krega us time or data pr 
    
    try{

      const response = await fetch(`http://localhost:9000/sendmessage?phone=${userBPhone}&userAphone=${userAPhone}&message=${message}&time=${time}&date=${date}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    
    setIsScheduling(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsScheduled(true);
    setIsScheduling(false);

    // Reset after showing success
    setTimeout(() => {
      setIsScheduled(false);
      setTime('');
      setDate('');
      setMessage('');
      setSelectedTemplate(null);
    }, 3000);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setMessage(template.text);
  };

  const handleBack = () => {
    // This would navigate back to login in your actual app
    navigate('/');
    console.log('Navigate back to login');
  };

  // Get current date for min date input
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get current time for min time input
  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow effects - matching first page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-violet-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-8xl">
        {/* Header */}
        <div className="text-center mb-10 relative">
          <button 
            onClick={handleBack}
            className="absolute left-0 top-2 p-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl backdrop-blur-sm border border-slate-700/60 transition-all duration-300 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl mb-6 shadow-lg border border-purple-500/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Schedule Message
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            Send messages at the perfect time
          </p>
        </div>

        {/* Success Animation */}
        {isScheduled && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Message Scheduled!</h2>
              <p className="text-slate-300">Your message will be sent at the perfect time ✨</p>
            </div>
          </div>
        )}

        {/* Main card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-2xl">
          {/* Quick Templates */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Quick Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-5 rounded-xl border transition-all duration-300 text-left group ${
                    selectedTemplate === template.id
                      ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600/60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm leading-relaxed block">{template.text}</span>
                      <span className="text-xs text-slate-500 capitalize mt-1 block">{template.category}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling Form */}
          <div className="space-y-6">
            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-white font-semibold flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    min={getCurrentDate()}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="text-white font-semibold flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Select Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-white font-semibold flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Your Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your amazing message here... ✨"
                  rows={4}
                  maxLength={1000}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 resize-none"
                />
                <span className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {message.length}/1000
                </span>
              </div>
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleSchedule}
              disabled={isScheduling || !time || !date || !message}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg border border-purple-500/20 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isScheduling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Scheduling Magic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Schedule Message</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center group hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600/30 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-white font-semibold text-sm">Perfect Timing</p>
                <p className="text-slate-400 text-xs mt-1">Send at the right moment</p>
              </div>
              
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center group hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-10 h-10 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-600/30 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <p className="text-white font-semibold text-sm">Smart Delivery</p>
                <p className="text-slate-400 text-xs mt-1">AI-powered scheduling</p>
              </div>
              
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center group hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600/30 transition-colors duration-300">
                  <Heart className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-white font-semibold text-sm">Reliable</p>
                <p className="text-slate-400 text-xs mt-1">Never miss important moments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Messages scheduled with <Heart className="w-4 h-4 text-purple-400 inline mx-1" /> • Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageScheduler;