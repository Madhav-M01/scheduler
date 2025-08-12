import React, { useState } from "react";
import { MessageCircle, Send, Users, Copy, Check, Phone, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [userAPhone, setUserAPhone] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [userBPhone, setUserBPhone] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handlePhoneInput = (value, setter) => {
    // Only allow digits and limit to 10 characters
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setter(digits);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };
  
  const handleJoinClick = async () => {
    if (userAPhone.length !== 10) return;
    
    setIsLoading(true);
  
    // Call backend to check if phone exists
    const res = await fetch(`http://localhost:9000/check-user?phone=${userAPhone}`);
    const data = await res.json();
  
    if (!data.exists) {
      // New user → redirect to Telegram bot
      const encodedPhone = encodeURIComponent(userAPhone);
      const botUsername = "messageschedulerviabot";
      const redirectURL = `https://t.me/${botUsername}?start=from_userA_${encodedPhone}`;
      window.location.href = redirectURL;
    } else {
      setUserExists(true);
      setStep(2);
    }
  
    setIsLoading(false);
  };
  

  const handleInvite = async () => {
    if (userBPhone.length !== 10) return;
  
    setIsLoading(true);
  
    try {
      // Call backend to check if user exists
      const res = await fetch(`http://localhost:9000/check-user?phone=${encodeURIComponent(userBPhone)}`);
      const data = await res.json();
  
      const isExistingUser = data.exists; // true/false from BE
  
      if (!isExistingUser) {
        const encodedUserA = encodeURIComponent(userAPhone);
        const encodedUserB = encodeURIComponent(userBPhone);
        const botUsername = "messageschedulerviabot";
        const link = `https://t.me/${botUsername}?start=invited_by_${encodedUserA}_${encodedUserB}`;
        
        setInviteLink(link);
        setStep(3);
      } else {
        navigate("/schedule", { state: { userAPhone, userBPhone } });
        console.log("Navigate to schedule with:", { userAPhone, userBPhone });
      }
    } catch (err) {
      console.error("Error checking user:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/6 rounded-full blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl mb-6 shadow-lg border border-purple-500/20">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Telegram Scheduler
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule messages like magic
          </p>
        </div>

        {/* Main card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-2xl">
          {/* Step 1: Phone number input */}
          <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute'}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-slate-400">Enter your phone number to get started</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={userAPhone}
                  onChange={(e) => handlePhoneInput(e.target.value, setUserAPhone)}
                  onKeyPress={(e) => handleKeyPress(e, handleJoinClick)}
                  maxLength={10}
                  className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>

              <button
                type="button"
                onClick={handleJoinClick}
                disabled={userAPhone.length !== 10 || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg border border-purple-500/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Join the Magic
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Invite user */}
          {userExists && (
            <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Invite a Friend</h2>
                <p className="text-slate-400">Add someone to start scheduling together</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Friend's phone number"
                    value={userBPhone}
                    onChange={(e) => handlePhoneInput(e.target.value, setUserBPhone)}
                    onKeyPress={(e) => handleKeyPress(e, handleInvite)}
                    maxLength={10}
                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                  />
                </div>

                <button
                  onClick={handleInvite}
                  disabled={userBPhone.length !== 10 || isLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg border border-violet-500/20"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Check & Continue
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Invite link */}
          {inviteLink && (
            <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Invitation Ready!</h2>
                <p className="text-slate-400">Share this magic link with your friend</p>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-2">Invite Link:</p>
                    <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-4">
                      <p className="text-slate-300 text-sm break-all font-mono leading-relaxed">{inviteLink}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCopy}
                    className={`w-full ${copied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500/30' 
                      : 'bg-slate-700 hover:bg-slate-600 border-slate-600/50'
                    } text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={inviteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-center shadow-lg border border-purple-500/20"
                >
                  Open in Telegram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;