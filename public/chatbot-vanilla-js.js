// CodeNeuraX Chatbot - Vanilla JavaScript Version
// Add this script to your website and include the CSS styles

class CodeNeuraXChatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createChatbot();
        this.bindEvents();
    }

    createChatbot() {
        // Create chatbot HTML structure
        const chatbotHTML = `
            <!-- Chat Button -->
            <button id="cnx-chat-button" class="cnx-chat-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="cnx-chat-badge">AI</span>
            </button>

            <!-- Chat Interface -->
            <div id="cnx-chat-interface" class="cnx-chat-interface cnx-hidden">
                <!-- Header -->
                <div class="cnx-chat-header">
                    <div class="cnx-chat-header-info">
                        <div class="cnx-chat-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 8V4H8"></path>
                                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                                <path d="M2 14h2"></path>
                                <path d="M20 14h2"></path>
                                <path d="M15 13v2"></path>
                                <path d="M9 13v2"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="cnx-chat-title">CodeNeuraX Assistant</h3>
                            <p class="cnx-chat-subtitle">Always ready to help!</p>
                        </div>
                    </div>
                    <button id="cnx-close-button" class="cnx-close-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m18 6-12 12"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Messages -->
                <div id="cnx-messages-container" class="cnx-messages-container">
                    <!-- Messages will be added here dynamically -->
                </div>

                <!-- Input -->
                <div class="cnx-chat-input-container">
                    <div class="cnx-chat-input-wrapper">
                        <input
                            type="text"
                            id="cnx-message-input"
                            placeholder="Ask me anything about CodeNeuraX..."
                            class="cnx-message-input"
                        />
                        <button id="cnx-send-button" class="cnx-send-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m22 2-7 20-4-9-9-4Z"></path>
                                <path d="M22 2 11 13"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS styles
        const styles = `
            <style>
                .cnx-chat-button {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 1000;
                    background: linear-gradient(to right, #2563eb, #9333ea);
                    color: white;
                    padding: 16px;
                    border-radius: 50%;
                    border: none;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cnx-chat-button:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    transform: scale(1.1);
                }

                .cnx-chat-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    font-size: 12px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: bounce 1s infinite;
                }

                .cnx-chat-interface {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 1000;
                    width: 384px;
                    height: 500px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    border: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                }

                .cnx-hidden {
                    display: none !important;
                }

                .cnx-chat-header {
                    background: linear-gradient(to right, #2563eb, #9333ea);
                    color: white;
                    padding: 16px;
                    border-radius: 16px 16px 0 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .cnx-chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .cnx-chat-avatar {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px;
                    border-radius: 50%;
                }

                .cnx-chat-title {
                    font-weight: 600;
                    margin: 0;
                    font-size: 16px;
                }

                .cnx-chat-subtitle {
                    font-size: 14px;
                    opacity: 0.9;
                    margin: 0;
                }

                .cnx-close-button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }

                .cnx-close-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .cnx-messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .cnx-message {
                    display: flex;
                }

                .cnx-message.cnx-user {
                    justify-content: flex-end;
                }

                .cnx-message.cnx-bot {
                    justify-content: flex-start;
                }

                .cnx-message-content {
                    max-width: 80%;
                }

                .cnx-message-bubble {
                    padding: 12px;
                    border-radius: 16px;
                    font-size: 14px;
                    white-space: pre-wrap;
                }

                .cnx-message.cnx-user .cnx-message-bubble {
                    background: linear-gradient(to right, #2563eb, #9333ea);
                    color: white;
                }

                .cnx-message.cnx-bot .cnx-message-bubble {
                    background: #f3f4f6;
                    color: #374151;
                }

                .cnx-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .cnx-message.cnx-bot .cnx-message-avatar {
                    background: linear-gradient(to right, #2563eb, #9333ea);
                    margin-right: 8px;
                    order: 1;
                }

                .cnx-message.cnx-user .cnx-message-avatar {
                    background: #d1d5db;
                    margin-left: 8px;
                    order: 2;
                }

                .cnx-message.cnx-bot .cnx-message-content {
                    order: 2;
                }

                .cnx-message.cnx-user .cnx-message-content {
                    order: 1;
                }

                .cnx-quick-actions {
                    margin-top: 8px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .cnx-quick-action-btn {
                    font-size: 12px;
                    background: #eff6ff;
                    color: #2563eb;
                    padding: 4px 12px;
                    border-radius: 20px;
                    border: 1px solid #dbeafe;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .cnx-quick-action-btn:hover {
                    background: #dbeafe;
                }

                .cnx-chat-input-container {
                    padding: 16px;
                    border-top: 1px solid #e5e7eb;
                }

                .cnx-chat-input-wrapper {
                    display: flex;
                    gap: 8px;
                }

                .cnx-message-input {
                    flex: 1;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 14px;
                    outline: none;
                }

                .cnx-message-input:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                .cnx-send-button {
                    background: linear-gradient(to right, #2563eb, #9333ea);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    padding: 8px;
                    cursor: pointer;
                    transition: box-shadow 0.2s;
                }

                .cnx-send-button:hover {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .cnx-send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .cnx-typing-indicator {
                    display: flex;
                    justify-content: flex-start;
                }

                .cnx-typing-dots {
                    background: #f3f4f6;
                    padding: 12px;
                    border-radius: 16px;
                    display: flex;
                    gap: 4px;
                }

                .cnx-typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #9ca3af;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out both;
                }

                .cnx-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .cnx-typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }

                @media (max-width: 480px) {
                    .cnx-chat-interface {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 100px);
                        bottom: 16px;
                        right: 16px;
                    }
                }
            </style>
        `;

        // Add styles and HTML to the page
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        // Get DOM elements
        this.chatButton = document.getElementById('cnx-chat-button');
        this.chatInterface = document.getElementById('cnx-chat-interface');
        this.closeButton = document.getElementById('cnx-close-button');
        this.messagesContainer = document.getElementById('cnx-messages-container');
        this.messageInput = document.getElementById('cnx-message-input');
        this.sendButton = document.getElementById('cnx-send-button');
    }

    bindEvents() {
        this.chatButton.addEventListener('click', () => this.openChat());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    openChat() {
        this.isOpen = true;
        this.chatButton.classList.add('cnx-hidden');
        this.chatInterface.classList.remove('cnx-hidden');
        
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addBotMessage(
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
    }

    closeChat() {
        this.isOpen = false;
        this.chatButton.classList.remove('cnx-hidden');
        this.chatInterface.classList.add('cnx-hidden');
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.addUserMessage(message);
            this.messageInput.value = '';
            this.showTyping();
            
            setTimeout(() => {
                this.hideTyping();
                const response = this.getBotResponse(message);
                this.addBotMessage(response.text, response.quickActions);
            }, 1000);
        }
    }

    addUserMessage(text) {
        const messageId = Date.now().toString();
        const message = { id: messageId, text, isBot: false, timestamp: new Date() };
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    addBotMessage(text, quickActions = []) {
        const messageId = Date.now().toString();
        const message = { id: messageId, text, isBot: true, timestamp: new Date(), quickActions };
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `cnx-message ${message.isBot ? 'cnx-bot' : 'cnx-user'}`;
        
        const avatarIcon = message.isBot ? 
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>' :
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';

        messageDiv.innerHTML = `
            <div class="cnx-message-avatar">
                ${avatarIcon}
            </div>
            <div class="cnx-message-content">
                <div class="cnx-message-bubble">
                    ${message.text}
                </div>
                ${message.quickActions ? this.renderQuickActions(message.quickActions) : ''}
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);

        // Add event listeners to quick action buttons
        if (message.quickActions) {
            const buttons = messageDiv.querySelectorAll('.cnx-quick-action-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.getAttribute('data-action');
                    this.handleQuickAction(action);
                });
            });
        }
    }

    renderQuickActions(quickActions) {
        return `
            <div class="cnx-quick-actions">
                ${quickActions.map(action => 
                    `<button class="cnx-quick-action-btn" data-action="${action.action}">
                        ${action.label}
                    </button>`
                ).join('')}
            </div>
        `;
    }

    handleQuickAction(action) {
        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            const response = this.getBotResponse(action);
            this.addBotMessage(response.text, response.quickActions);
        }, 800);
    }

    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.id = 'cnx-typing-indicator';
        typingDiv.className = 'cnx-typing-indicator';
        typingDiv.innerHTML = `
            <div class="cnx-message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                </svg>
            </div>
            <div class="cnx-typing-dots">
                <div class="cnx-typing-dot"></div>
                <div class="cnx-typing-dot"></div>
                <div class="cnx-typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typingIndicator = document.getElementById('cnx-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('about') || lowerInput.includes('what is codeneura')) {
            return {
                text: "CodeNeuraX is a student-led tech community founded in 2025 by Dinesh Yadav. We connect, inspire, and empower the next generation of coders, developers, and innovators. With 2100+ active members, we offer:\n\n• 4 specialized WhatsApp groups\n• Monthly workshops and events\n• Coding challenges and competitions\n• Career guidance and internship support\n• Learning resources for multiple programming languages",
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

        // Default response
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
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeNeuraXChatbot();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeNeuraXChatbot;
}
