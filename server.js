const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve everything inside "public" folder
app.use(express.static('public'));

// Listen for connections from clients
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for data from master and send to everyone else
    socket.on('update-data', (data) => {
        socket.broadcast.emit('sync-data', data);
    });
  
  // Listen for timer control changes and sync across all devices
    socket.on('timer-control', (data) => {
        console.log('Timer control action:', data);
        socket.broadcast.emit('timer-control', data);  // Broadcast timer action to other clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Use Glitch's provided dynamic port, or default to 3000 if testing locally
const PORT = process.env.PORT || 3000; // use Glitch-provided PORT or 3000 for local testing
http.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
