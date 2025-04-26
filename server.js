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

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
