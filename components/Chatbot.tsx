"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message
      setTimeout(() => {
        addBotMessage(
          "Hi! 👋 Welcome to CodeNeuraX! I'm here to help you navigate our tech community. What would you like to know?",
          [
            { label: "About CodeNeuraX", action: "about" },
            { label: "Join Community", action: "join" },
            { label: "Upcoming Events", action: "events" },
            { label: "Learning Resources", action: "resources" }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, quickActions?: QuickAction[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      quickActions
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const getBotResponse = (input: string): { text: string; quickActions?: QuickAction[] } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('about') || lowerInput.includes('what is codeneura')) {
      return {
        text: "CodeNeuraX is a student-led tech community founded in 2025 by Dinesh Yadav. We connect, inspire, and empower the next generation of coders, developers, and innovators. With 3200+ active members, we offer:\n\n• 4 specialized WhatsApp groups\n• Monthly workshops and events\n• Coding challenges and competitions\n• Career guidance and internship support\n• Learning resources for multiple programming languages",

        quickActions: [
          { label: "Join Community", action: "join" },
          { label: "View Events", action: "events" },
          { label: "Programming Languages", action: "languages" }
        ]
      };
    }

    if (lowerInput.includes('join') || lowerInput.includes('whatsapp') || lowerInput.includes('community')) {
      return {
        text: "Great! We have 4 WhatsApp groups for different purposes:\n\n🔹 **Main Community** - General discussions and networking\n🔹 **Coding Challenges** - Weekly challenges and interview prep\n🔹 **Events & Hackathons** - Stay updated with latest events\n🔹 **Learning Resources** - Curated tech news and materials\n🔹 **Career Opportunities** - Internships and job opportunities\n\nWhich group interests you most?",
        quickActions: [
          { label: "Main Community", action: "main-group" },
          { label: "Coding Challenges", action: "coding-group" },
          { label: "Events Group", action: "events-group" },
          { label: "Career Group", action: "career-group" }
        ]
      };
    }

    if (lowerInput.includes('event') || lowerInput.includes('workshop') || lowerInput.includes('hackathon')) {
      return {
        text: "🎉 **Upcoming Events:**\n\n**Python With Peers**\n📅 Date: TBA\n⏰ Time: 6:00 PM - 8:00 PM\n📍 Online Workshop\n\n**Breaking SDE by Amazon Professional**\n📅 Date: TBA\n⏰ Time: 6:00 PM - 8:00 PM\n📍 Online Webinar\n\nWe host 20+ events per year including workshops, hackathons, and AMA sessions!",
        quickActions: [
          { label: "Join Events Group", action: "events-group" },
          { label: "Event Registration", action: "register" },
          { label: "Past Events", action: "past-events" }
        ]
      };
    }

    if (lowerInput.includes('language') || lowerInput.includes('python') || lowerInput.includes('javascript') || lowerInput.includes('java') || lowerInput.includes('c++')) {
      return {
        text: "We support multiple programming languages! 💻\n\n🐍 **Python** - Most popular in our community\n⚡ **JavaScript** - Web development focus\n☕ **Java** - Enterprise and Android development\n🚀 **C++** - System programming and competitive coding\n🔧 **Go** - Modern backend development\n⚙️ **C** - Foundation programming\n\nWhich language are you interested in learning?",
        quickActions: [
          { label: "Python Resources", action: "python" },
          { label: "JavaScript Resources", action: "javascript" },
          { label: "Join Study Group", action: "study-group" }
        ]
      };
    }

    if (lowerInput.includes('career') || lowerInput.includes('internship') || lowerInput.includes('job')) {
      return {
        text: "🚀 **Career Support at CodeNeuraX:**\n\n• 50+ internship opportunities supported\n• Regular industry AMA sessions\n• Resume review and feedback\n• Interview preparation guidance\n• Direct connections with industry professionals\n• Job referrals from our network\n\nOur career group is very active with daily opportunities!",
        quickActions: [
          { label: "Join Career Group", action: "career-group" },
          { label: "Internship Tips", action: "internship-tips" },
          { label: "Resume Help", action: "resume" }
        ]
      };
    }

    if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email')) {
      return {
        text: "📞 **Get in Touch:**\n\n📧 **Email:** For partnerships and inquiries\n📱 **WhatsApp:** Join our community groups\n💼 **LinkedIn:** Professional networking\n📸 **Instagram:** Community highlights\n🎥 **YouTube:** Tutorials and recorded events\n\nWhat's the best way for you to connect?",
        quickActions: [
          { label: "Join WhatsApp", action: "join" },
          { label: "Email Inquiry", action: "email" },
          { label: "Social Media", action: "social" }
        ]
      };
    }

    if (lowerInput.includes('founder') || lowerInput.includes('dinesh') || lowerInput.includes('team')) {
      return {
        text: "👨‍💻 **About Our Founder:**\n\nCodeNeuraX was founded in 2025 by Dinesh Yadav, a passionate tech enthusiast dedicated to building inclusive communities for computer science students and recent graduates.\n\nOur mission is to create collective intelligence where members exchange ideas, showcase work, seek mentorship, and support each other's tech journeys.",
        quickActions: [
          { label: "Community Values", action: "values" },
          { label: "Join Community", action: "join" },
          { label: "Success Stories", action: "stories" }
        ]
      };
    }

    if (lowerInput.includes('challenge') || lowerInput.includes('coding challenge') || lowerInput.includes('interview')) {
      return {
        text: "💪 **Coding Challenges:**\n\n• Weekly coding challenges\n• Interview preparation problems\n• Competitive programming contests\n• Peer discussions and solutions\n• Progress tracking and leaderboards\n\nPerfect for sharpening your problem-solving skills!",
        quickActions: [
          { label: "Join Coding Group", action: "coding-group" },
          { label: "Current Challenges", action: "current-challenges" },
          { label: "Interview Prep", action: "interview-prep" }
        ]
      };
    }

    // Default response for unrecognized input
    return {
      text: "I'd be happy to help! Here are some things I can assist you with:",
      quickActions: [
        { label: "About CodeNeuraX", action: "about" },
        { label: "Join Community", action: "join" },
        { label: "Upcoming Events", action: "events" },
        { label: "Programming Languages", action: "languages" },
        { label: "Career Support", action: "career" },
        { label: "Contact Info", action: "contact" }
      ]
    };
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue.trim());
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        const response = getBotResponse(inputValue.trim());
        setIsTyping(false);
        addBotMessage(response.text, response.quickActions);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const response = getBotResponse(action);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage(response.text, response.quickActions);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
      >
        <MessageCircle size={24} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          AI
        </span>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">CodeNeuraX Assistant</h3>
                <p className="text-sm opacity-90">Always ready to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  {message.quickActions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.action)}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot ? 'order-1 mr-2 bg-gradient-to-r from-blue-600 to-purple-600' : 'order-2 ml-2 bg-gray-300'
                }`}>
                  {message.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600" />}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-gradient-to-r from-blue-600 to-purple-600">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CodeNeuraX..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;