# Code Corrections

Here is a summary of the corrections made to the project.

## `frontend/src/App.jsx`

### 1. Incorrect State Update

**Wrong Code:**
```javascript
setSocket[socketInstance];
```

**Correct Code:**
```javascript
// Correctly update the socket state using the setter function
setSocket(socketInstance);
```
**Reasoning:** In React, state updates must be done using the setter function returned by the `useState` hook. The original code was using bracket notation, which is incorrect.

### 2. Duplicate Messages

**Wrong Code:**
```javascript
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
```

**Correct Code:**
```javascript
// This function now only adds the message to the history once.
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
```
**Reasoning:** The original `handleSend` function was adding the user's message to the history twice, causing duplicate messages. The corrected code adds the message only once.

### 3. Mismatched Socket Event

**Wrong Code:**
```javascript
socketInstance.on('ai_response', (response) => {
  // ...
});
```

**Correct Code:**
```javascript
// The event name now matches the one used in the backend.
socketInstance.on('prompt-response', (response) => {
  // ...
});
```
**Reasoning:** The frontend was listening for an `ai_response` event, but the backend was emitting a `prompt-response` event. The event names must match for communication to work.

### 4. Inconsistent Data Structure and `key` Prop

**Wrong Code:**
```javascript
{history.map((msg, idx) => (
  <div key={idx} className={`chat-msg ${msg.user === 'You' ? 'user' : 'bot'}`}>
    <span className="chat-user">{msg.user}:</span> {msg.message}
    <div className="chat-timestamp">{msg.time}</div>
  </div>
))}
```

**Correct Code:**
```javascript
// The history is now mapped correctly with a unique key and consistent data structure.
{history.map((msg) => (
  <div key={msg.id} className={`chat-msg ${msg.sender === 'You' ? 'user' : 'bot'}`}>
    <span className="chat-user">{msg.sender}:</span> {msg.text}
    <div className="chat-timestamp">{msg.timestamp}</div>
  </div>
))}
```
**Reasoning:** The original code was using the array index as a `key`, which is not recommended. It was also accessing properties (`msg.user`, `msg.message`, `msg.time`) that were not consistently present in the `history` array. The corrected code uses a unique `id` for the `key` and accesses the correct properties (`msg.sender`, `msg.text`, `msg.timestamp`).

## `backend/server.js`

### 1. Typo in Variable Name

**Wrong Code:**
```javascript
const chatHirstory = [];
// ...
chatHirstory.push({
  // ...
});
```

**Correct Code:**
```javascript
// Corrected the typo from chatHirstory to chatHistory.
const chatHistory = [];
// ...
chatHistory.push({
  // ...
});
```
**Reasoning:** There was a typo in the `chatHistory` variable name. This has been corrected for consistency and readability.
