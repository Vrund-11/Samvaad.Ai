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
    if (input.trim() === '') return
    setHistory([...history, { user: 'You', message: input, time: getTimestamp() }])

    const userMessage = {
      id: Date.now(),
      text: input,
      timestamp: getTimestamp(),
      sender: 'User'
    };
    setTimeout(() => {
      setHistory(prevHistory => [...prevHistory, userMessage]);
    }, 500)

    socket.emit('User', input);

    setInput('');
  }

  useEffect(() => {
    var socketInstance = io('http://localhost:3000');
    setSocket[socketInstance];

    socketInstance.on('ai_response', (response) => {

      const botMessage = {
        id: 1,
        text: response,
        timestamp: getTimestamp(),
        sender: 'Bot'
      };

      setHistory(prevHistory => [...prevHistory, botMessage]);
    })
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
        {history.map((msg, idx) => (
          <div key={idx} className={`chat-msg ${msg.user === 'You' ? 'user' : 'bot'}`}>
            <span className="chat-user">{msg.user}:</span> {msg.message}
            <div className="chat-timestamp">{msg.time}</div>
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
