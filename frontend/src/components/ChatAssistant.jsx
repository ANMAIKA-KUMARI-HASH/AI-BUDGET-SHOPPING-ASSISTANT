import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ExternalLink, Bot, User, IndianRupee, Camera } from 'lucide-react';

export default function ChatAssistant({ onSelectBudgetAndCategory, onOpenScanner, onOpenTracker }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Shopping Assistant. 🛍️ Tell me what you want to buy and your budget (e.g. "Smartphone under ₹20,000" or "Track my budget")!',
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Smartphones under ₹20,000',
    'Track my shopping budget',
    'Laptops under ₹40,000 for coding',
    'Wireless headphones under ₹2,000'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText) => {
    const query = messageText || input;
    if (!query.trim() || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply,
            products: data.products || []
          }
        ]);

        // Sync with parent page filters if detected
        if (data.budget || data.category) {
          onSelectBudgetAndCategory?.(data.budget, data.category);
        }

        // Open budget tracker if requested
        if (data.openTracker) {
          onOpenTracker?.();
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'Sorry, I encountered an issue processing that. Please try again with a budget and product type.',
            products: []
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Unable to reach backend chat server. Please make sure the server is running on port 5000.',
          products: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          zIndex: 1040,
          border: '3px solid #fff'
        }}
        title="Chat with AI Assistant"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            height: '520px',
            zIndex: 1040,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div className="card-header bg-primary text-white p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-1 rounded-circle bg-white text-primary d-inline-flex">
                <Bot size={18} />
              </span>
              <div>
                <h6 className="mb-0 fw-bold">AI Budget Assistant</h6>
                <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
                  Live Natural Language Recommender
                </small>
              </div>
            </div>
            <button
              className="btn btn-sm btn-link text-white p-0 text-decoration-none"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-light border-bottom overflow-auto text-nowrap d-flex gap-1 align-items-center" style={{ fontSize: '0.75rem' }}>
            {onOpenScanner && (
              <button
                type="button"
                className="btn btn-sm btn-primary text-white px-2 py-1 rounded-pill d-flex align-items-center gap-1 shadow-sm"
                onClick={() => {
                  setIsOpen(false);
                  onOpenScanner();
                }}
              >
                <Camera size={12} />
                <span>📷 Scan Product</span>
              </button>
            )}
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-sm btn-white bg-white border text-secondary px-2 py-1 rounded-pill"
                onClick={() => handleSend(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="card-body p-3 overflow-auto flex-grow-1 bg-light">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`d-flex mb-3 ${
                  m.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                }`}
              >
                <div
                  className={`p-3 rounded-4 shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-bottom-end-0'
                      : 'bg-white text-dark border rounded-bottom-start-0'
                  }`}
                  style={{ maxWidth: '85%', fontSize: '0.85rem' }}
                >
                  <div className="d-flex align-items-center gap-1 mb-1 small fw-bold opacity-75">
                    {m.sender === 'user' ? <User size={13} /> : <Sparkles size={13} className="text-warning" />}
                    <span>{m.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                  </div>

                  <p className="mb-0 text-break" style={{ whiteSpace: 'pre-line' }}>
                    {m.text}
                  </p>

                  {/* Attached mini product cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-2 pt-2 border-top d-flex flex-column gap-2">
                      {m.products.map((p) => {
                        const deal = p.platformLinks?.find((l) => l.isBestPrice) || p.platformLinks?.[0];
                        return (
                          <div
                            key={p.id}
                            className="bg-light p-2 rounded-3 border d-flex align-items-center justify-content-between gap-2"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="rounded-2"
                              style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="fw-bold text-dark text-truncate small">{p.name}</div>
                              <div className="text-primary fw-bold small">₹{p.price?.toLocaleString('en-IN')}</div>
                            </div>
                            {deal && (
                              <a
                                href={deal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm px-2 py-1 text-nowrap"
                                style={{ fontSize: '0.72rem' }}
                              >
                                Buy <ExternalLink size={10} className="ms-1" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="d-flex justify-content-start mb-2">
                <div className="bg-white p-2 px-3 rounded-4 border text-muted small d-flex align-items-center gap-2">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span>Analyzing products against your budget...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="card-footer bg-white p-2 border-top">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control form-control-sm rounded-pill"
                placeholder="Ask about budget or products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '34px', height: '34px' }}
                disabled={loading || !input.trim()}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
