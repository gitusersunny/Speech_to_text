import React, { useState, useEffect, useRef } from 'react';

const SpeechInput = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/process-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }), // matches the "content" field in Python
    });

    const data = await response.json();
    
    if (data.status === "success") {
      alert("API Response: " + data.message);
      setText(''); // Clear the input after successful send
    }
  } catch (error) {
    console.error("Error sending data to API:", error);
    alert("Failed to connect to the server.");
  }
};

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (inputRef.current) inputRef.current.focus();
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => prev + transcript + " "); 
      };

      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Browser not supported.");
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '600px', 
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Click the mic and start speaking..."
          style={{
            width: '100%',
            padding: '15px 50px 15px 20px',
            borderRadius: '30px',
            border: '2px solid #007bff',
            fontSize: '18px',
            outline: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={toggleListening}
          className={isListening ? 'mic-active' : ''}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

      {/* CONDITIONAL RENDERING: Only shows if text.length > 0 */}
      {text.trim().length > 0 && (
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'opacity 0.3s ease'
          }}
        >
          ➤
        </button>
      )}
    </div>
  );
};

export default SpeechInput;