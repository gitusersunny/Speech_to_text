import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [speechText, setSpeechText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechText((prev) => prev + transcript + " ");
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Browser not supported.");
    isListening
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
  };

  const handleSend = () => {
    if (!speechText.trim()) return;

    const newItem = {
      question: speechText,
      sql: `SELECT * FROM customers ORDER BY created_at DESC;`
    };

    setHistory((prev) => [...prev, newItem]);
    setSpeechText("");

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }, 100);
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="logo">
            <span>🛢</span>
            <span>Text2SQL.ai</span>
          </div>

          <div className="demo-box">
            You're not connected to database.
            <br />
            Connect your own database for queries.
            <div className="add-db">Add Database →</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">

        <div className="header">
          <div className="title">Dashboard</div>
          <div className="header-icons">
            <span>❓</span>
            <span>👤</span>
          </div>
        </div>

        {/* Scrollable Conversation */}
        <div className="scrollable-content" ref={scrollRef}>
          {history.map((item, index) => (
            <div key={index}>

              {/* Title recreated each time */}
              <div className="title-card">
                <h2>{item.question}</h2>
              </div>

              {/* SQL Card */}
              <div className="card">
                <div className="card-block">
                  <textarea value={item.sql} readOnly />
                </div>

                <div className="card-actions">
                  <button>Copy</button>
                  <button>Run</button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Ask Section */}
        <div className="ask-wrapper">
          <div className="ask-section">
            <textarea
              ref={inputRef}
              placeholder="Ask a question about your data..."
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              rows="1"
            />

            <button onClick={toggleListening} className="mic-btn">
              {isListening ? "🛑" : "🎤"}
            </button>

            <button onClick={handleSend} className="send-btn">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
