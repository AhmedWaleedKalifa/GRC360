// components/AIChatBot.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTimes, faMessage } from '@fortawesome/free-solid-svg-icons';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: `initial-${Date.now()}`,
        role: 'model',
        text: "Hello! I'm GRC360, your Governance, Risk, and Compliance assistant. How can I help you with the application today?"
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (isLoading || !text.trim()) return;

    setIsLoading(true);
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text };
    const modelPlaceholder = { id: `model-${Date.now()}`, role: 'model', text: '' };

    const messagesWithUser = [...messages, userMessage];
    setMessages([...messagesWithUser, modelPlaceholder]);
    setInputText('');

    try {
      // Now using the same backend as your GRC app - FIXED URL
      const response = await fetch(API_BASE_URL+'/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messagesWithUser }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages(prev => prev.map(msg => 
          msg.id === modelPlaceholder.id ? { ...msg, text: fullResponse } : msg
        ));
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelPlaceholder.id ? { 
          ...msg, 
          text: `I'm having trouble connecting: ${error.message}` 
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-28 right-8 z-50 flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
          title="Open AI Assistant"
        >
          <FontAwesomeIcon icon={faRobot} className="text-xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-96 h-[600px] bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-400 dark:border-gray-700/40 flex flex-col backdrop-blur-lg bg-gradient-to-r from-white/20 via-transparent to-white/20 dark:from-black/20 dark:via-transparent dark:to-black/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-300/80 dark:bg-gray-700/80 rounded-t-2xl border-b border-gray-300/40 dark:border-gray-700/40">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-white text-sm" />
              </div>
              <div>
                <h3 className="text-gray-800 dark:text-gray-200 font-semibold">GRC360 Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">AI Support for GRC Application</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 controlIcons"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none shadow-xl'
                      : 'bg-gray-300/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-xl'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300/40 dark:border-gray-700/40">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about GRC, risks, compliance..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300/40 dark:border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm disabled:opacity-50 shadow-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-semibold shadow-sm dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatBot;