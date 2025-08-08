import { useState, useEffect } from 'react'
import { io } from "socket.io-client";
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])

  const getTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const handleSend = () => {
    if (input.trim() === '' || !socket) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      timestamp: getTimestamp(),
      sender: 'You'
    };
    setHistory(prevHistory => [...prevHistory, userMessage]);
    socket.emit('User', input);
    setInput('');
  };

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    socketInstance.on('prompt-response', (response) => {
      const botMessage = {
        id: Date.now(),
        text: response,
        timestamp: getTimestamp(),
        sender: 'Bot'
      };
      setHistory(prevHistory => [...prevHistory, botMessage]);
    });
  }, []);

  return (
    <div className={`chatgpt-ui ${theme}`}>
      <header>
        <div className="logo-title">
          <img src="https://raw.githubusercontent.com/github/explore/main/topics/chatgpt/chatgpt.png" alt="Samvaad.Ai Logo" className="samvaad-logo" />
          <h1>Samvaad.Ai</h1>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
        </button>
      </header>
      <div className="chat-history">
        {history.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.sender === 'You' ? 'user' : 'bot'}`}>
            <span className="chat-user">{msg.sender}:</span> {msg.text}
            <div className="chat-timestamp">{msg.timestamp}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default App
