import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'سلام! 👋 من دستیار هوش مصنوعی درنیکا هستم. چطور می‌تونم کمکتون کنم؟',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    'برای مشاهده محصولات لوله‌کشی به صفحه فروشگاه مراجعه کنید. دسته‌بندی‌های مختلفی از جمله PVC، پلی‌اتیلن و فلزی موجود است.',
    'محصولات استخری شامل پمپ تصفیه، فیلتر شنی، گرم‌کن و ربات نظافتی در فروشگاه موجود هستند.',
    'برای مشاوره رایگان درباره سیستم‌های گرمایشی و سرمایشی با شماره ۰۱-۱۲۳۴۵۶۷۸ تماس بگیرید.',
    'بله، ارسال به سراسر کشور انجام می‌شود. خریدهای بالای ۵ میلیون تومان ارسال رایگان دارند.',
    'ضمانت اصالت تمامی محصولات در فروشگاه درنیکا وجود دارد.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'bot',
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:bg-accent-dark transition-all duration-300 flex items-center justify-center chatbot-bounce"
        aria-label="پشتیبانی هوش مصنوعی"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up" role="dialog" aria-label="پشتیبانی هوش مصنوعی">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">دستیار هوش مصنوعی درنیکا</h3>
              <p className="text-xs text-gray-400">آنلاین • پاسخ فوری</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-light-bg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'bg-accent' : 'bg-primary'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-accent text-white rounded-br-md'
                        : 'bg-white border border-border text-primary rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 bg-light-bg border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent"
                aria-label="پیام"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center hover:bg-accent-dark transition-colors"
                aria-label="ارسال"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
