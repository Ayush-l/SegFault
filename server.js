const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Keep track of connected users and available peers
let availablePeers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Add the user to the list of available peers
    availablePeers.push(socket.id);

    // Handle request for a new chat partner
    socket.on('findPartner', () => {
        const partner = availablePeers.find(peer => peer !== socket.id);

        if (partner) {
            // Notify both users to start the chat
            io.to(socket.id).emit('partnerFound', partner);
            io.to(partner).emit('partnerFound', socket.id);

            // Remove both users from the list of available peers
            availablePeers = availablePeers.filter(peer => peer !== socket.id && peer !== partner);
        }
    });

    // Handle offer signaling
    socket.on('offer', ({ partnerId, offer }) => {
        io.to(partnerId).emit('offer', { senderId: socket.id, offer });
    });

    // Handle answer signaling
    socket.on('answer', ({ partnerId, answer }) => {
        io.to(partnerId).emit('answer', { senderId: socket.id, answer });
    });

    // Handle ICE candidates
    socket.on('candidate', ({ partnerId, candidate }) => {
        io.to(partnerId).emit('candidate', { senderId: socket.id, candidate });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        availablePeers = availablePeers.filter(peer => peer !== socket.id);
        io.to(socket.id).emit('partnerDisconnected');
    });

    // Handle chat messages
    socket.on('message', ({ partnerId, message }) => {
        io.to(partnerId).emit('message', { senderId: socket.id, message });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
