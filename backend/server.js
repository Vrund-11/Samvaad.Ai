require('dotenv').config();
const app = require('./src/app');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const GenerateResponse = require('./services/ai.service')

const httpserver = createServer(app);
const io = new Server(httpserver , {
    cors : {
        origin : "http://localhost:5173" ,
    }
});

const chatHirstory = [

];



io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    socket.on('User', async (user_que) => {
        chatHirstory.push({
            role: 'user',
            parts: [{ text: user_que }]
        });

        const ai_response = await GenerateResponse(user_que);
        chatHirstory.push({
            role: 'model',
            parts: [{ text: ai_response }]
        });

        socket.emit('prompt-response', ai_response)
    })
});


httpserver.listen(3000, () => {
    console.log('Server is running on port 3000');
});